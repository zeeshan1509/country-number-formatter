import { useState, useEffect, useCallback, useMemo } from 'react';
import { CountryDetectionService } from './countryDetection';
import { NumberFormatterService } from './numberFormatter';
import { CountryInfo, FormattedNumber, FormatOptions } from './types';

export interface UseCountryFormatterOptions {
  autoDetect?: boolean;
  defaultCountry?: string;
  onCountryDetected?: (countryInfo: CountryInfo) => void;
  onError?: (error: Error) => void;
}

export interface UseCountryFormatterReturn {
  countryInfo: CountryInfo | null;
  isLoading: boolean;
  error: Error | null;
  formatNumber: (value: number, options?: FormatOptions) => FormattedNumber | null;
  formatCurrency: (value: number, options?: Omit<FormatOptions, 'type'>) => FormattedNumber | null;
  formatPercent: (value: number, options?: Omit<FormatOptions, 'type'>) => FormattedNumber | null;
  parseNumber: (formattedValue: string) => number | null;
  setCountry: (countryCode: string) => void;
  refreshCountry: () => Promise<void>;
  getFormattingInfo: () => ReturnType<NumberFormatterService['getFormattingInfo']> | null;
  formatStringNumbers: (
    inputString: string, 
    countryCode?: string, 
    decimalPlaces?: number
  ) => {
    formattedString: string;
    originalString: string;
    numbersFound: number;
    replacements: Array<{
      original: string;
      formatted: string;
      position: number;
    }>;
    countryUsed: string;
  };
  formatNumbersInString: (
    inputString: string, 
    countryCode?: string, 
    decimalPlaces?: number
  ) => string;
}

/**
 * React hook for country-based number formatting
 */
export function useCountryFormatter(
  options: UseCountryFormatterOptions = {}
): UseCountryFormatterReturn {
  const {
    autoDetect = true,
    defaultCountry = 'US',
    onCountryDetected,
    onError
  } = options;

  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(autoDetect);
  const [error, setError] = useState<Error | null>(null);

  const countryDetectionService = useMemo(() => CountryDetectionService.getInstance(), []);
  const numberFormatterService = useMemo(() => NumberFormatterService.getInstance(), []);

  // Detect country on mount
  useEffect(() => {
    if (autoDetect) {
      detectCountry();
    } else if (defaultCountry) {
      const defaultInfo = countryDetectionService.getCountryInfo(defaultCountry);
      setCountryInfo(defaultInfo);
      onCountryDetected?.(defaultInfo);
    }
  }, [autoDetect, defaultCountry]);

  const detectCountry = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const detected = await countryDetectionService.detectCountryFromIP();
      setCountryInfo(detected);
      onCountryDetected?.(detected);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Country detection failed');
      setError(error);
      onError?.(error);
      
      // Fallback to default country
      if (defaultCountry) {
        const fallback = countryDetectionService.getCountryInfo(defaultCountry);
        setCountryInfo(fallback);
      }
    } finally {
      setIsLoading(false);
    }
  }, [countryDetectionService, onCountryDetected, onError, defaultCountry]);

  const formatNumber = useCallback((
    value: number,
    options?: FormatOptions
  ): FormattedNumber | null => {
    if (!countryInfo) return null;
    return numberFormatterService.formatNumber(value, countryInfo, options);
  }, [countryInfo, numberFormatterService]);

  const formatCurrency = useCallback((
    value: number,
    options?: Omit<FormatOptions, 'type'>
  ): FormattedNumber | null => {
    if (!countryInfo) return null;
    return numberFormatterService.formatCurrency(value, countryInfo, options);
  }, [countryInfo, numberFormatterService]);

  const formatPercent = useCallback((
    value: number,
    options?: Omit<FormatOptions, 'type'>
  ): FormattedNumber | null => {
    if (!countryInfo) return null;
    return numberFormatterService.formatPercent(value, countryInfo, options);
  }, [countryInfo, numberFormatterService]);

  const parseNumber = useCallback((formattedValue: string): number | null => {
    if (!countryInfo) return null;
    return numberFormatterService.parseNumber(formattedValue, countryInfo);
  }, [countryInfo, numberFormatterService]);

  const setCountry = useCallback((countryCode: string) => {
    const newCountryInfo = countryDetectionService.getCountryInfo(countryCode);
    setCountryInfo(newCountryInfo);
    onCountryDetected?.(newCountryInfo);
  }, [countryDetectionService, onCountryDetected]);

  const refreshCountry = useCallback(async () => {
    await detectCountry();
  }, [detectCountry]);

  const getFormattingInfo = useCallback(() => {
    if (!countryInfo) return null;
    return numberFormatterService.getFormattingInfo(countryInfo);
  }, [countryInfo, numberFormatterService]);

  const formatStringNumbers = useCallback((
    inputString: string, 
    countryCode?: string, 
    decimalPlaces?: number
  ) => {
    // Determine which country to use for formatting
    let targetCountryInfo: CountryInfo;
    if (countryCode) {
      targetCountryInfo = countryDetectionService.getCountryInfo(countryCode);
    } else if (countryInfo) {
      targetCountryInfo = countryInfo;
    } else {
      throw new Error('No country information available. Either provide a country code or ensure the hook is initialized.');
    }

    // Regular expression to find complete numbers (integers and decimals)
    // Matches whole numbers like: 12345, 123.45, 46893.344, etc.
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
        const formatOptions: FormatOptions = {};
        
        if (decimalPlaces !== undefined) {
          formatOptions.minimumFractionDigits = decimalPlaces;
          formatOptions.maximumFractionDigits = decimalPlaces;
        }

        // Format the number according to the target country
        const formatted = numberFormatterService.formatNumber(
          parsedNumber,
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
  }, [countryInfo, countryDetectionService, numberFormatterService]);

  const formatNumbersInString = useCallback((
    inputString: string, 
    countryCode?: string, 
    decimalPlaces?: number
  ): string => {
    // Determine which country to use for formatting
    let targetCountryInfo: CountryInfo;
    if (countryCode) {
      targetCountryInfo = countryDetectionService.getCountryInfo(countryCode);
    } else if (countryInfo) {
      targetCountryInfo = countryInfo;
    } else {
      throw new Error('No country information available. Either provide a country code or ensure the hook is initialized.');
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
        const formatted = numberFormatterService.formatNumber(
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
  }, [countryInfo, countryDetectionService, numberFormatterService]);

  return {
    countryInfo,
    isLoading,
    error,
    formatNumber,
    formatCurrency,
    formatPercent,
    parseNumber,
    setCountry,
    refreshCountry,
    getFormattingInfo,
    formatStringNumbers,
    formatNumbersInString
  };
}
