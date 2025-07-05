const { CountryLocaleFormatter } = require('./dist/index.js');

async function testCountryOverride() {
  const formatter = new CountryLocaleFormatter();

  // Initialize with CH (Switzerland)
  await formatter.initialize('CH');
  
  const testText = 'Amount: 1234.56';
  
  // Test 1: Format with current country (CH) 
  const chResult = formatter.formatNumbersInString(testText);
  console.log(`CH Format: ${chResult}`);
  
  // Test 2: Override with PK (Pakistan)
  const pkResult = formatter.formatNumbersInString(testText, 'PK', 2);
  console.log(`PK Override: ${pkResult}`);
  
  // Verify they are different
  const isOverrideWorking = chResult !== pkResult;
  console.log(`\n✅ Country override working: ${isOverrideWorking}`);
  console.log(`✅ CH uses apostrophe separator: ${chResult.includes("1'234")}`);
  console.log(`✅ PK uses comma separator: ${pkResult.includes("1,234")}`);
}

testCountryOverride().catch(console.error);
