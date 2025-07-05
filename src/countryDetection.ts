import { CountryInfo } from './types';
import { COUNTRY_LOCALE_MAP, COUNTRY_CURRENCY_MAP, DEFAULT_LOCALE, DEFAULT_CURRENCY } from './constants';

export class CountryDetectionService {
  private static instance: CountryDetectionService;
  private cache: Map<string, CountryInfo> = new Map();
  private defaultCountryInfo: CountryInfo;
  private currentCountryInfo: CountryInfo | null = null;

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
   * Set country by country code (provided from frontend)
   */
  public setCountryByCode(countryCode?: string): CountryInfo {
    const finalCountryCode = countryCode || this.detectFromBrowserLocale().countryCode;
    const countryInfo = this.createCountryInfo(finalCountryCode);
    
    this.currentCountryInfo = countryInfo;
    this.cache.set('current', countryInfo);
    
    return countryInfo;
  }

  /**
   * Fallback to browser locale detection (no IP required)
   */
  private detectFromBrowserLocale(): CountryInfo {
    if (typeof window !== 'undefined' && window.navigator) {
      // Try multiple navigator properties for better detection
      const locale = window.navigator.language || 
                    (window.navigator as any).userLanguage || 
                    (window.navigator as any).browserLanguage || 
                    'en-US';
      
      const countryCode = locale.split('-')[1] || 'US';
      
      return this.createCountryInfo(countryCode.toUpperCase());
    }
    
    return this.defaultCountryInfo;
  }

  /**
   * Get country info by country code
   */
  getCountryInfo(countryCode?: string): CountryInfo {
    if (countryCode) {
      const upperCode = countryCode.toUpperCase();
      return this.createCountryInfo(upperCode);
    }
    
    return this.currentCountryInfo || this.defaultCountryInfo;
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
      'DK': 'Denmark',
      'PK': 'Pakistan',
      'ID': 'Indonesia',
      'BD': 'Bangladesh',
      'NG': 'Nigeria',
      'TR': 'Turkey',
      'IR': 'Iran',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'PH': 'Philippines',
      'ET': 'Ethiopia',
      'EG': 'Egypt',
      'ZA': 'South Africa',
      'AR': 'Argentina',
      'UA': 'Ukraine',
      'PL': 'Poland',
      'UZ': 'Uzbekistan',
      'MY': 'Malaysia',
      'AF': 'Afghanistan',
      'SA': 'Saudi Arabia',
      'PE': 'Peru',
      'AO': 'Angola',
      'GH': 'Ghana',
      'YE': 'Yemen',
      'NP': 'Nepal',
      'VE': 'Venezuela',
      'MG': 'Madagascar',
      'CM': 'Cameroon',
      'CI': 'Ivory Coast',
      'NE': 'Niger',
      'LK': 'Sri Lanka',
      'BF': 'Burkina Faso',
      'ML': 'Mali',
      'CL': 'Chile',
      'MW': 'Malawi',
      'RO': 'Romania',
      'KZ': 'Kazakhstan',
      'ZM': 'Zambia',
      'SY': 'Syria',
      'SO': 'Somalia',
      'GT': 'Guatemala',
      'SN': 'Senegal',
      'TD': 'Chad',
      'TN': 'Tunisia',
      'ZW': 'Zimbabwe',
      'GN': 'Guinea',
      'RW': 'Rwanda',
      'BJ': 'Benin',
      'BI': 'Burundi',
      'TZ': 'Tanzania',
      'HT': 'Haiti',
      'AZ': 'Azerbaijan',
      'AT': 'Austria',
      'RS': 'Serbia',
      'TG': 'Togo',
      'SL': 'Sierra Leone',
      'HK': 'Hong Kong',
      'LY': 'Libya',
      'JO': 'Jordan',
      'PG': 'Papua New Guinea',
      'ER': 'Eritrea',
      'UY': 'Uruguay',
      'MN': 'Mongolia',
      'AM': 'Armenia',
      'JM': 'Jamaica',
      'QA': 'Qatar',
      'AL': 'Albania',
      'PR': 'Puerto Rico',
      'LT': 'Lithuania',
      'NA': 'Namibia',
      'GM': 'Gambia',
      'BW': 'Botswana',
      'GA': 'Gabon',
      'LS': 'Lesotho',
      'GW': 'Guinea-Bissau',
      'SZ': 'Eswatini',
      'MU': 'Mauritius',
      'FJ': 'Fiji',
      'CY': 'Cyprus',
      'DJ': 'Djibouti',
      'KM': 'Comoros',
      'BH': 'Bahrain',
      'TT': 'Trinidad and Tobago',
      'EE': 'Estonia',
      'TM': 'Turkmenistan',
      'MV': 'Maldives',
      'LU': 'Luxembourg',
      'MT': 'Malta',
      'BB': 'Barbados',
      'BN': 'Brunei',
      'IS': 'Iceland',
      'VU': 'Vanuatu',
      'ST': 'São Tomé and Príncipe',
      'SM': 'San Marino',
      'LI': 'Liechtenstein',
      'AD': 'Andorra',
      'MC': 'Monaco',
      'NR': 'Nauru',
      'TV': 'Tuvalu',
      'VA': 'Vatican City'
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
