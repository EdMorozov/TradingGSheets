function CalcProfitPercents(spent, received) {
    if (spent === 0 || received == 0) 
      return 0;

    const profitPercent = ((received - Math.abs(spent)) / Math.abs(spent)) * 100;
    return parseFloat(profitPercent.toFixed(2));
}

/**
 * Running average cost basis using total spend column (H).
 *
 * @param {range} qtyRange - Trade quantities (positive=buy, negative=sell)
 * @param {range} spendRange - Total spent per trade (already includes fees)
 * @return Average cost per share up to last row in the range
 */
function CalcAvgTrade(qtyRange, spendRange) {
  let totalShares = 0;
  let totalCost = 0;

  for (let i = 0; i < qtyRange.length; i++) {
    const qty = Number(qtyRange[i][0]);
    const spend = Number(spendRange[i][0]); // this is column H value

    if (qty > 0) {
      // Buy
      totalShares += qty;
      totalCost += spend;
    } else if (qty < 0) {
      // Sell
      const sharesToSell = -qty;
      const avgPrice = totalShares > 0 ? totalCost / totalShares : 0;

      totalShares -= sharesToSell;
      totalCost -= sharesToSell * avgPrice;
    }
  }

  return totalShares > 0 ? totalCost / totalShares : 0;
}