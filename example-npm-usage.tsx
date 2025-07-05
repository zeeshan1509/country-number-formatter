import React from 'react';
// Import paths for when using the published npm package
import {
  CountryFormatterProvider,
  CurrencyDisplay,
  NumberDisplay,
  PercentDisplay,
  CountryInfoComponent as CountryInfo,
  useCountryFormatter
} from 'country-locale-formatter/react';

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
        <h1>Country Locale Formatter Demo</h1>
        
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
      </div>
    </CountryFormatterProvider>
  );
}

export default App;
