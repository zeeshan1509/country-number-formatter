import { CountryInfo, FormattedNumber, FormatOptions, FormatType } from './types';
import { COUNTRY_LOCALE_MAP } from './constants';

export class NumberFormatterService {
  private static instance: NumberFormatterService;
  private formatters: Map<string, Intl.NumberFormat> = new Map();

  public static getInstance(): NumberFormatterService {
    if (!NumberFormatterService.instance) {
      NumberFormatterService.instance = new NumberFormatterService();
    }
    return NumberFormatterService.instance;
  }

  /**
   * Format a number according to the country's locale
   */
  formatNumber(
    value: number,
    countryInfo: CountryInfo,
    options: FormatOptions = {}
  ): FormattedNumber {
    const {
      type = 'number',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      useGrouping = true,
      currency
    } = options;

    const locale = countryInfo.locale;
    const currencyCode = currency || countryInfo.currency;
    
    // Create formatter options
    const formatOptions: Intl.NumberFormatOptions = {
      minimumFractionDigits,
      maximumFractionDigits,
      useGrouping
    };

    if (type === 'currency') {
      formatOptions.style = 'currency';
      formatOptions.currency = currencyCode;
    } else if (type === 'percent') {
      formatOptions.style = 'percent';
    }

    // Get or create formatter
    const formatterKey = `${locale}-${type}-${JSON.stringify(formatOptions)}`;
    let formatter = this.formatters.get(formatterKey);
    
    if (!formatter) {
      formatter = new Intl.NumberFormat(locale, formatOptions);
      this.formatters.set(formatterKey, formatter);
    }

    // Format the number
    const formatted = formatter.format(value);
    
    // Extract separators
    const separators = this.extractSeparators(value, locale);

    return {
      formatted,
      currency: currencyCode,
      locale,
      decimalSeparator: separators.decimal,
      thousandSeparator: separators.thousand
    };
  }

  /**
   * Format as currency
   */
  formatCurrency(
    value: number,
    countryInfo: CountryInfo,
    options: Omit<FormatOptions, 'type'> = {}
  ): FormattedNumber {
    return this.formatNumber(value, countryInfo, { ...options, type: 'currency' });
  }

  /**
   * Format as percentage
   */
  formatPercent(
    value: number,
    countryInfo: CountryInfo,
    options: Omit<FormatOptions, 'type'> = {}
  ): FormattedNumber {
    return this.formatNumber(value, countryInfo, { ...options, type: 'percent' });
  }

  /**
   * Parse a formatted number string back to number
   */
  parseNumber(formattedValue: string, countryInfo: CountryInfo): number | null {
    try {
      const separators = this.extractSeparators(1234.56, countryInfo.locale);
      
      // Remove currency symbols and other non-numeric characters except separators
      let cleanValue = formattedValue
        .replace(/[^\d\-+.,\s]/g, '') // Remove currency symbols
        .trim();

      // Handle different decimal and thousand separators
      if (separators.thousand && separators.decimal !== separators.thousand) {
        // Remove thousand separators first
        const thousandRegex = new RegExp('\\' + separators.thousand, 'g');
        cleanValue = cleanValue.replace(thousandRegex, '');
        
        // Replace decimal separator with dot if needed
        if (separators.decimal !== '.') {
          const decimalRegex = new RegExp('\\' + separators.decimal, 'g');
          cleanValue = cleanValue.replace(decimalRegex, '.');
        }
      }

      const parsed = parseFloat(cleanValue);
      return isNaN(parsed) ? null : parsed;
    } catch (error) {
      console.error('Error parsing number:', error);
      return null;
    }
  }

  /**
   * Extract decimal and thousand separators for a locale
   */
  private extractSeparators(value: number, locale: string): { decimal: string; thousand: string } {
    const formatter = new Intl.NumberFormat(locale);
    const formatted = formatter.format(1234.5);
    
    // Default separators
    let decimal = '.';
    let thousand = ',';
    
    try {
      // Try to detect separators from formatted number
      const parts = formatted.match(/(\d)(\D)(\d{3})(\D)(\d)/);
      if (parts) {
        thousand = parts[2];
        decimal = parts[4];
      } else {
        // Fallback: format a simple decimal number
        const simpleFormat = formatter.format(1.5);
        const decimalMatch = simpleFormat.match(/1(\D)5/);
        if (decimalMatch) {
          decimal = decimalMatch[1];
        }
      }
    } catch (error) {
      // Use defaults if detection fails
      console.warn('Could not detect separators, using defaults');
    }

    return { decimal, thousand };
  }

  /**
   * Get available locales
   */
  getAvailableLocales(): string[] {
    try {
      return Intl.NumberFormat.supportedLocalesOf(
        Object.values(COUNTRY_LOCALE_MAP)
      );
    } catch (error) {
      return ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'ja-JP', 'ko-KR', 'zh-CN'];
    }
  }

  /**
   * Check if a locale is supported
   */
  isLocaleSupported(locale: string): boolean {
    try {
      const supported = Intl.NumberFormat.supportedLocalesOf([locale]);
      return supported.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get formatting info for a locale
   */
  getFormattingInfo(countryInfo: CountryInfo): {
    locale: string;
    currency: string;
    decimalSeparator: string;
    thousandSeparator: string;
    currencySymbol: string;
    example: string;
  } {
    const separators = this.extractSeparators(1234.56, countryInfo.locale);
    const currencyFormatter = new Intl.NumberFormat(countryInfo.locale, {
      style: 'currency',
      currency: countryInfo.currency
    });
    
    const example = currencyFormatter.format(1234.56);
    
    // Extract currency symbol
    const numberPart = new Intl.NumberFormat(countryInfo.locale).format(1234.56);
    const currencySymbol = example.replace(numberPart, '').trim();

    return {
      locale: countryInfo.locale,
      currency: countryInfo.currency,
      decimalSeparator: separators.decimal,
      thousandSeparator: separators.thousand,
      currencySymbol,
      example
    };
  }

  /**
   * Clear formatter cache
   */
  clearCache(): void {
    this.formatters.clear();
  }
}
