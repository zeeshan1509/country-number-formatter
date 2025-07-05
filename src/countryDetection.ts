import axios from 'axios';
import { CountryInfo, GeoLocationResponse } from './types';
import { COUNTRY_LOCALE_MAP, COUNTRY_CURRENCY_MAP, DEFAULT_LOCALE, DEFAULT_CURRENCY } from './constants';

export class CountryDetectionService {
  private static instance: CountryDetectionService;
  private cache: Map<string, CountryInfo> = new Map();
  private defaultCountryInfo: CountryInfo;

  constructor() {
    this.defaultCountryInfo = {
      countryCode: 'US',
      countryName: 'United States',
      currency: DEFAULT_CURRENCY,
      locale: DEFAULT_LOCALE
    };
  }

  public static getInstance(): CountryDetectionService {
    if (!CountryDetectionService.instance) {
      CountryDetectionService.instance = new CountryDetectionService();
    }
    return CountryDetectionService.instance;
  }

  /**
   * Detect country from IP address using multiple fallback services
   */
  async detectCountryFromIP(): Promise<CountryInfo> {
    try {
      // Try multiple IP geolocation services for better reliability
      const services = [
        () => this.detectFromIPAPI(),
        () => this.detectFromIPInfo(),
        () => this.detectFromIPGeolocation()
      ];

      for (const service of services) {
        try {
          const result = await service();
          if (result) {
            this.cache.set('current', result);
            return result;
          }
        } catch (error) {
          console.warn('IP detection service failed:', error);
          continue;
        }
      }

      // If all services fail, return browser locale or default
      return this.detectFromBrowserLocale();
    } catch (error) {
      console.error('Country detection failed:', error);
      return this.detectFromBrowserLocale();
    }
  }

  /**
   * Detect country using ipapi.co (free service)
   */
  private async detectFromIPAPI(): Promise<CountryInfo | null> {
    try {
      const response = await axios.get('https://ipapi.co/json/', {
        timeout: 5000,
        headers: {
          'User-Agent': 'country-locale-formatter/1.0.0'
        }
      });

      const data = response.data;
      if (data.country_code) {
        return this.createCountryInfo(data.country_code, data.country_name, data.currency);
      }
    } catch (error) {
      throw new Error('ipapi.co service failed');
    }
    return null;
  }

  /**
   * Detect country using ipinfo.io (free tier available)
   */
  private async detectFromIPInfo(): Promise<CountryInfo | null> {
    try {
      const response = await axios.get('https://ipinfo.io/json', {
        timeout: 5000,
        headers: {
          'User-Agent': 'country-locale-formatter/1.0.0'
        }
      });

      const data = response.data;
      if (data.country) {
        return this.createCountryInfo(data.country, data.country, undefined);
      }
    } catch (error) {
      throw new Error('ipinfo.io service failed');
    }
    return null;
  }

  /**
   * Detect country using ip-api.com (free service)
   */
  private async detectFromIPGeolocation(): Promise<CountryInfo | null> {
    try {
      const response = await axios.get('http://ip-api.com/json/', {
        timeout: 5000,
        headers: {
          'User-Agent': 'country-locale-formatter/1.0.0'
        }
      });

      const data = response.data;
      if (data.countryCode && data.status === 'success') {
        return this.createCountryInfo(data.countryCode, data.country, data.currency);
      }
    } catch (error) {
      throw new Error('ip-api.com service failed');
    }
    return null;
  }

  /**
   * Fallback to browser locale detection
   */
  private detectFromBrowserLocale(): CountryInfo {
    if (typeof window !== 'undefined' && window.navigator) {
      const locale = window.navigator.language || 'en-US';
      const countryCode = locale.split('-')[1] || 'US';
      
      return this.createCountryInfo(countryCode.toUpperCase(), '', undefined);
    }
    
    return this.defaultCountryInfo;
  }

  /**
   * Get country info by country code
   */
  getCountryInfo(countryCode: string): CountryInfo {
    const upperCode = countryCode.toUpperCase();
    return this.createCountryInfo(upperCode, '', undefined);
  }

  /**
   * Create CountryInfo object from country code
   */
  private createCountryInfo(countryCode: string, countryName?: string, currency?: string): CountryInfo {
    const upperCode = countryCode.toUpperCase();
    const locale = COUNTRY_LOCALE_MAP[upperCode] || DEFAULT_LOCALE;
    const currencyCode = currency || COUNTRY_CURRENCY_MAP[upperCode] || DEFAULT_CURRENCY;
    
    return {
      countryCode: upperCode,
      countryName: countryName || this.getCountryName(upperCode),
      currency: currencyCode,
      locale: locale
    };
  }

  /**
   * Get country name from country code
   */
  private getCountryName(countryCode: string): string {
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'DE': 'Germany',
      'FR': 'France',
      'ES': 'Spain',
      'IT': 'Italy',
      'JP': 'Japan',
      'KR': 'South Korea',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      'AU': 'Australia',
      'MX': 'Mexico',
      'RU': 'Russia',
      'NL': 'Netherlands',
      'CH': 'Switzerland',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark'
      // Add more as needed
    };
    
    return countryNames[countryCode] || countryCode;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cached country info
   */
  getCachedCountryInfo(): CountryInfo | null {
    return this.cache.get('current') || null;
  }
}
