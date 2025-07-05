#!/usr/bin/env node

const { CountryLocaleFormatter } = require('./dist/index.js');

async function demoAutoOption() {
  console.log('🌍 Auto Country Detection Demo\n');

  const formatter = new CountryLocaleFormatter();
  
  // Initialize with auto-detection
  await formatter.initialize(true); // auto-detect = true
  
  const testString = "Price: 1234.56 and quantity: 100 items";
  
  console.log('🔍 Auto-detected country formatting:');
  console.log(`Input: "${testString}"`);
  
  // Use formatNumbersInString without specifying country (uses detected country)
  const autoResult = formatter.formatNumbersInString(testString, undefined, 2);
  console.log(`Auto:  "${autoResult}"`);
  
  const countryInfo = formatter.getCountryInfo();
  console.log(`Country detected: ${countryInfo?.countryName} (${countryInfo?.countryCode})`);
  console.log();
  
  console.log('🌐 Comparison with manual country selection:');
  const countries = ['US', 'DE', 'FR', 'IN'];
  
  countries.forEach(country => {
    const result = formatter.formatNumbersInString(testString, country, 2);
    console.log(`${country}: "${result}"`);
  });
  
  console.log('\n💡 Note: In a real application:');
  console.log('- Auto detection uses IP geolocation');
  console.log('- Users can override with manual selection');
  console.log('- Falls back to default country if detection fails');
}

demoAutoOption().catch(console.error);
