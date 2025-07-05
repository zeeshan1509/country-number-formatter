#!/usr/bin/env node

const { CountryLocaleFormatter } = require('./dist/index.js');

async function demoBothStringMethods() {
  console.log('🌍 String Formatting Demo - Both Methods\n');

  const formatter = new CountryLocaleFormatter();
  
  // Initialize the formatter
  await formatter.initialize(false, 'US');
  
  const testString = "Our sales were 1234567.89 last quarter and 9876543.21 this quarter. We have 15000 customers.";
  
  console.log('Original string:');
  console.log(`"${testString}"\n`);

  // Test formatStringNumbers (detailed method)
  console.log('📊 Using formatStringNumbers (returns detailed info):');
  const detailedResult = formatter.formatStringNumbers(testString, 'DE', 2);
  console.log('Formatted string:', `"${detailedResult.formattedString}"`);
  console.log('Numbers found:', detailedResult.numbersFound);
  console.log('Country used:', detailedResult.countryUsed);
  console.log('Replacements:', detailedResult.replacements);
  console.log();

  // Test formatNumbersInString (simple method)
  console.log('✨ Using formatNumbersInString (returns only formatted string):');
  const simpleResult = formatter.formatNumbersInString(testString, 'DE', 2);
  console.log('Formatted string:', `"${simpleResult}"`);
  console.log();

  // Compare different countries
  console.log('🌐 Same string formatted for different countries:');
  
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IN', name: 'India' }
  ];

  countries.forEach(country => {
    const result = formatter.formatNumbersInString(testString, country.code, 2);
    console.log(`${country.name} (${country.code}): "${result}"`);
  });

  console.log('\n✅ Demo completed successfully!');
}

// Run the demo
demoBothStringMethods().catch(console.error);
