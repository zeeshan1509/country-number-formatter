// Simple test to verify React imports work
const React = require('react');

// Import the React components and hooks
const { 
  CountryFormatterProvider, 
  NumberDisplay, 
  CurrencyDisplay, 
  PercentDisplay, 
  CountryInfo,
  useCountryFormatter 
} = require('./dist/react/components');

const { useCountryFormatter: useCountryFormatterHook } = require('./dist/react/hooks');

console.log('✅ React imports successful!');
console.log('Available components:', {
  CountryFormatterProvider: typeof CountryFormatterProvider,
  NumberDisplay: typeof NumberDisplay,
  CurrencyDisplay: typeof CurrencyDisplay,
  PercentDisplay: typeof PercentDisplay,
  CountryInfo: typeof CountryInfo,
  useCountryFormatter: typeof useCountryFormatterHook
});
