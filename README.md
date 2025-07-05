# Country Number Formatter

A TypeScript npm package that automatically detects a user's country and formats numbers, currencies, and percentages according to that country's locale conventions. Perfect for React applications that need internationalization (i18n) support.

## Features

- 🌍 **Automatic Country Detection**: Uses IP geolocation to detect user's country
- 🔢 **Smart Number Formatting**: Formats numbers with correct decimal and thousand separators
- 💰 **Currency Formatting**: Displays currency with proper symbols and formatting
- 📊 **Percentage Formatting**: Handles percentage display according to locale
- ⚛️ **React Integration**: Includes React hooks and components for easy integration
- 🎯 **TypeScript Support**: Fully typed with comprehensive TypeScript definitions
- 🚀 **Lightweight**: Minimal dependencies with efficient caching
- 🔄 **Fallback Support**: Graceful fallbacks when detection fails

## Installation

```bash
npm install country-number-formatter
```

For React usage, ensure you have React 16.8+ installed:

```bash
npm install react@^16.8.0
```

## Quick Start

### Standalone Usage

```typescript
import { CountryLocaleFormatter } from 'country-number-formatter';

const formatter = new CountryLocaleFormatter();

// Initialize with auto-detection
await formatter.initialize();

// Format numbers
const number = formatter.formatNumber(1234.56);
console.log(number?.formatted); // "1,234.56" (US) or "1.234,56" (DE)

// Format currency
const currency = formatter.formatCurrency(1234.56);
console.log(currency?.formatted); // "$1,234.56" (US) or "1.234,56 €" (DE)

// Format percentage
const percent = formatter.formatPercent(0.1234);
console.log(percent?.formatted); // "12.34%" (US) or "12,34 %" (DE)

// Format numbers in strings (simple method)
const text = "Price: 1234.56 and quantity: 100";

// Use auto-detected country
const autoFormatted = formatter.formatNumbersInString(text, undefined, 2);

// Use specific country
const formatted = formatter.formatNumbersInString(text, 'DE', 2);
console.log(formatted); // "Price: 1.234,56 and quantity: 100,00"

// Format numbers in strings (detailed method)
const detailed = formatter.formatStringNumbers(text, 'DE', 2);
console.log(detailed.formattedString); // "Price: 1.234,56 and quantity: 100,00"
console.log(detailed.numbersFound); // 2
console.log(detailed.replacements); // Array of replacement details
```

### String Formatting

The package includes powerful string formatting methods that can find and format all numbers within a text string:

#### Simple String Formatting

Use `formatNumbersInString()` when you just need the formatted string:

```typescript
// Auto-detection (uses detected country)
const autoResult = formatter.formatNumbersInString(
  "Sales: 1234567.89 and costs: 999.5"
  // No country code = uses auto-detected country
);

// Specific country formatting
const result = formatter.formatNumbersInString(
  "Sales: 1234567.89 and costs: 999.5", 
  'FR'  // French formatting
);
console.log(result); 
// "Sales: 1 234 567,89 and costs: 999,50"

// With decimal place control
const result2 = formatter.formatNumbersInString(
  "Values: 123.456 and 789.123", 
  'DE',  // German formatting
  2      // Force 2 decimal places
);
console.log(result2); 
// "Values: 123,46 and 789,12"
```

#### Detailed String Formatting

Use `formatStringNumbers()` when you need metadata about the formatting:

```typescript
const result = formatter.formatStringNumbers(
  "Price: 1234.56 and tax: 123.45", 
  'IN',  // Indian formatting
  2      // 2 decimal places
);

console.log(result.formattedString);  // "Price: 1,234.56 and tax: 123.45"
console.log(result.numbersFound);     // 2
console.log(result.countryUsed);      // "IN"
console.log(result.replacements);     // Array with details about each replacement
```

## Information & Utility Methods

### Getting Formatting Information

```typescript
// Get current formatting rules
const formatInfo = formatter.getFormattingInfo();
console.log(formatInfo?.decimalSeparator);   // "." or ","
console.log(formatInfo?.thousandSeparator);  // "," or "." or "'" or " "
console.log(formatInfo?.currencySymbol);     // "$", "€", "£", etc.
console.log(formatInfo?.currencyPosition);   // "before" or "after"
console.log(formatInfo?.example);            // "1,234.56" (example format)

// Get all supported country codes  
const countries = formatter.getSupportedCountries();
console.log(countries.length);    // 250+
console.log(countries.slice(0,5)); // ["AD", "AE", "AF", "AG", "AI"]
```

