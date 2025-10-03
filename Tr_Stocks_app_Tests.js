// Import functions from main file
// Note: In Google Apps Script, these functions would be available globally
const { CalcProfitPercents, CalcAvgTrade } = require('./Tr_Stocks_app.js');

// ----------------- TEST CASES -----------------

// Example INTC trade (rows 8–9)
const qty_INT = [[96], [-96]];
const spend_INT = [[-3312], [3217.80]]; // Negative for buy, positive for sell

console.log("INTC row 8 avg:", CalcAvgTrade(qty_INT.slice(0,1), spend_INT.slice(0,1)));
console.log("INTC row 9 avg:", CalcAvgTrade(qty_INT, spend_INT));

// Example BABA trade (rows 12–17) - using real data with negative for buys
const qty_BABA = [[30], [34], [19], [21], [20], [-124]];
const spend_BABA = [[-5889.69], [-5473.20], [-2892.74], [-3070.11], [-2676.95], [22007.35]]; // Negative for buys, positive for sells

console.log("\nBABA row 12 avg:", CalcAvgTrade(qty_BABA.slice(0,1), spend_BABA.slice(0,1)));
console.log("BABA row 13 avg:", CalcAvgTrade(qty_BABA.slice(0,2), spend_BABA.slice(0,2)));
console.log("BABA row 14 avg:", CalcAvgTrade(qty_BABA.slice(0,3), spend_BABA.slice(0,3)));
console.log("BABA row 15 avg:", CalcAvgTrade(qty_BABA.slice(0,4), spend_BABA.slice(0,4)));
console.log("BABA row 16 avg:", CalcAvgTrade(qty_BABA.slice(0,5), spend_BABA.slice(0,5)));
console.log("BABA row 17 avg:", CalcAvgTrade(qty_BABA, spend_BABA));



// Simple Test Framework
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function assertAlmostEqual(actual, expected, tolerance = 0.01, message = "") {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`${message} Expected: ${expected}, Got: ${actual}, Diff: ${diff}`);
  }
}

function runTest(testName, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${testName}: PASS`);
  } catch (error) {
    console.log(`❌ ${testName}: FAIL - ${error.message}`);
  }
}

// Unit Tests for CalcProfitPercents
function testCalcProfitPercents() {
  console.log("\n=== Testing CalcProfitPercents ===");
  
  runTest("Loss scenario", () => {
    const result = CalcProfitPercents(-3316.73, 3220.80);
    assertAlmostEqual(result, -2.89, 0.01, "Loss calculation");
  });
  
  runTest("Profit scenario", () => {
    const result = CalcProfitPercents(-1000, 1200);
    assert(result === 20, `Expected 20%, got ${result}%`);
  });
  
  runTest("Zero spent", () => {
    const result = CalcProfitPercents(0, 1000);
    assert(result === 0, `Expected 0%, got ${result}%`);
  });
  
  runTest("Zero received", () => {
    const result = CalcProfitPercents(-1000, 0);
    assert(result === 0, `Expected 0%, got ${result}%`);
  });
  
  runTest("Break even", () => {
    const result = CalcProfitPercents(-100, 100);
    assert(result === 0, `Expected 0%, got ${result}%`);
  });
}

// Unit Tests for CalcAvgTrade
function testCostAvgTrade() {
  console.log("\n=== Testing CalcAvgTrade ===");
  
  runTest("Single buy trade", () => {
    const result = CalcAvgTrade([[100]], [[-1051]]); // 100 shares * $10.50 + $1 fee (negative for buy)
    assertAlmostEqual(result, 10.51, 0.01, "Single buy with fee");
  });

  runTest("Single buy (30 shares @ -5889.69)", () => {
    const result = CalcAvgTrade([[30]], [[-5889.69]]);
    // Expected: 5889.69 / 30 = 196.323
    assertAlmostEqual(result, 196.323, 0.01, "30 shares for $5889.69");
  });
  
  runTest("Buy then sell (INTC example)", () => {
    const qty = [[96], [-96]];
    const spend = [[-3312], [3217.80]]; // Negative for buy, positive for sell
    const result = CalcAvgTrade(qty, spend);
    assert(result === 0, `Expected 0 (all sold), got ${result}`);
  });
  
  runTest("Multiple buys (BABA real data)", () => {
    const qty = [[30], [34]];
    const spend = [[-5889.69], [-5473.20]]; // Negative for buys
    
    // After first buy: 30 shares for $5889.69
    const result1 = CalcAvgTrade(qty.slice(0, 1), spend.slice(0, 1));
    assertAlmostEqual(result1, 196.32, 0.01, "Average cost after 1st buy (30 shares)");
    
    // After second buy: 64 shares for $11362.89 total
    const result2 = CalcAvgTrade(qty, spend);
    assertAlmostEqual(result2, 177.55, 0.01, "Average cost after 2nd buy (64 shares)");
  });

  runTest("Multiple buys (XYZ simple)", () => {
    const qty = [[10], [20]];
    const spend = [[-1000], [-2400]]; // Negative for buys: 10 * $100, 20 * $120
    
    // After first buy: 10 shares for $1000
    const result1 = CalcAvgTrade(qty.slice(0, 1), spend.slice(0, 1));
    assertAlmostEqual(result1, 100, 0.01, "Average cost after 1st buy (10 shares @ $100)");
    
    // After second buy: 30 shares total for $3400
    // Expected average: $3400 / 30 = $113.33
    const result2 = CalcAvgTrade(qty, spend);
    assertAlmostEqual(result2, 113.33, 0.01, "Average cost after 2nd buy (30 shares)");
  });
  
  runTest("No trades", () => {
    const result = CalcAvgTrade([], []);
    assert(result === 0, `Expected 0, got ${result}`);
  });
  
  runTest("Only sells (should return 0)", () => {
    const qty = [[-50]];
    const spend = [[5000]]; // Positive for sell (money received)
    const result = CalcAvgTrade(qty, spend);
    assert(result === 0, `Expected 0, got ${result}`);
  });
}

// Run all tests
function runAllTests() {
  console.log("🧪 Running Unit Tests...");
  testCalcProfitPercents();
  testCostAvgTrade();
  console.log("\n✨ All tests completed!");
}

// Run tests
runAllTests();
