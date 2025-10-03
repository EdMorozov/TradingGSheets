function CalcProfitPercents(spent, received) {
    if (spent === 0 || received == 0) 
      return 0;

    const profitPercent = ((received - Math.abs(spent)) / Math.abs(spent)) * 100;
    return parseFloat(profitPercent.toFixed(2));
}

// Export functions for Node.js testing
// When using in Google Apps Script, these exports will be ignored
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CalcProfitPercents };
}