### React Information Methods

```tsx
const { 
  getFormattingInfo, 
  getSupportedCountries,
  countryInfo 
} = useCountryFormatter();

// Get current formatting rules
const formatInfo = getFormattingInfo();

// Get all supported countries
const allCountries = getSupportedCountries();

// Display current country info
console.log(countryInfo?.countryCode);  // "US"
console.log(countryInfo?.countryName);  // "United States"
console.log(countryInfo?.currency);     // "USD"
console.log(countryInfo?.locale);       // "en-US"
```

### Advanced Configuration Options

```typescript
// Custom formatting with all options
const formatted = formatter.formatNumber(1234.56789, {
  minimumFractionDigits: 2,    // At least 2 decimal places
  maximumFractionDigits: 4,    // At most 4 decimal places
  useGrouping: true            // Use thousand separators
});

// Currency with custom settings
const currency = formatter.formatCurrency(1234.56, {
  currency: 'EUR',             // Override default currency
  minimumFractionDigits: 0,    // No decimal places required
  maximumFractionDigits: 2     // Max 2 decimal places
});

// Country detection and setting options
await formatter.initialize(true, 'US');     // Auto-detect with US fallback
await formatter.initialize(false, 'DE');    // Skip detection, use Germany
formatter.setCountry('JP');                 // Change to Japan manually

// Get current country
const currentCountry = formatter.getCountryInfo();
```

### React Hook Usage

```tsx
import { useCountryFormatter } from 'country-number-formatter/react';

function MyComponent() {
  const { 
    formatNumber, 
    formatCurrency, 
    formatNumbersInString,
    formatStringNumbers,
    countryInfo, 
    isLoading 
  } = useCountryFormatter();

  if (isLoading) return <div>Detecting location...</div>;

  const price = 1234.56;
  const formattedPrice = formatCurrency(price);
  
  // Simple string formatting
  const text = "Total: 1234.56 with tax: 123.45";
  
  // Auto-detection (omit country code to use detected country)
  const autoFormattedText = formatNumbersInString(text, undefined, 2);
  
  // Specific country formatting
  const deFormattedText = formatNumbersInString(text, 'DE', 2);

  return (
    <div>
      <p>Country: {countryInfo?.countryName}</p>
      <p>Price: {formattedPrice?.formatted}</p>
      <p>Auto Text: {autoFormattedText}</p>
      <p>DE Text: {deFormattedText}</p>
    </div>
  );
}
```

### React Components

```tsx
import { 
  CountryFormatterProvider, 
  CurrencyDisplay, 
  NumberDisplay,
  PercentDisplay 
} from 'country-number-formatter/react';

function App() {
  return (
    <CountryFormatterProvider autoDetect={true}>
      <div>
        <NumberDisplay value={1234.56} />
        <CurrencyDisplay value={1234.56} />
        <PercentDisplay value={0.1234} />
      </div>
    </CountryFormatterProvider>
  );
}
```

## API Reference

### CountryLocaleFormatter Class

Main class for standalone usage.

#### Methods

- `initialize(autoDetect?: boolean, defaultCountry?: string): Promise<CountryInfo>`
- `setCountry(countryCode: string): void`
- `getCountryInfo(): CountryInfo | null`
- `formatNumber(value: number, options?: FormatOptions): FormattedNumber | null`
- `formatCurrency(value: number, options?: FormatOptions): FormattedNumber | null`
- `formatPercent(value: number, options?: FormatOptions): FormattedNumber | null`
- `parseNumber(formattedValue: string): number | null`
- `getFormattingInfo(): FormattingInfo | null`
- `formatNumbersInString(inputString: string, countryCode?: string, decimalPlaces?: number): string`
- `formatStringNumbers(inputString: string, countryCode?: string, decimalPlaces?: number): StringFormatResult`
- `getSupportedCountries(): string[]`
- `formatPercent(value: number, options?: FormatOptions): FormattedNumber | null`
- `parseNumber(formattedValue: string): number | null`
- `getFormattingInfo(): FormattingInfo | null`

### React Hook: useCountryFormatter

