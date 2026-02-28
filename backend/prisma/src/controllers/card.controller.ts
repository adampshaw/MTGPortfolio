import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateMetrics } from '../utils/math';
import { logger } from '../config/logger';

const prisma = new PrismaClient();

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await prisma.cardEntry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const enrichedCards = cards.map(card => {
      const metrics = calculateMetrics(Number(card.pricePaid), card.quantity, card.currentPrice ? Number(card.currentPrice) : null);
      return { ...card, ...metrics };
    });

    res.json(enrichedCards);
  } catch (error) {
    logger.error('Failed to fetch cards', { error });
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
};

export const addCard = async (req: Request, res: Response) => {
  try {
    const { cardName, pricePaid, quantity } = req.body;
    
    const card = await prisma.cardEntry.create({
      data: {
        cardName,
        pricePaid,
        quantity
      }
    });

    res.status(201).json(card);
  } catch (error) {
    logger.error('Failed to add card', { error });
    res.status(500).json({ error: 'Failed to add card' });
  }
};