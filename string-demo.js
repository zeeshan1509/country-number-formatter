const { CountryLocaleFormatter } = require('./dist/index.js');

async function demonstrateStringFormatting() {
  console.log('🔤 String Number Formatting Demo\n');
  
  const formatter = new CountryLocaleFormatter();
  
  // Initialize with US as default
  await formatter.initialize(false, 'US');
  console.log('✅ Initialized with US formatting\n');
  
  // Test string with multiple numbers
  const testString = "hello 12345 this is my string can 46893.344 you fix this and also 999.99 here";
  
  console.log('📝 Original string:', testString);
  console.log('');
  
  // Example 1: Format with current country (US) and no decimal changes
  console.log('🇺🇸 Format with US locale (no decimal changes):');
  const usResult = formatter.formatStringNumbers(testString);
  console.log('Formatted:', usResult.formattedString);
  console.log('Numbers found:', usResult.numbersFound);
  console.log('Replacements:', usResult.replacements);
  console.log('Country used:', usResult.countryUsed);
  console.log('');
  
  // Example 2: Format with Switzerland and 2 decimal places
  console.log('🇨🇭 Format with Switzerland locale and 2 decimal places:');
  const swissResult = formatter.formatStringNumbers(testString, 'CH', 2);
  console.log('Formatted:', swissResult.formattedString);
  console.log('Numbers found:', swissResult.numbersFound);
  console.log('Replacements:', swissResult.replacements);
  console.log('Country used:', swissResult.countryUsed);
  console.log('');
  
  // Example 3: Format with Germany and 0 decimal places
  console.log('🇩🇪 Format with Germany locale and 0 decimal places:');
  const germanResult = formatter.formatStringNumbers(testString, 'DE', 0);
  console.log('Formatted:', germanResult.formattedString);
  console.log('Numbers found:', germanResult.numbersFound);
  console.log('Replacements:', germanResult.replacements);
  console.log('Country used:', germanResult.countryUsed);
  console.log('');
  
  // Example 4: Different test strings
  console.log('🧪 Testing different string patterns:');
  
  const testCases = [
    "Price is 1299.99 and tax is 8.5 percent",
    "The population is 1234567 people in 2023",
    "Coordinates: 40.7128, -74.0060",
    "Version 1.2.3 costs $99.95",
    "Call 555-1234 for 25% discount on 1000 items"
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: "${testCase}"`);
    
    // Test with different countries
    const countries = ['US', 'CH', 'DE', 'FR'];
    countries.forEach(country => {
      const result = formatter.formatStringNumbers(testCase, country, 2);
      console.log(`  ${country}: "${result.formattedString}"`);
    });
  });
  
  console.log('\n🎉 String formatting demo completed!');
}

// Run the demo
demonstrateStringFormatting().catch(console.error);
