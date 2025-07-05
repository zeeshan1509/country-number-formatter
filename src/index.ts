// Core services
export { CountryDetectionService } from './countryDetection';
export { NumberFormatterService } from './numberFormatter';

// Types
export type {
  CountryInfo,
  NumberFormatConfig,
  FormattedNumber,
  GeoLocationResponse,
  FormatType,
  FormatOptions
} from './types';

// Constants
export {
  COUNTRY_LOCALE_MAP,
  COUNTRY_CURRENCY_MAP,
  DEFAULT_LOCALE,
  DEFAULT_CURRENCY
} from './constants';

// Imports for the main class
import { CountryDetectionService } from './countryDetection';
import { NumberFormatterService } from './numberFormatter';
import { CountryInfo, FormattedNumber, FormatOptions } from './types';

// Main class for standalone usage
export class CountryLocaleFormatter {
  private countryDetectionService: CountryDetectionService;
  private numberFormatterService: NumberFormatterService;
  private currentCountryInfo: CountryInfo | null = null;

  constructor() {
    this.countryDetectionService = CountryDetectionService.getInstance();
    this.numberFormatterService = NumberFormatterService.getInstance();
  }

  /**
   * Initialize the formatter by detecting country
   */
  async initialize(autoDetect: boolean = true, defaultCountry: string = 'US'): Promise<CountryInfo> {
    if (autoDetect) {
      this.currentCountryInfo = await this.countryDetectionService.detectCountryFromIP();
    } else {
      this.currentCountryInfo = this.countryDetectionService.getCountryInfo(defaultCountry);
    }
    return this.currentCountryInfo;
  }

  /**
   * Set country manually
   */
  setCountry(countryCode: string): void {
    this.currentCountryInfo = this.countryDetectionService.getCountryInfo(countryCode);
  }

  /**
   * Get current country info
   */
  getCountryInfo(): CountryInfo | null {
    return this.currentCountryInfo;
  }

  /**
   * Format a number
   */
  formatNumber(value: number, options?: FormatOptions): FormattedNumber | null {
    if (!this.currentCountryInfo) {
      throw new Error('Formatter not initialized. Call initialize() first.');
    }
    return this.numberFormatterService.formatNumber(value, this.currentCountryInfo, options);
  }

  /**
   * Format as currency
   */
  formatCurrency(value: number, options?: Omit<FormatOptions, 'type'>): FormattedNumber | null {
    if (!this.currentCountryInfo) {
      throw new Error('Formatter not initialized. Call initialize() first.');
    }
    return this.numberFormatterService.formatCurrency(value, this.currentCountryInfo, options);
  }

  /**
   * Format as percentage
   */
  formatPercent(value: number, options?: Omit<FormatOptions, 'type'>): FormattedNumber | null {
    if (!this.currentCountryInfo) {
      throw new Error('Formatter not initialized. Call initialize() first.');
    }
    return this.numberFormatterService.formatPercent(value, this.currentCountryInfo, options);
  }

  /**
   * Parse formatted number back to number
   */
  parseNumber(formattedValue: string): number | null {
    if (!this.currentCountryInfo) {
      throw new Error('Formatter not initialized. Call initialize() first.');
    }
    return this.numberFormatterService.parseNumber(formattedValue, this.currentCountryInfo);
  }

  /**
   * Get formatting information
   */
  getFormattingInfo(): ReturnType<NumberFormatterService['getFormattingInfo']> | null {
    if (!this.currentCountryInfo) {
      return null;
    }
    return this.numberFormatterService.getFormattingInfo(this.currentCountryInfo);
  }

