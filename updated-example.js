const { CountryLocaleFormatter } = require('./dist/index.js');

async function example() {
  const formatter = new CountryLocaleFormatter();

  console.log('🌍 Country Number Formatter - Updated Example\n');

  // Method 1: Initialize without country code (uses browser locale)
  console.log('--- Method 1: Browser Locale Detection ---');
  await formatter.initialize();
  let currentCountry = formatter.getCountryInfo();
  console.log(`Country: ${currentCountry.countryCode} (${currentCountry.countryName})`);
  console.log(`Currency: ${currentCountry.currency}`);
  console.log(`Locale: ${currentCountry.locale}\n`);

  // Method 2: Initialize with specific country code
  console.log('--- Method 2: Specific Country ---');
  await formatter.initialize('DE'); // Germany
  currentCountry = formatter.getCountryInfo();
  console.log(`Country: ${currentCountry.countryCode} (${currentCountry.countryName})`);
  console.log(`Currency: ${currentCountry.currency}`);
  console.log(`Locale: ${currentCountry.locale}\n`);

  // Method 3: Change country after initialization
  console.log('--- Method 3: Change Country ---');
  formatter.setCountry('FR'); // France
  currentCountry = formatter.getCountryInfo();
  console.log(`Country: ${currentCountry.countryCode} (${currentCountry.countryName})`);
  console.log(`Currency: ${currentCountry.currency}`);
  console.log(`Locale: ${currentCountry.locale}\n`);

  // Test number formatting with different countries
  const testNumber = 1234567.89;
  const testText = 'Sales revenue: 1234567.89 and expenses: 987654.32';

  console.log('--- Number Formatting Examples ---');
  
  const countries = ['US', 'DE', 'FR', 'IN', 'JP'];
  for (const country of countries) {
    await formatter.initialize(country);
    const formatted = formatter.formatCurrency(testNumber);
    const formattedText = formatter.formatNumbersInString(testText, country, 2);
    
    console.log(`${country}: ${formatted?.formatted}`);
    console.log(`${country} Text: ${formattedText}\n`);
  }
}

example().catch(console.error);
