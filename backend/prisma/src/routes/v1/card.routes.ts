import { Router } from 'express';
import { z } from 'zod';
import { getCards, addCard } from '../../controllers/card.controller';
import { validate } from '../../middleware/validateRequest';

const router = Router();

const cardSchema = z.object({
  body: z.object({
    cardName: z.string().min(1, 'Card name is required'),
    pricePaid: z.number().nonnegative('Price must be positive'),
    quantity: z.number().int().nonnegative('Quantity must be positive')
  })
});

router.get('/', getCards);
router.post('/', validate(cardSchema), addCard);

export default router;