import { fetchCards } from '../lib/api';
import CardForm from '../components/CardForm';
import PortfolioTable from '../components/PortfolioTable';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const cards = await fetchCards();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">MTG Portfolio Tracker</h1>
      <CardForm />
      <PortfolioTable cards={cards} />
    </main>
  );
}