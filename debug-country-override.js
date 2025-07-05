const { CountryLocaleFormatter } = require('./dist/index.js');

async function testCountryOverride() {
  const formatter = new CountryLocaleFormatter();

  console.log('🧪 Testing Country Override in formatNumbersInString\n');

  // Initialize with Switzerland (CH)
  await formatter.initialize('CH');
  console.log('✅ Initialized with CH (Switzerland)');
  
  const currentCountry = formatter.getCountryInfo();
  console.log(`Current country: ${currentCountry?.countryCode} (${currentCountry?.countryName})`);
  console.log(`Current locale: ${currentCountry?.locale}`);
  console.log(`Current currency: ${currentCountry?.currency}\n`);

  const testText = 'Amount: 1234.56 and total: 9876.54';
  
  // Test 1: Use current country (CH)
  console.log('--- Test 1: Using current country (CH) ---');
  const chFormatted = formatter.formatNumbersInString(testText);
  console.log(`CH Result: ${chFormatted}\n`);

  // Test 2: Override with Pakistan (PK)
  console.log('--- Test 2: Override with Pakistan (PK) ---');
  const pkFormatted = formatter.formatNumbersInString(testText, 'PK', 2);
  console.log(`PK Result: ${pkFormatted}\n`);

  // Test 3: Check what PK country info looks like
  console.log('--- Test 3: Pakistan Country Info ---');
  // Get PK info by creating a temporary formatter
  const tempFormatter = new CountryLocaleFormatter();
  await tempFormatter.initialize('PK');
  const pkCountryInfo = tempFormatter.getCountryInfo();
  console.log(`PK Country: ${pkCountryInfo.countryCode} (${pkCountryInfo.countryName})`);
  console.log(`PK Locale: ${pkCountryInfo.locale}`);
  console.log(`PK Currency: ${pkCountryInfo.currency}\n`);

  // Test 4: Manual formatting with PK
  console.log('--- Test 4: Manual Number Formatting with PK ---');
  const testNumber = 1234.56;
  // Test formatting using a dedicated PK formatter
  const pkFormatter = new CountryLocaleFormatter();
  await pkFormatter.initialize('PK');
  const pkManualFormat = pkFormatter.formatNumber(testNumber, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  console.log(`Manual PK format of ${testNumber}: ${pkManualFormat?.formatted}`);

  // Test 5: Compare with detailed method
  console.log('\n--- Test 5: Detailed String Method ---');
  const detailedResult = formatter.formatStringNumbers(testText, 'PK', 2);
  console.log(`Detailed PK Result: ${detailedResult.formattedString}`);
  console.log(`Country Used: ${detailedResult.countryUsed}`);
  console.log(`Numbers Found: ${detailedResult.numbersFound}`);
  console.log('Replacements:', detailedResult.replacements);
}

testCountryOverride().catch(console.error);
