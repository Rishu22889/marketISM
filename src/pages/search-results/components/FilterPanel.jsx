import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  isVisible, 
  onClose,
  className = "" 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    { id: 'all', label: 'All Categories', count: 1247 },
    { id: 'textbooks', label: 'Textbooks', count: 342 },
    { id: 'electronics', label: 'Electronics', count: 189 },
    { id: 'furniture', label: 'Furniture', count: 156 },
    { id: 'clothing', label: 'Clothing', count: 234 },
    { id: 'sports', label: 'Sports Equipment', count: 98 },
    { id: 'kitchen', label: 'Kitchen Items', count: 67 },
    { id: 'bikes', label: 'Bikes & Cycles', count: 45 },
    { id: 'gaming', label: 'Gaming', count: 78 },
    { id: 'art', label: 'Art Supplies', count: 34 }
  ];

  const conditions = [
    { id: 'new', label: 'Brand New', count: 156 },
    { id: 'like-new', label: 'Like New', count: 423 },
    { id: 'good', label: 'Good Condition', count: 567 },
    { id: 'fair', label: 'Fair Condition', count: 234 },
    { id: 'poor', label: 'Needs Repair', count: 67 }
  ];

  const timeframes = [
    { id: 'all', label: 'Any Time' },
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' }
  ];

  const handlePriceChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const newPriceRange = {
      ...localFilters?.priceRange,
      [field]: numValue
    };
    setLocalFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setLocalFilters(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  const handleConditionChange = (conditionId, checked) => {
    const newConditions = checked
      ? [...localFilters?.condition, conditionId]
      : localFilters?.condition?.filter(c => c !== conditionId);
    
    setLocalFilters(prev => ({
      ...prev,
      condition: newConditions
    }));
  };

  const handleTimeframeChange = (timeframeId) => {
    setLocalFilters(prev => ({
      ...prev,
      timeframe: timeframeId
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    if (onClose) onClose();
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      condition: [],
      timeframe: 'all'
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-card border border-border rounded-lg shadow-elevation-2 ${className}`}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          iconName="X"
        />
      </div>
      <div className="p-4 space-y-6 max-h-[70vh] lg:max-h-none overflow-y-auto">
        {/* Price Range */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min ₹"
                value={localFilters?.priceRange?.min || ''}
                onChange={(e) => handlePriceChange('min', e?.target?.value)}
                className="text-sm"
              />
              <Input
                type="number"
                placeholder="Max ₹"
                value={localFilters?.priceRange?.max || ''}
                onChange={(e) => handlePriceChange('max', e?.target?.value)}
                className="text-sm"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Categories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories?.map((category) => (
              <label
                key={category?.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-smooth"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="category"
                    value={category?.id}
                    checked={localFilters?.category === category?.id}
                    onChange={() => handleCategoryChange(category?.id)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground">{category?.label}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {category?.count}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Condition</h4>
          <div className="space-y-2">
            {conditions?.map((condition) => (
              <Checkbox
                key={condition?.id}
                label={
                  <div className="flex items-center justify-between w-full">
                    <span>{condition?.label}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {condition?.count}
                    </span>
                  </div>
                }
                checked={localFilters?.condition?.includes(condition?.id)}
                onChange={(e) => handleConditionChange(condition?.id, e?.target?.checked)}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Time Posted */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Posted</h4>
          <div className="space-y-2">
            {timeframes?.map((timeframe) => (
              <label
                key={timeframe?.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-smooth"
              >
                <input
                  type="radio"
                  name="timeframe"
                  value={timeframe?.id}
                  checked={localFilters?.timeframe === timeframe?.id}
                  onChange={() => handleTimeframeChange(timeframe?.id)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-foreground">{timeframe?.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border space-y-3">
          <Button
            onClick={applyFilters}
            fullWidth
            iconName="Filter"
            iconPosition="left"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={resetFilters}
            fullWidth
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;