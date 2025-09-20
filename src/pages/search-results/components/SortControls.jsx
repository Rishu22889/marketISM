import React from 'react';
import Icon from '../../../components/AppIcon';


const SortControls = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  totalResults 
}) => {
  const sortOptions = [
    { id: 'relevance', label: 'Relevance', icon: 'Target' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'TrendingUp' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'TrendingDown' },
    { id: 'newest', label: 'Newest First', icon: 'Clock' },
    { id: 'popularity', label: 'Most Popular', icon: 'Heart' }
  ];

  const viewModes = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { id: 'list', icon: 'List', label: 'List View' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Results Count */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Showing {totalResults?.toLocaleString('en-IN')} results
            </span>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e?.target?.value)}
                className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {sortOptions?.map((option) => (
                  <option key={option?.id} value={option?.id}>
                    {option?.label}
                  </option>
                ))}
              </select>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-muted rounded-lg p-1">
              {viewModes?.map((mode) => (
                <button
                  key={mode?.id}
                  onClick={() => onViewModeChange(mode?.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                    viewMode === mode?.id
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title={mode?.label}
                >
                  <Icon name={mode?.icon} size={16} />
                  <span className="hidden md:inline">{mode?.label?.split(' ')?.[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sort Options */}
        <div className="sm:hidden mt-3">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            {sortOptions?.map((option) => (
              <button
                key={option?.id}
                onClick={() => onSortChange(option?.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth ${
                  sortBy === option?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={option?.icon} size={14} />
                <span>{option?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortControls;