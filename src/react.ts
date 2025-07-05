// React integration exports
// This file exports React-specific functionality
// Install with: npm install react@^16.8.0

export { useCountryFormatter } from './hooks';
export type { UseCountryFormatterOptions, UseCountryFormatterReturn } from './hooks';

export {
  CountryFormatterProvider,
  useCountryFormatterContext,
  NumberDisplay,
  CurrencyDisplay,
  PercentDisplay,
  CountryInfo as CountryInfoComponent
} from './components';
export type { 
  NumberDisplayProps, 
  CountryFormatterProviderProps 
} from './components';

// Re-export core functionality for convenience
export { CountryLocaleFormatter } from './index';
export type {
  CountryInfo,
  FormattedNumber,
  FormatOptions
} from './types';