```typescript
const {
  countryInfo,
  isLoading,
  error,
  formatNumber,
  formatNumber,
  formatCurrency,
  formatPercent,
  parseNumber,
  setCountry,
  refreshCountry,
  getFormattingInfo,
  formatNumbersInString,
  formatStringNumbers
} = useCountryFormatter(options);
```

#### Options

```typescript
interface UseCountryFormatterOptions {
  autoDetect?: boolean;        // Auto-detect country (default: true)
  defaultCountry?: string;     // Fallback country code (default: 'US')
  onCountryDetected?: (countryInfo: CountryInfo) => void;
  onError?: (error: Error) => void;
}
```

### React Components

#### CountryFormatterProvider

Provides country formatting context to child components.

```tsx
<CountryFormatterProvider 
  autoDetect={true}
  defaultCountry="US"
  fallback={<div>Loading...</div>}
>
  {children}
</CountryFormatterProvider>
```

#### NumberDisplay

Display formatted numbers with full customization:

```tsx
<NumberDisplay 
  value={1234.56}
  type="number"                    // "number" | "currency" | "percent"
  minimumFractionDigits={2}        // Minimum decimal places
  maximumFractionDigits={4}        // Maximum decimal places
  useGrouping={true}               // Use thousand separators
  currency="USD"                   // Currency override
  className="my-number"            // CSS class
  style={{ color: 'blue' }}       // Inline styles
  prefix="Total: "                 // Text before number
  suffix=" USD"                    // Text after number
  onFormatted={(result) => {       // Callback with formatting result
    console.log(result.formatted);
  }}
/>
```

#### CurrencyDisplay

Display formatted currency with automatic symbols:

```tsx
<CurrencyDisplay 
  value={1234.56}
  currency="EUR"                   // Override detected currency
  minimumFractionDigits={0}        // No decimals required
  maximumFractionDigits={2}        // Max 2 decimals
  className="price"
  prefix="Price: "
  onFormatted={(result) => {
    console.log('Currency:', result.currency);
    console.log('Symbol:', result.symbol);
  }}
/>
```

#### PercentDisplay

Display formatted percentages:

```tsx
<PercentDisplay 
  value={0.1234}                   // 0.1234 = 12.34%
  minimumFractionDigits={1}        // At least 1 decimal
  maximumFractionDigits={2}        // At most 2 decimals
  className="percentage"
  suffix=" discount"
/>
```

#### CountryInfoComponent

Display current country information:

```tsx
<CountryInfoComponent 
  showFlag={true}                  // Show country flag emoji
  showCurrency={true}              // Show currency code
  showLocale={true}                // Show locale string
  className="country-info"
  style={{ padding: '10px' }}
  format={(info) =>                // Custom formatting function
    `${info.countryName} (${info.countryCode})`
  }
/>
```

## Types

### CountryInfo

```typescript
interface CountryInfo {
  countryCode: string;    // ISO country code (e.g., "US", "DE")
  countryName: string;    // Full country name
  currency: string;       // Currency code (e.g., "USD", "EUR")
  locale: string;         // Locale string (e.g., "en-US", "de-DE")
}
```

### FormattedNumber

```typescript
interface FormattedNumber {
  formatted: string;         // The formatted number string
  currency: string;          // Currency code used
  locale: string;           // Locale used for formatting
  decimalSeparator: string; // Decimal separator character
  thousandSeparator: string; // Thousand separator character
  symbol?: string;          // Currency or percent symbol
}
```

### FormatOptions

```typescript
interface FormatOptions {
  type?: 'number' | 'currency' | 'percent';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  currency?: string;  // Override default currency
}
```

### FormattingInfo

```typescript
interface FormattingInfo {
  decimalSeparator: string;      // "." or ","
  thousandSeparator: string;     // "," or "." or "'" or " "
  currencySymbol: string;        // "$", "€", "£", "¥", etc.
  currencyPosition: "before" | "after";  // Symbol position
  example: string;               // Example formatted number "1,234.56"
}
```

### StringFormatResult

```typescript
interface StringFormatResult {
  formattedString: string;       // String with formatted numbers
  originalString: string;        // Original input string
  numbersFound: number;          // Count of numbers found
  replacements: Array<{          // Details of each replacement
    original: string;            // Original number string
    formatted: string;           // Formatted number string
    position: number;            // Position in original string
  }>;
  countryUsed: string;          // Country code used for formatting
}
```

### UseCountryFormatterReturn

Complete React hook return interface:

