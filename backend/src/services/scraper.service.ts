import puppeteer from 'puppeteer';
import { logger } from '../config/logger';

export class ScraperError extends Error {
  constructor(public type: 'NOT_FOUND' | 'STRUCTURE_CHANGE' | 'NETWORK_ERROR', message: string) {
    super(message);
    this.name = 'ScraperError';
  }
}

export const scrapeCardPrice = async (cardName: string, attempt = 1): Promise<number> => {
  const MAX_ATTEMPTS = 3;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
    
    // Navigate to SCG search
    const url = `https://starcitygames.com/search/?search_query=${encodeURIComponent(cardName)}`;
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    if (!response || !response.ok()) {
      throw new ScraperError('NETWORK_ERROR', `Failed to load page: ${response?.status()}`);
    }

    // SCG uses Hawksearch. Wait for product grid or no results.
    const priceSelector = '.hawk-results-item .hawk-results-item__price';
    const noResultsSelector = '.hawk-no-results';

    try {
      await page.waitForSelector(`${priceSelector}, ${noResultsSelector}`, { timeout: 10000 });
    } catch (e) {
      throw new ScraperError('STRUCTURE_CHANGE', 'Could not find price or no-results selector.');
    }

    const isNotFound = await page.$(noResultsSelector);
    if (isNotFound) {
      throw new ScraperError('NOT_FOUND', `Card not found: ${cardName}`);
    }

    const priceText = await page.$eval(priceSelector, el => el.textContent?.trim() || '');
    const priceMatch = priceText.match(/\$([0-9,.]+)/);

    if (!priceMatch) {
      throw new ScraperError('STRUCTURE_CHANGE', 'Failed to parse price from element.');
    }

    return parseFloat(priceMatch[1].replace(',', ''));

  } catch (error) {
    logger.warn(`Scrape attempt ${attempt} failed for ${cardName}`, { error: (error as Error).message });
    if (attempt < MAX_ATTEMPTS) {
      return scrapeCardPrice(cardName, attempt + 1);
    }
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};