import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { scrapeCardPrice, ScraperError } from '../services/scraper.service';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

// Run daily at 02:00 AM
export const initCronJobs = () => {
  cron.schedule('* * * * *', async () => {
    logger.info('Starting daily card price scraping job');
    
    const cards = await prisma.cardEntry.findMany({
      select: { id: true, cardName: true }
    });

    for (const card of cards) {
      try {
        const currentPrice = await scrapeCardPrice(card.cardName);
        await prisma.cardEntry.update({
          where: { id: card.id },
          data: { currentPrice, lastChecked: new Date() }
        });
        logger.info(`Updated ${card.cardName} to $${currentPrice}`);
        // Delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        if (error instanceof ScraperError) {
          logger.error(`Scraper error for ${card.cardName}: ${error.type}`, { message: error.message });
        } else {
          logger.error(`Unknown error updating ${card.cardName}`, { error });
        }
      }
    }
    logger.info('Finished daily card price scraping job');
  });
};