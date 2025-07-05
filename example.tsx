import React from 'react';
import {
  CountryFormatterProvider,
  useCountryFormatter,
  CurrencyDisplay,
  NumberDisplay,
  PercentDisplay,
  CountryInfoComponent as CountryInfo
} from './src/react';

// Example 1: Using the React hook
function PriceDisplay() {
  const { formatCurrency, countryInfo, isLoading, error } = useCountryFormatter({
    autoDetect: true,
    defaultCountry: 'US',
    onCountryDetected: (country) => {
      console.log('Detected country:', country);
    },
    onError: (err) => {
      console.error('Detection failed:', err);
    }
  });

  if (isLoading) return <div>Detecting your location...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const price = 1234.56;
  const formattedPrice = formatCurrency(price);

  return (
    <div>
      <h3>Price Display Example</h3>
      <p>Raw price: {price}</p>
      <p>Formatted: {formattedPrice?.formatted}</p>
      <p>Country: {countryInfo?.countryName} ({countryInfo?.countryCode})</p>
      <p>Currency: {countryInfo?.currency}</p>
      <p>Locale: {countryInfo?.locale}</p>
    </div>
  );
}

// Example 2: Using React components with provider
function ProductCard({ product }: { product: { name: string; price: number; discount: number } }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px' }}>
      <h4>{product.name}</h4>
      <div>
        <strong>Price: </strong>
        <CurrencyDisplay value={product.price} />
      </div>
      <div>
        <strong>Discount: </strong>
        <PercentDisplay value={product.discount} />
      </div>
      <div>
        <strong>Savings: </strong>
        <CurrencyDisplay value={product.price * product.discount} />
      </div>
    </div>
  );
}

