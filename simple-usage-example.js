#!/usr/bin/env node

// Simple usage example for the new formatNumbersInString method

const { CountryLocaleFormatter } = require('./dist/index.js');

async function simpleUsageExample() {
  console.log('✨ Simple String Formatting Usage Examples\n');

  const formatter = new CountryLocaleFormatter();
  await formatter.initialize(false, 'US');

  // Example 1: Basic usage
  const text1 = "Price: 1234.56 and quantity: 100";
  const result1 = formatter.formatNumbersInString(text1, 'US');
  console.log('Example 1 - US formatting:');
  console.log(`Input:  "${text1}"`);
  console.log(`Output: "${result1}"\n`);

  // Example 2: German formatting with decimal places
  const text2 = "Sales: 999999.5 and costs: 123456.789";
  const result2 = formatter.formatNumbersInString(text2, 'DE', 2);
  console.log('Example 2 - German formatting with 2 decimal places:');
  console.log(`Input:  "${text2}"`);
  console.log(`Output: "${result2}"\n`);

  // Example 3: Indian formatting
  const text3 = "Population: 1400000000 and GDP: 3500000000000";
  const result3 = formatter.formatNumbersInString(text3, 'IN', 0);
  console.log('Example 3 - Indian formatting with no decimals:');
  console.log(`Input:  "${text3}"`);
  console.log(`Output: "${result3}"\n`);

  // Example 4: Mixed content
  const text4 = "Temperature is 98.6 degrees, humidity 45.2%, and pressure 1013.25 hPa";
  const result4 = formatter.formatNumbersInString(text4, 'FR', 1);
  console.log('Example 4 - French formatting with 1 decimal place:');
  console.log(`Input:  "${text4}"`);
  console.log(`Output: "${result4}"\n`);

  console.log('🎯 Key Benefits:');
  console.log('✅ Simple API - just pass string and country');
  console.log('✅ Returns only the formatted string');
  console.log('✅ Optional decimal place control');
  console.log('✅ Works with any supported country');
  console.log('✅ Available in both Node.js and React');
}

simpleUsageExample().catch(console.error);
