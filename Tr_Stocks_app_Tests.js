// Import functions from main file
// Note: In Google Apps Script, these functions would be available globally
const { CalcProfitPercents } = require('./Tr_Stocks_app.js');

// ----------------- TEST CASES -----------------

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



// Run all tests
function runAllTests() {
  console.log("🧪 Running Unit Tests...");
  testCalcProfitPercents();
  console.log("\n✨ All tests completed!");
}

// Run tests
runAllTests();
