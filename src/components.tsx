import React, { ReactNode } from 'react';
import { useCountryFormatter, UseCountryFormatterOptions } from './hooks';
import { CountryInfo, FormattedNumber } from './types';

export interface NumberDisplayProps {
  value: number;
  type?: 'number' | 'currency' | 'percent';
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  currency?: string;
  className?: string;
  style?: React.CSSProperties;
  prefix?: ReactNode;
  suffix?: ReactNode;
  onFormatted?: (formatted: FormattedNumber) => void;
}

export interface CountryFormatterProviderProps extends UseCountryFormatterOptions {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Context for sharing country formatter across components
 */
const CountryFormatterContext = React.createContext<ReturnType<typeof useCountryFormatter> | null>(null);

/**
 * Provider component for country formatter context
 */
export function CountryFormatterProvider({ 
  children, 
  fallback,
  ...options 
}: CountryFormatterProviderProps) {
  const formatter = useCountryFormatter(options);

  if (formatter.isLoading && fallback) {
    return <>{fallback}</>;
  }

  return (
    <CountryFormatterContext.Provider value={formatter}>
      {children}
    </CountryFormatterContext.Provider>
  );
}

/**
 * Hook to use country formatter from context
 */
export function useCountryFormatterContext() {
  const context = React.useContext(CountryFormatterContext);
  if (!context) {
    throw new Error('useCountryFormatterContext must be used within CountryFormatterProvider');
  }
  return context;
}

/**
 * Component for displaying formatted numbers
 */
export function NumberDisplay({
  value,
  type = 'number',
  minimumFractionDigits,
  maximumFractionDigits,
  useGrouping,
  currency,
  className,
  style,
  prefix,
  suffix,
  onFormatted
}: NumberDisplayProps) {
  const { formatNumber, formatCurrency, formatPercent } = useCountryFormatterContext();

  const formatted = React.useMemo(() => {
    const options = {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping,
      currency
    };

    let result: FormattedNumber | null = null;

    switch (type) {
      case 'currency':
        result = formatCurrency(value, options);
        break;
      case 'percent':
        result = formatPercent(value, options);
        break;
      default:
        result = formatNumber(value, { ...options, type });
        break;
    }

    if (result && onFormatted) {
      onFormatted(result);
    }

    return result;
  }, [value, type, minimumFractionDigits, maximumFractionDigits, useGrouping, currency, formatNumber, formatCurrency, formatPercent, onFormatted]);

  if (!formatted) {
    return <span className={className} style={style}>{value}</span>;
  }

  return (
    <span className={className} style={style}>
      {prefix}
      {formatted.formatted}
      {suffix}
    </span>
  );
}

/**
 * Component for displaying currency
 */
export function CurrencyDisplay({
  value,
  ...props
}: Omit<NumberDisplayProps, 'type'>) {
  return <NumberDisplay value={value} type="currency" {...props} />;
}

/**
 * Component for displaying percentages
 */
export function PercentDisplay({
  value,
  ...props
}: Omit<NumberDisplayProps, 'type'>) {
  return <NumberDisplay value={value} type="percent" {...props} />;
}

/**
 * Component for displaying country information
 */
export function CountryInfo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { countryInfo, getFormattingInfo } = useCountryFormatterContext();

  const info = React.useMemo(() => {
    return getFormattingInfo();
  }, [getFormattingInfo]);

  if (!countryInfo || !info) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <div>
        <strong>Country:</strong> {countryInfo.countryName} ({countryInfo.countryCode})
      </div>
      <div>
        <strong>Currency:</strong> {countryInfo.currency}
      </div>
      <div>
        <strong>Locale:</strong> {countryInfo.locale}
      </div>
      <div>
        <strong>Decimal Separator:</strong> "{info.decimalSeparator}"
      </div>
      <div>
        <strong>Thousand Separator:</strong> "{info.thousandSeparator}"
      </div>
      <div>
        <strong>Example:</strong> {info.example}
      </div>
    </div>
  );
}
