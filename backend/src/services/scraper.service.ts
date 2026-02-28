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
      headless: false, // change to false for testing (view scraper)
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
    
    // Navigate to SCG search
    const url = `https://starcitygames.com/search/?search_query=${encodeURIComponent(cardName)}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Hawksearch injects results dynamically via Vue.js. 
    // We must force the scraper to pause for 3 seconds to let the cards render on screen.
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Inject JavaScript directly into the browser to hunt for the price using text parsing
    const result = await page.evaluate((searchName) => {
      const pageText = document.body.innerText;
      
      // 1. Check if the page explicitly says no results
      if (pageText.includes("0 results for") || pageText.includes("We couldn't find any matches")) {
        return { error: 'NOT_FOUND' };
      }

      // 2. Find the individual product blocks
      const items = document.querySelectorAll('.hawk-results-item, article, .product-grid-item');
      
      for (const item of Array.from(items)) {
        // Read all the text inside this specific card's box
        const itemText = (item as HTMLElement).innerText;
        
        // If this box contains our exact card name
        if (itemText.toLowerCase().includes(searchName.toLowerCase())) {
          // Regex to find standard price format (e.g., $7.99)
          const priceMatch = itemText.match(/\$([0-9,]+\.[0-9]{2})/);
          if (priceMatch && parseFloat(priceMatch[1].replace(',', '')) > 0) {
            return { price: priceMatch[1] };
          }
        }
      }

      // 3. Bruteforce Fallback: find the card name on the page and grab the very next price that appears
      const nameIndex = pageText.toLowerCase().indexOf(searchName.toLowerCase());
      if (nameIndex !== -1) {
        const textAfterName = pageText.substring(nameIndex);
        const fallbackMatch = textAfterName.match(/\$([0-9,]+\.[0-9]{2})/);
        if (fallbackMatch && parseFloat(fallbackMatch[1].replace(',', '')) > 0) {
          return { price: fallbackMatch[1] };
        }
      }

      return { error: 'STRUCTURE_CHANGE' };
    }, cardName); // Pass the cardName into the browser context

    if (result.error === 'NOT_FOUND') {
      throw new ScraperError('NOT_FOUND', `Card not found: ${cardName}`);
    }

    if (result.error === 'STRUCTURE_CHANGE' || !result.price) {
      throw new ScraperError('STRUCTURE_CHANGE', 'Could not find price element on the loaded page.');
    }

    // Strip commas from numbers >= 1,000 before parsing
    return parseFloat(result.price.replace(/,/g, ''));

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