const { CountryLocaleFormatter } = require('./dist/index.js');

async function demo() {
  console.log('🌍 Country Number Formatter Demo\n');
  
  const formatter = new CountryLocaleFormatter();
  
  // Demo 1: Initialize with auto-detection (will fall back to default since no real IP)
  console.log('📍 Initializing formatter...');
  try {
    await formatter.initialize(true, 'US');
    console.log('✅ Initialized successfully');
  } catch (error) {
    console.log('⚠️  Auto-detection failed, using default country');
  }
  
  const countryInfo = formatter.getCountryInfo();
  console.log(`🏳️  Country: ${countryInfo?.countryName} (${countryInfo?.countryCode})`);
  console.log(`💰 Currency: ${countryInfo?.currency}`);
  console.log(`🌐 Locale: ${countryInfo?.locale}\n`);
  
  // Demo 2: Number formatting examples
  console.log('🔢 Number Formatting Examples:');
  const testNumber = 1234567.89;
  
  const formatted = formatter.formatNumber(testNumber);
  console.log(`Raw: ${testNumber}`);
  console.log(`Formatted: ${formatted?.formatted}`);
  console.log(`Decimal separator: "${formatted?.decimalSeparator}"`);
  console.log(`Thousand separator: "${formatted?.thousandSeparator}"\n`);
  
  // Demo 3: Currency formatting
  console.log('💵 Currency Formatting:');
  const price = 1299.99;
  const currency = formatter.formatCurrency(price);
  console.log(`Price: ${currency?.formatted}\n`);
  
  // Demo 4: Percentage formatting
  console.log('📊 Percentage Formatting:');
  const discount = 0.15;
  const percent = formatter.formatPercent(discount);
  console.log(`Discount: ${percent?.formatted}\n`);
  
  // Demo 5: Different countries
  console.log('🌎 Different Country Examples:');
  
  const countries = ['DE', 'FR', 'JP', 'IN', 'BR'];
  
  for (const countryCode of countries) {
    formatter.setCountry(countryCode);
    const info = formatter.getCountryInfo();
    const formattedPrice = formatter.formatCurrency(1234.56);
    
    console.log(`${countryCode}: ${formattedPrice?.formatted} (${info?.locale})`);
  }
  
  console.log('\n🎉 Demo completed!');
}

// Run the demo
demo().catch(console.error);
