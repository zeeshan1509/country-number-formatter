import { CountryDetectionService } from '../countryDetection';
import { NumberFormatterService } from '../numberFormatter';
import { CountryLocaleFormatter } from '../index';

describe('CountryLocaleFormatter', () => {
  let formatter: CountryLocaleFormatter;

  beforeEach(() => {
    formatter = new CountryLocaleFormatter();
  });

  afterEach(() => {
    // Clear caches
    CountryDetectionService.getInstance().clearCache();
    NumberFormatterService.getInstance().clearCache();
  });

  describe('initialization', () => {
    it('should initialize with manual country setting', async () => {
      const countryInfo = await formatter.initialize(false, 'DE');
      
      expect(countryInfo).toBeDefined();
      expect(countryInfo.countryCode).toBe('DE');
      expect(countryInfo.locale).toBe('de-DE');
      expect(countryInfo.currency).toBe('EUR');
    });

    it('should set country manually', () => {
      formatter.setCountry('FR');
      const countryInfo = formatter.getCountryInfo();
      
      expect(countryInfo).toBeDefined();
      expect(countryInfo?.countryCode).toBe('FR');
      expect(countryInfo?.locale).toBe('fr-FR');
      expect(countryInfo?.currency).toBe('EUR');
    });
  });

  describe('number formatting', () => {
    beforeEach(async () => {
      await formatter.initialize(false, 'US');
    });

    it('should format numbers correctly', () => {
      const result = formatter.formatNumber(1234.56);
      
      expect(result).toBeDefined();
      expect(result?.formatted).toBe('1,234.56');
      expect(result?.locale).toBe('en-US');
    });

    it('should format currency correctly', () => {
      const result = formatter.formatCurrency(1234.56);
      
      expect(result).toBeDefined();
      expect(result?.formatted).toContain('$');
      expect(result?.currency).toBe('USD');
    });

    it('should format percentages correctly', () => {
      const result = formatter.formatPercent(0.1234);
      
      expect(result).toBeDefined();
      expect(result?.formatted).toContain('%');
    });
  });

  describe('different locales', () => {
    it('should format German numbers correctly', async () => {
      await formatter.initialize(false, 'DE');
      const result = formatter.formatNumber(1234.56);
      
      expect(result).toBeDefined();
      expect(result?.locale).toBe('de-DE');
      expect(result?.formatted).toBe('1.234,56');
    });

    it('should format French currency correctly', async () => {
      await formatter.initialize(false, 'FR');
      const result = formatter.formatCurrency(1234.56);
      
      expect(result).toBeDefined();
      expect(result?.currency).toBe('EUR');
      expect(result?.locale).toBe('fr-FR');
    });

    it('should format Japanese yen correctly', async () => {
      await formatter.initialize(false, 'JP');
      const result = formatter.formatCurrency(1234);
      
      expect(result).toBeDefined();
      expect(result?.currency).toBe('JPY');
      expect(result?.locale).toBe('ja-JP');
    });
  });

  describe('number parsing', () => {
    beforeEach(async () => {
      await formatter.initialize(false, 'US');
    });

    it('should parse US formatted numbers', () => {
      const parsed = formatter.parseNumber('1,234.56');
      expect(parsed).toBe(1234.56);
    });

    it('should parse currency values', () => {
      const parsed = formatter.parseNumber('$1,234.56');
      expect(parsed).toBe(1234.56);
    });
  });

  describe('error handling', () => {
    it('should throw error when formatting without initialization', () => {
      expect(() => formatter.formatNumber(123)).toThrow('Formatter not initialized');
    });

    it('should throw error when parsing without initialization', () => {
      expect(() => formatter.parseNumber('123')).toThrow('Formatter not initialized');
    });
  });
});
