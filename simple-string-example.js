const { CountryLocaleFormatter } = require('country-locale-formatter');

// Simple usage example
async function formatStringExample() {
  const formatter = new CountryLocaleFormatter();
  
  // Initialize (you can skip this if you pass a country code to formatStringNumbers)
  await formatter.initialize(false, 'US');
  
  const inputString = "hello 12345 this is my string can 46893.344 you fix this";
  
  console.log('Original:', inputString);
  console.log('');
  
  // Example 1: Use current country (US), keep original decimal places
  const result1 = formatter.formatStringNumbers(inputString);
  console.log('US format (original decimals):', result1.formattedString);
  
  // Example 2: Use Switzerland, force 2 decimal places
  const result2 = formatter.formatStringNumbers(inputString, 'CH', 2);
  console.log('Switzerland format (2 decimals):', result2.formattedString);
  
  // Example 3: Use Germany, no decimals
  const result3 = formatter.formatStringNumbers(inputString, 'DE', 0);
  console.log('Germany format (no decimals):', result3.formattedString);
  
  console.log('');
  console.log('Details for Switzerland example:');
  console.log('Numbers found:', result2.numbersFound);
  console.log('Replacements:', result2.replacements);
}

formatStringExample().catch(console.error);