// Example 3: Manual country selection
function CountrySelector() {
  const { setCountry, countryInfo, getFormattingInfo } = useCountryFormatter();
  
  const countries = ['US', 'DE', 'FR', 'JP', 'IN', 'GB', 'CA', 'AU'];
  
  const formatInfo = getFormattingInfo();

  return (
    <div>
      <h3>Country Selector</h3>
      <div>
        <label>Select Country: </label>
        <select 
          value={countryInfo?.countryCode || ''}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map(code => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>
      
      {formatInfo && (
        <div style={{ marginTop: '16px' }}>
          <h4>Formatting Info:</h4>
          <p>Decimal separator: "{formatInfo.decimalSeparator}"</p>
          <p>Thousand separator: "{formatInfo.thousandSeparator}"</p>
          <p>Currency symbol: {formatInfo.currencySymbol}</p>
          <p>Example: {formatInfo.example}</p>
        </div>
      )}
    </div>
  );
}

// Example 4: Number formatting comparison
function FormattingComparison() {
  const { formatNumber, formatCurrency, formatPercent } = useCountryFormatter();
  
  const testValue = 1234567.89;
  const percentValue = 0.1234;

  return (
    <div>
      <h3>Formatting Examples</h3>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Raw Value</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Formatted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Number</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{testValue}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              {formatNumber(testValue)?.formatted}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Currency</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{testValue}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              {formatCurrency(testValue)?.formatted}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Percent</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{percentValue}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>
              {formatPercent(percentValue)?.formatted}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Example 5: String number formatting
function StringFormattingExample() {
  const { formatStringNumbers, formatNumbersInString, countryInfo } = useCountryFormatter();
  const [inputString, setInputString] = React.useState("hello 12345 this is my string can 46893.344 you fix this");
  const [selectedCountry, setSelectedCountry] = React.useState('auto');
  const [decimalPlaces, setDecimalPlaces] = React.useState<number | undefined>(undefined);

  // Determine which country to use
  const countryToUse = selectedCountry === 'auto' ? countryInfo?.countryCode : selectedCountry;

  const detailedResult = React.useMemo(() => {
    try {
      return formatStringNumbers(inputString, countryToUse, decimalPlaces);
    } catch (error) {
      return null;
    }
  }, [inputString, countryToUse, decimalPlaces, formatStringNumbers]);

  const simpleResult = React.useMemo(() => {
    try {
      return formatNumbersInString(inputString, countryToUse, decimalPlaces);
    } catch (error) {
      return null;
    }
  }, [inputString, countryToUse, decimalPlaces, formatNumbersInString]);

  return (
    <div style={{ border: '1px solid #ddd', padding: '16px', marginTop: '20px', borderRadius: '8px' }}>
      <h3>String Number Formatting</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label>Input String:</label>
        <textarea
          value={inputString}
          onChange={(e) => setInputString(e.target.value)}
          style={{ width: '100%', minHeight: '60px', margin: '4px 0', padding: '8px' }}
          placeholder="Enter a string with numbers..."
        />
      </div>
      
      <div style={{ marginBottom: '12px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div>
          <label>Country: </label>
          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            style={{ padding: '4px' }}
          >
            <option value="auto">Auto (Detected: {countryInfo?.countryCode || 'Loading...'})</option>
            <option value="US">US - United States</option>
            <option value="CH">CH - Switzerland</option>
            <option value="DE">DE - Germany</option>
            <option value="FR">FR - France</option>
            <option value="JP">JP - Japan</option>
            <option value="IN">IN - India</option>
          </select>
        </div>
        
        <div>
          <label>Decimal Places: </label>
          <select 
            value={decimalPlaces?.toString() || 'auto'}
            onChange={(e) => setDecimalPlaces(e.target.value === 'auto' ? undefined : parseInt(e.target.value))}
            style={{ padding: '4px' }}
          >
            <option value="auto">Auto (keep original)</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
      </div>
      
      {/* Simple result - just the formatted string */}
      {simpleResult && (
        <div style={{ backgroundColor: '#e8f5e8', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>✨ Simple Method (formatNumbersInString)</h4>
          <div style={{ marginBottom: '8px' }}>
            <strong>Result:</strong> <code style={{ color: '#2196f3' }}>{simpleResult}</code>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Country Used:</strong> <code>{countryToUse}</code> {selectedCountry === 'auto' && <span style={{ color: '#666' }}>(Auto-detected)</span>}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Returns only the formatted string - perfect for simple use cases
          </div>
        </div>
      )}
      
      {/* Detailed result - with metadata */}
      {detailedResult && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>📊 Detailed Method (formatStringNumbers)</h4>
          <div style={{ marginBottom: '8px' }}>
            <strong>Original:</strong> <code>{detailedResult.originalString}</code>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Formatted:</strong> <code style={{ color: '#2196f3' }}>{detailedResult.formattedString}</code>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Numbers found:</strong> {detailedResult.numbersFound}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Country used:</strong> {detailedResult.countryUsed}
          </div>
          {detailedResult.replacements.length > 0 && (
            <div>
              <strong>Replacements:</strong>
              <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                {detailedResult.replacements.map((replacement, index) => (
                  <li key={index}>
                    <code>{replacement.original}</code> → <code style={{ color: '#2196f3' }}>{replacement.formatted}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Returns detailed information including replacements - useful for debugging and analytics
          </div>
        </div>
      )}
    </div>
  );
}

// Main App component
function App() {
  const products = [
    { name: 'Laptop', price: 1299.99, discount: 0.15 },
    { name: 'Phone', price: 899.00, discount: 0.10 },
    { name: 'Tablet', price: 599.50, discount: 0.20 }
  ];

  return (
    <CountryFormatterProvider 
      autoDetect={true}
      defaultCountry="US"
      fallback={<div>Loading country information...</div>}
    >
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Country Number Formatter Demo</h1>
        
        {/* Country Info Display */}
        <CountryInfo style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '16px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }} />
        
        {/* Price Display Example */}
        <PriceDisplay />
        
        {/* Country Selector */}
        <CountrySelector />
        
        {/* Formatting Comparison */}
        <FormattingComparison />
        
        {/* String Formatting Example */}
        <StringFormattingExample />
        
        {/* Product Cards */}
        <div>
          <h3>Product Examples</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
        
        {/* Direct Component Usage */}
        <div style={{ marginTop: '20px' }}>
          <h3>Direct Component Usage</h3>
          <p>Large number: <NumberDisplay value={1234567.89} /></p>
          <p>Price: <CurrencyDisplay value={299.99} /></p>
          <p>Discount: <PercentDisplay value={0.25} /></p>
          <p>Small amount: <CurrencyDisplay value={0.99} minimumFractionDigits={2} /></p>
        </div>

        {/* String Formatting Example */}
        <StringFormattingExample />
      </div>
    </CountryFormatterProvider>
  );
}

export default App;
