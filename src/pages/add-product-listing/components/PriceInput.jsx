import React, { useState } from 'react';
import Input from '../../../components/ui/Input';

const PriceInput = ({ value, onChange, error }) => {
  const [displayValue, setDisplayValue] = useState(value ? `₹${value}` : '');

  const handleChange = (e) => {
    let inputValue = e?.target?.value;
    
    // Remove currency symbol and any non-numeric characters except decimal
    inputValue = inputValue?.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = inputValue?.split('.');
    if (parts?.length > 2) {
      inputValue = parts?.[0] + '.' + parts?.slice(1)?.join('');
    }
    
    // Limit decimal places to 2
    if (parts?.[1] && parts?.[1]?.length > 2) {
      inputValue = parts?.[0] + '.' + parts?.[1]?.substring(0, 2);
    }
    
    // Update display value with currency symbol
    const numericValue = parseFloat(inputValue) || 0;
    setDisplayValue(inputValue ? `₹${inputValue}` : '');
    
    // Pass numeric value to parent
    onChange(inputValue ? numericValue : '');
  };

  const handleFocus = (e) => {
    // Remove currency symbol when focused
    const numericValue = value ? value?.toString() : '';
    setDisplayValue(numericValue);
    e?.target?.select();
  };

  const handleBlur = (e) => {
    // Add currency symbol when blurred
    if (value) {
      setDisplayValue(`₹${value}`);
    }
  };

  const formatIndianCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })?.format(amount);
  };

  return (
    <div className="space-y-2">
      <Input
        label="Price"
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="₹0"
        error={error}
        required
        description="Enter the selling price in Indian Rupees"
      />
      
      {value && value > 0 && (
        <div className="text-xs text-muted-foreground">
          <p>Formatted: {formatIndianCurrency(value)}</p>
          {value >= 1000 && (
            <p className="text-primary">
              💡 Consider if this price is competitive for campus marketplace
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceInput;