'use client';

import { useState } from 'react';
import { addCard } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function CardForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      cardName: formData.get('cardName') as string,
      pricePaid: parseFloat(formData.get('pricePaid') as string),
      quantity: parseInt(formData.get('quantity') as string, 10),
    };

    try {
      await addCard(payload);
      router.refresh(); // Refresh server component
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError('Failed to save card. Please check input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Card</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Card Name</label>
          <input required name="cardName" type="text" className="w-full border rounded p-2" placeholder="e.g. Black Lotus" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price Paid ($)</label>
          <input required name="pricePaid" type="number" step="0.01" min="0" className="w-full border rounded p-2" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input required name="quantity" type="number" min="1" className="w-full border rounded p-2" placeholder="1" />
        </div>
        <div className="flex items-end">
          <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Card'}
          </button>
        </div>
      </div>
    </form>
  );
}