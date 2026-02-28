export const calculateMetrics = (pricePaid: number, quantity: number, currentPrice: number | null) => {
  const costBasis = pricePaid * quantity;
  const currentValue = currentPrice !== null ? currentPrice * quantity : 0;
  const pnl = currentValue - costBasis;
  const gainPercentage = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

  return {
    costBasis: Number(costBasis.toFixed(2)),
    currentValue: Number(currentValue.toFixed(2)),
    pnl: Number(pnl.toFixed(2)),
    gainPercentage: Number(gainPercentage.toFixed(2))
  };
};