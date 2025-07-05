const { CountryLocaleFormatter } = require('./dist/index.js');

async function testStringFormatting() {
  console.log('🧪 Testing String Formatting Methods\n');

  const formatter = new CountryLocaleFormatter();
  await formatter.initialize(false, 'US');

  const testString = "Price: 1234.56 and cost: 999.9 and quantity: 100";

  console.log('✅ Test 1: formatNumbersInString (simple method)');
  const simple = formatter.formatNumbersInString(testString, 'DE', 2);
  console.log(`Input:  "${testString}"`);
  console.log(`Output: "${simple}"`);
  console.log(`Type:   ${typeof simple}`);
  console.log();

  console.log('✅ Test 2: formatStringNumbers (detailed method)');
  const detailed = formatter.formatStringNumbers(testString, 'DE', 2);
  console.log(`Input:  "${testString}"`);
  console.log(`Output: "${detailed.formattedString}"`);
  console.log(`Type:   ${typeof detailed}`);
  console.log(`Numbers found: ${detailed.numbersFound}`);
  console.log(`Country used: ${detailed.countryUsed}`);
  console.log('Replacements:', detailed.replacements);
  console.log();

  console.log('✅ Test 3: Verify they produce the same formatted string');
  const match = simple === detailed.formattedString;
  console.log(`Simple result:   "${simple}"`);
  console.log(`Detailed result: "${detailed.formattedString}"`);
  console.log(`Match: ${match ? '✅ YES' : '❌ NO'}`);
  console.log();

  console.log('✅ Test 4: Different countries');
  const countries = ['US', 'FR', 'IN'];
  countries.forEach(country => {
    const result = formatter.formatNumbersInString(testString, country, 2);
    console.log(`${country}: "${result}"`);
  });

  console.log('\n🎉 All tests completed!');
}

testStringFormatting().catch(console.error);