  /**
   * Format all numbers in a string according to country-specific rules
   * @param inputString The string containing numbers to format
   * @param countryCode Optional country code to use for formatting (if not provided, uses current country)
   * @param decimalPlaces Optional number of decimal places to apply to all numbers
   * @returns Object containing the formatted string and details about replacements
   */
  formatStringNumbers(
    inputString: string, 
    countryCode?: string, 
    decimalPlaces?: number
  ): {
    formattedString: string;
    originalString: string;
    numbersFound: number;
    replacements: Array<{
      original: string;
      formatted: string;
      position: number;
    }>;
    countryUsed: string;
  } {
    if (!this.currentCountryInfo && !countryCode) {
      throw new Error('Formatter not initialized and no country code provided. Call initialize() first or provide a country code.');
    }

    // Determine which country to use for formatting
    let targetCountryInfo: CountryInfo;
    if (countryCode) {
      targetCountryInfo = this.countryDetectionService.getCountryInfo(countryCode);
    } else {
      targetCountryInfo = this.currentCountryInfo!;
    }

    // Regular expression to find complete numbers (integers and decimals)
    // Matches whole numbers like: 12345, 123.45, 46893.344, etc.
    // More precise pattern to avoid splitting numbers
    const numberRegex = /\b\d+\.?\d*\b/g;
    
    const replacements: Array<{
      original: string;
      formatted: string;
      position: number;
    }> = [];

    let formattedString = inputString;
    let match;
    let offset = 0;

    // Reset regex for global matching
    numberRegex.lastIndex = 0;

    while ((match = numberRegex.exec(inputString)) !== null) {
      const originalNumberStr = match[0];
      const position = match.index;
      
      // Parse the number (remove existing commas for parsing)
      const cleanNumber = originalNumberStr.replace(/,/g, '');
      const parsedNumber = parseFloat(cleanNumber);
      
      if (!isNaN(parsedNumber)) {
        // Apply decimal places if specified
        let numberToFormat = parsedNumber;
        const formatOptions: FormatOptions = {};
        
        if (decimalPlaces !== undefined) {
          formatOptions.minimumFractionDigits = decimalPlaces;
          formatOptions.maximumFractionDigits = decimalPlaces;
        }

        // Format the number according to the target country
        const formatted = this.numberFormatterService.formatNumber(
          numberToFormat,
          targetCountryInfo,
          formatOptions
        );

        if (formatted) {
          // Replace in the string
          const beforeReplacement = formattedString.substring(0, position + offset);
          const afterReplacement = formattedString.substring(position + offset + originalNumberStr.length);
          formattedString = beforeReplacement + formatted.formatted + afterReplacement;
          
          // Track the replacement
          replacements.push({
            original: originalNumberStr,
            formatted: formatted.formatted,
            position: position
          });

          // Update offset for subsequent replacements
          offset += formatted.formatted.length - originalNumberStr.length;
        }
      }
    }

    return {
      formattedString,
      originalString: inputString,
      numbersFound: replacements.length,
      replacements,
      countryUsed: targetCountryInfo.countryCode
    };
  }

  /**
   * Simple method to format all numbers in a string
   * @param inputString The string containing numbers to format
   * @param countryCode Optional country code (uses current country if not provided)
   * @param decimalPlaces Optional number of decimal places to force
   * @returns Only the formatted string
   */
  formatNumbersInString(
    inputString: string, 
    countryCode?: string, 
    decimalPlaces?: number
  ): string {
    if (!this.currentCountryInfo && !countryCode) {
      throw new Error('Formatter not initialized and no country code provided. Call initialize() first or provide a country code.');
    }

    // Determine which country to use for formatting
    let targetCountryInfo: CountryInfo;
    if (countryCode) {
      targetCountryInfo = this.countryDetectionService.getCountryInfo(countryCode);
    } else {
      targetCountryInfo = this.currentCountryInfo!;
    }

    // Regular expression to find complete numbers (integers and decimals)
    const numberRegex = /\b\d+\.?\d*\b/g;
    
    let formattedString = inputString;
    let offset = 0;

    // Find and replace all numbers
    const matches = Array.from(inputString.matchAll(numberRegex));
    
    for (const match of matches) {
      const originalNumberStr = match[0];
      const position = match.index!;
      
      // Parse the number
      const parsedNumber = parseFloat(originalNumberStr);
      
      if (!isNaN(parsedNumber)) {
        // Apply decimal places if specified
        const formatOptions: FormatOptions = {};
        
        if (decimalPlaces !== undefined) {
          formatOptions.minimumFractionDigits = decimalPlaces;
          formatOptions.maximumFractionDigits = decimalPlaces;
        }

        // Format the number according to the target country
        const formatted = this.numberFormatterService.formatNumber(
          parsedNumber,
          targetCountryInfo,
          formatOptions
        );

        if (formatted) {
          // Replace in the string
          const beforeReplacement = formattedString.substring(0, position + offset);
          const afterReplacement = formattedString.substring(position + offset + originalNumberStr.length);
          formattedString = beforeReplacement + formatted.formatted + afterReplacement;
          
          // Update offset for subsequent replacements
          offset += formatted.formatted.length - originalNumberStr.length;
        }
      }
    }

    return formattedString;
  }
}

// Default export for convenience
export default CountryLocaleFormatter;
