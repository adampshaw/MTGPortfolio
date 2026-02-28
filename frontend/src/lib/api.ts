export interface CardMetric {
  id: string;
  cardName: string;
  pricePaid: string;
  quantity: number;
  currentPrice: string | null;
  costBasis: number;
  currentValue: number;
  pnl: number;
  gainPercentage: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const fetchCards = async (): Promise<CardMetric[]> => {
  const res = await fetch(`${API_URL}/cards`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch cards');
  return res.json();
};

export const addCard = async (payload: { cardName: string; pricePaid: number; quantity: number }) => {
  const res = await fetch(`${API_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add card');
  return res.json();
};