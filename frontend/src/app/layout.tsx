import './globals.css';

export const metadata = {
  title: 'MTG Portfolio Tracker',
  description: 'Track your Magic: The Gathering collection value.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}