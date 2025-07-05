# Usage Guide

## Installation

```bash
npm install country-locale-formatter
```

For React usage:
```bash
npm install country-locale-formatter react@^16.8.0
```

## Import Guide

### Core Library (Standalone)
```typescript
// Main class and utilities
import { CountryLocaleFormatter } from 'country-locale-formatter';

// Types
import type { CountryInfo, FormattedNumber } from 'country-locale-formatter';
```

### React Integration
```typescript
// All React functionality in one import
import { 
  CountryFormatterProvider, 
  useCountryFormatter,
  CurrencyDisplay, 
  NumberDisplay, 
  PercentDisplay,
  CountryInfoComponent 
} from 'country-locale-formatter/react';

// Or import specific modules
import { useCountryFormatter } from 'country-locale-formatter/react/hooks';
import { NumberDisplay } from 'country-locale-formatter/react/components';
```

## Basic Usage

### Standalone JavaScript/TypeScript

```javascript
const { CountryLocaleFormatter } = require('country-locale-formatter');
// or
import { CountryLocaleFormatter } from 'country-locale-formatter';

async function example() {
  const formatter = new CountryLocaleFormatter();
  
  // Auto-detect country (with fallback)
  await formatter.initialize(true, 'US');
  
  // Format numbers
  const number = formatter.formatNumber(1234.56);
  console.log(number.formatted); // "1,234.56" (US) or "1.234,56" (DE)
  
  // Format currency
  const price = formatter.formatCurrency(99.99);
  console.log(price.formatted); // "$99.99" (US) or "99,99 €" (DE)
  
  // Format percentage
  const percent = formatter.formatPercent(0.15);
  console.log(percent.formatted); // "15%" (US) or "15 %" (DE)
}
```

### Manual Country Selection

```javascript
const formatter = new CountryLocaleFormatter();

// Set specific country
formatter.setCountry('DE'); // Germany
const price = formatter.formatCurrency(1234.56);
console.log(price.formatted); // "1.234,56 €"

formatter.setCountry('JP'); // Japan
const price2 = formatter.formatCurrency(1234.56);
console.log(price2.formatted); // "￥1,234.56"
```

### React Hook Usage

```jsx
import { useCountryFormatter } from 'country-locale-formatter/react';

function PriceComponent() {
  const { 
    formatCurrency, 
    countryInfo, 
    isLoading, 
    error 
  } = useCountryFormatter({
    autoDetect: true,
    defaultCountry: 'US'
  });

  if (isLoading) return <div>Detecting location...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const price = formatCurrency(99.99);
  
  return (
    <div>
      <p>Country: {countryInfo?.countryName}</p>
      <p>Price: {price?.formatted}</p>
    </div>
  );
}
```

### React Components

```jsx
import { 
  CountryFormatterProvider, 
  CurrencyDisplay, 
  NumberDisplay,
  PercentDisplay 
} from 'country-locale-formatter/react';

function App() {
  return (
    <CountryFormatterProvider autoDetect={true}>
      <div>
        <NumberDisplay value={1234.56} />
        <CurrencyDisplay value={99.99} />
        <PercentDisplay value={0.15} />
      </div>
    </CountryFormatterProvider>
  );
}
```

## API Reference

### CountryLocaleFormatter

- `initialize(autoDetect?: boolean, defaultCountry?: string)` - Initialize with country detection
- `setCountry(countryCode: string)` - Set country manually
- `getCountryInfo()` - Get current country information
- `formatNumber(value: number, options?: FormatOptions)` - Format numbers
- `formatCurrency(value: number, options?: FormatOptions)` - Format currency
- `formatPercent(value: number, options?: FormatOptions)` - Format percentages
- `parseNumber(formattedValue: string)` - Parse formatted number back to number
- `getFormattingInfo()` - Get locale formatting details

### Supported Countries

The package supports 150+ countries including:
- US, CA, MX (North America)
- DE, FR, ES, IT, GB, NL, etc. (Europe) 
- JP, KR, CN, IN, TH, etc. (Asia)
- BR, AR, CL, etc. (South America)
- And many more...

### Number Formatting Examples

| Country | Number | Currency | Locale |
|---------|--------|----------|--------|
| US | 1,234.56 | $1,234.56 | en-US |
| Germany | 1.234,56 | 1.234,56 € | de-DE |
| France | 1 234,56 | 1 234,56 € | fr-FR |
| Japan | 1,234.56 | ￥1,234.56 | ja-JP |
| India | 1,234.56 | ₹1,234.56 | en-IN |
| Brazil | 1.234,56 | R$ 1.234,56 | pt-BR |

## Features

✅ **Automatic Country Detection** - Uses IP geolocation with fallbacks  
✅ **150+ Countries Supported** - Comprehensive country and locale mapping  
✅ **Multiple Number Formats** - Numbers, currency, percentages  
✅ **React Integration** - Hooks and components included  
✅ **TypeScript Support** - Fully typed with IntelliSense  
✅ **Lightweight** - Minimal dependencies  
✅ **Error Handling** - Graceful fallbacks and error recovery  
✅ **Caching** - Performance optimized with intelligent caching  
✅ **Number Parsing** - Parse formatted strings back to numbers  

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- Node.js 14+
- React 16.8+ (for React features)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality  
4. Run `npm test` to ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
