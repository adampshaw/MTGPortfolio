import { CardMetric } from '../lib/api';

export default function PortfolioTable({ cards }: { cards: CardMetric[] }) {
  if (cards.length === 0) {
    return <div className="bg-white p-6 rounded shadow-md text-center">No cards in portfolio.</div>;
  }

  return (
    <div className="bg-white rounded shadow-md overflow-x-auto">
      <table className="min-w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 font-semibold">Card Name</th>
            <th className="p-4 font-semibold">Qty</th>
            <th className="p-4 font-semibold">Cost Basis</th>
            <th className="p-4 font-semibold">Current Value</th>
            <th className="p-4 font-semibold">PnL</th>
            <th className="p-4 font-semibold">% Gain</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{card.cardName}</td>
              <td className="p-4">{card.quantity}</td>
              <td className="p-4">${card.costBasis.toFixed(2)}</td>
              <td className="p-4">${card.currentValue.toFixed(2)}</td>
              <td className={`p-4 font-bold ${card.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.pnl >= 0 ? '+' : ''}${card.pnl.toFixed(2)}
              </td>
              <td className={`p-4 font-bold ${card.gainPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.gainPercentage >= 0 ? '+' : ''}{card.gainPercentage.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}