```typescript
interface UseCountryFormatterReturn {
  // State
  countryInfo: CountryInfo | null;
  isLoading: boolean;
  error: Error | null;
  
  // Formatting Methods
  formatNumber: (value: number, options?: FormatOptions) => FormattedNumber | null;
  formatCurrency: (value: number, options?: Omit<FormatOptions, 'type'>) => FormattedNumber | null;
  formatPercent: (value: number, options?: Omit<FormatOptions, 'type'>) => FormattedNumber | null;
  parseNumber: (formattedValue: string) => number | null;
  
  // String Processing
  formatStringNumbers: (inputString: string, countryCode?: string, decimalPlaces?: number) => StringFormatResult;
  formatNumbersInString: (inputString: string, countryCode?: string, decimalPlaces?: number) => string;
  
  // Information & Control
  setCountry: (countryCode: string) => void;
  refreshCountry: () => Promise<void>;
  getFormattingInfo: () => FormattingInfo | null;
  getSupportedCountries: () => string[];
}
```

## Complete Function Reference

### Core Library Functions

```typescript
// Initialization
const formatter = new CountryLocaleFormatter();
await formatter.initialize(autoDetect?, defaultCountry?);

// Number Formatting
formatter.formatNumber(1234.56, options?);         // FormattedNumber | null
formatter.formatCurrency(1234.56, options?);       // FormattedNumber | null
formatter.formatPercent(0.1234, options?);         // FormattedNumber | null

// String Processing
formatter.formatStringNumbers(text, country?, decimals?);    // StringFormatResult
formatter.formatNumbersInString(text, country?, decimals?);  // string

// Information & Control
formatter.getCountryInfo();                         // CountryInfo | null
formatter.getFormattingInfo();                      // FormattingInfo | null
formatter.getSupportedCountries();                  // string[]
formatter.setCountry(countryCode);                  // void
formatter.parseNumber(formattedText);               // number | null
```

### React Hook Functions

```typescript
const {
  // State
  countryInfo, isLoading, error,
  
  // All core functions available in React
  formatNumber, formatCurrency, formatPercent,
  formatStringNumbers, formatNumbersInString,
  getFormattingInfo, getSupportedCountries,
  setCountry, refreshCountry, parseNumber
} = useCountryFormatter(options?);
```

## Practical Examples

### Real-World Usage Scenarios

```typescript
// E-commerce product pricing
const productPrice = 1299.99;
const formattedPrice = formatter.formatCurrency(productPrice);
// US: "$1,299.99" | DE: "1.299,99 €" | JP: "¥1,299.99"

// Financial reports with multiple numbers
const report = "Q4 Revenue: 2500000.50, Expenses: 1800000.25, Profit: 700000.25";
const formattedReport = formatter.formatNumbersInString(report, 'DE', 2);
// "Q4 Revenue: 2.500.000,50, Expenses: 1.800.000,25, Profit: 700.000,25"

// Data visualization tooltips
const tooltipText = `Sales: ${formatter.formatCurrency(125000)} (${formatter.formatPercent(0.15)} increase)`;
// "Sales: $125,000.00 (15.00% increase)"

// User input parsing
const userInput = "€1.234,56";
const parsedValue = formatter.parseNumber(userInput); // 1234.56

// Multi-country data processing
const countries = ['US', 'DE', 'FR', 'JP'];
const amount = 1234.56;
countries.forEach(country => {
  const formatted = formatter.formatCurrency(amount, { currency: getCurrency(country) });
  console.log(`${country}: ${formatted.formatted}`);
});
```

### React Component Examples

```tsx
// E-commerce product card
function ProductCard({ product }) {
  const { formatCurrency, formatPercent } = useCountryFormatter();
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <div className="price">
        <CurrencyDisplay value={product.price} className="current-price" />
        {product.discount > 0 && (
          <span className="discount">
            <PercentDisplay value={product.discount} suffix=" off" />
          </span>
        )}
      </div>
    </div>
  );
}

// Financial dashboard
function Dashboard({ metrics }) {
  const { formatNumbersInString, countryInfo } = useCountryFormatter();
  
  const summary = `Revenue: ${metrics.revenue}, Costs: ${metrics.costs}, Profit: ${metrics.profit}`;
  const formattedSummary = formatNumbersInString(summary, countryInfo?.countryCode, 2);
  
  return (
    <div className="dashboard">
      <h2>Financial Summary</h2>
      <p>{formattedSummary}</p>
    </div>
  );
}

// Multi-language support
function LocalizedApp() {
  const { countryInfo, isLoading, setCountry } = useCountryFormatter();
  
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' }
  ];
  
  if (isLoading) return <div>Detecting your location...</div>;
  
  return (
    <div>
      <select 
        value={countryInfo?.countryCode} 
        onChange={(e) => setCountry(e.target.value)}
      >
        {countries.map(country => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      
      <NumberDisplay value={1234.56} />
      <CurrencyDisplay value={999.99} />
    </div>
  );
}
```

## Country Detection

The package uses multiple IP geolocation services for reliable country detection:

1. **ipapi.co** - Primary service
2. **ipinfo.io** - Fallback service
3. **ip-api.com** - Secondary fallback
4. **Browser locale** - Final fallback

If all services fail, it falls back to browser locale or the specified default country.

## Supported Countries

The package supports 150+ countries with their respective:
- Locale strings
- Currency codes
- Number formatting conventions
- Decimal and thousand separators

See the full list in `COUNTRY_LOCALE_MAP` and `COUNTRY_CURRENCY_MAP` constants.

## Examples

### Different Locale Formatting

```typescript
// US formatting
await formatter.initialize(false, 'US');
formatter.formatCurrency(1234.56); // "$1,234.56"

// German formatting  
await formatter.initialize(false, 'DE');
formatter.formatCurrency(1234.56); // "1.234,56 €"

// Japanese formatting
await formatter.initialize(false, 'JP');
formatter.formatCurrency(1234); // "¥1,234"

// Indian formatting
await formatter.initialize(false, 'IN');
formatter.formatCurrency(1234.56); // "₹1,234.56"
```

### Custom Formatting Options

```typescript
const options = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
  useGrouping: false
};

formatter.formatNumber(1234.567, options); // "1234.568"
```

### Parsing Formatted Numbers

```typescript
// Parse different formats
formatter.parseNumber("$1,234.56");  // 1234.56
formatter.parseNumber("1.234,56 €"); // 1234.56
formatter.parseNumber("12.34%");     // 12.34
```

## Error Handling

The package includes comprehensive error handling:

```typescript
const { error, countryInfo, formatNumber } = useCountryFormatter({
  onError: (error) => {
    console.error('Country detection failed:', error);
    // Handle error (e.g., show notification)
  },
  onCountryDetected: (country) => {
    console.log('Detected country:', country);
  }
});

// Check for errors
if (error) {
  return <div>Error: {error.message}</div>;
}
```

## Performance

- **Caching**: Formatters and country info are cached for performance
- **Lazy Loading**: Services are initialized only when needed
- **Minimal Bundle**: Tree-shakeable exports keep bundle size small
- **Debouncing**: Multiple rapid calls are optimized

## Browser Support

- Modern browsers with Intl.NumberFormat support
- Node.js 14+
- React 16.8+ (for React features)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Changelog

### 1.0.0
- Initial release
- Country detection via IP geolocation
- Number, currency, and percentage formatting
- React hooks and components
- TypeScript support
- Comprehensive test suite

---

## 📋 Quick Reference

### Installation
```bash
npm install country-number-formatter
```

### Basic Usage
```typescript
// Node.js
const formatter = new CountryLocaleFormatter();
await formatter.initialize();
const result = formatter.formatCurrency(1234.56);

// React
const { formatCurrency } = useCountryFormatter();
const result = formatCurrency(1234.56);
```

### All Functions
- **Formatting**: `formatNumber()`, `formatCurrency()`, `formatPercent()`
- **String Processing**: `formatStringNumbers()`, `formatNumbersInString()`
- **Information**: `getCountryInfo()`, `getFormattingInfo()`, `getSupportedCountries()`
- **Control**: `setCountry()`, `parseNumber()`, `initialize()`

### React Components
- `<NumberDisplay />`, `<CurrencyDisplay />`, `<PercentDisplay />`
- `<CountryInfoComponent />`, `<CountryFormatterProvider />`

### Key Features
- 🌍 **250+ Countries** - Complete international support
- 🔍 **Auto Detection** - IP-based country detection
- ⚛️ **React Ready** - Hooks and components included
- 📝 **String Processing** - Format numbers in text
- 🎯 **TypeScript** - Full type safety
- 🚀 **Production Ready** - Tested and optimized

**Need help?** Check the examples above or the demo files in the repository!
