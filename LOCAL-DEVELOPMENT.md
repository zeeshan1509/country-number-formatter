# Local Development Guide

This guide shows you how to use the `country-locale-formatter` package locally during development, before publishing to npm.

## Method 1: File Path Installation (Recommended)

This is the easiest and most reliable method for local development.

### Steps:

1. **Build your package first:**
```bash
cd /path/to/country-based-decimal-and-thousand-seperator
npm run build
```

2. **In your target project, install via file path:**
```bash
cd /path/to/your-project
npm install ../country-based-decimal-and-thousand-seperator
```

3. **Use the package normally:**

**Node.js/JavaScript:**
```javascript
const { CountryLocaleFormatter } = require('country-locale-formatter');

async function example() {
  const formatter = new CountryLocaleFormatter();
  await formatter.initialize(false, 'US');
  
  const currency = formatter.formatCurrency(1234.56);
  console.log(currency?.formatted); // "$1,234.56"
}

example();
```

**TypeScript:**
```typescript
import { CountryLocaleFormatter } from 'country-locale-formatter';

async function example() {
  const formatter = new CountryLocaleFormatter();
  await formatter.initialize(false, 'US');
  
  const currency = formatter.formatCurrency(1234.56);
  console.log(currency?.formatted); // "$1,234.56"
}
```

**React (after npm publish):**
```tsx
import React from 'react';
import { 
  CountryFormatterProvider,
  useCountryFormatter,
  CurrencyDisplay 
} from 'country-locale-formatter/react';

function MyComponent() {
  const { formatCurrency } = useCountryFormatter();
  
  return (
    <div>
      <CurrencyDisplay value={1234.56} />
    </div>
  );
}

function App() {
  return (
    <CountryFormatterProvider autoDetect={true}>
      <MyComponent />
    </CountryFormatterProvider>
  );
}
```

### Updating Changes

When you make changes to your package:

1. **Rebuild the package:**
```bash
cd /path/to/country-based-decimal-and-thousand-seperator
npm run build
```

2. **Reinstall in your project:**
```bash
cd /path/to/your-project
npm install ../country-based-decimal-and-thousand-seperator --force
```

## Method 2: npm link (Alternative)

This method creates symlinks but can be more complex:

1. **Create global link:**
```bash
cd /path/to/country-based-decimal-and-thousand-seperator
npm link
```

2. **Link in your project:**
```bash
cd /path/to/your-project
npm link country-locale-formatter
```

3. **Unlink when done:**
```bash
cd /path/to/your-project
npm unlink country-locale-formatter

cd /path/to/country-based-decimal-and-thousand-seperator
npm unlink
```

## Method 3: Pack and Install

This method creates a tarball like npm publish would:

1. **Create package tarball:**
```bash
cd /path/to/country-based-decimal-and-thousand-seperator
npm pack
```

2. **Install the tarball:**
```bash
cd /path/to/your-project
npm install ../country-based-decimal-and-thousand-seperator/country-locale-formatter-1.0.0.tgz
```

## Testing Your Local Installation

Create this test file in your project:

**test-package.js:**
```javascript
const { CountryLocaleFormatter } = require('country-locale-formatter');

async function test() {
  console.log('🧪 Testing country-locale-formatter...');
  
  const formatter = new CountryLocaleFormatter();
  await formatter.initialize(false, 'US');
  
  console.log('📍 Country:', formatter.getCountryInfo());
  console.log('🔢 Number:', formatter.formatNumber(1234.56)?.formatted);
  console.log('💰 Currency:', formatter.formatCurrency(1234.56)?.formatted);
  console.log('📊 Percent:', formatter.formatPercent(0.1234)?.formatted);
  
  console.log('✅ Test completed!');
}

test().catch(console.error);
```

Run with:
```bash
node test-package.js
```

## Import Paths Reference

### Core Package (Standalone)
```javascript
// CommonJS
const { CountryLocaleFormatter } = require('country-locale-formatter');

// ES Modules
import { CountryLocaleFormatter } from 'country-locale-formatter';
```

### React Integration (After Publishing)
```javascript
// All React features
import { 
  CountryFormatterProvider,
  useCountryFormatter,
  NumberDisplay,
  CurrencyDisplay 
} from 'country-locale-formatter/react';

// Specific modules
import { useCountryFormatter } from 'country-locale-formatter/react/hooks';
import { NumberDisplay } from 'country-locale-formatter/react/components';
```

### Types
```typescript
import type { 
  CountryInfo, 
  FormattedNumber, 
  FormatOptions 
} from 'country-locale-formatter';
```

## Troubleshooting

### "Module not found" errors
- Make sure you've run `npm run build` in the package directory
- Try reinstalling with `npm install ../path/to/package --force`
- Check that the `dist/` folder exists and contains the built files

### TypeScript errors
- Ensure you have the latest built `.d.ts` files
- Try restarting your TypeScript language server

### React import errors
- For local development, you might need to import React components differently
- After publishing, use the documented import paths from the README

### Version conflicts
- Uninstall the package first: `npm uninstall country-locale-formatter`
- Then reinstall: `npm install ../path/to/package`

## Production Usage

Once you publish the package to npm:

```bash
npm publish
```

Users can install it normally:
```bash
npm install country-locale-formatter
```

And use the documented import paths from the README.md file.

## Development Workflow

1. **Make changes** to your package source code
2. **Run tests**: `npm test`
3. **Build package**: `npm run build`
4. **Update in test project**: `npm install ../package-path --force`
5. **Test in your project**
6. **Repeat** until satisfied
7. **Publish**: `npm publish`
