export interface CountryInfo {
  countryCode: string;
  countryName: string;
  currency: string;
  locale: string;
}

export interface NumberFormatConfig {
  locale: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
}

export interface FormattedNumber {
  formatted: string;
  currency: string;
  locale: string;
  decimalSeparator: string;
  thousandSeparator: string;
}

export interface GeoLocationResponse {
  country_code: string;
  country_name: string;
  currency?: {
    code: string;
    name: string;
  };
}

export type FormatType = 'number' | 'currency' | 'percent';

export interface FormatOptions {
  type?: FormatType;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  currency?: string;
}
