import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchHeader = ({ 
  searchQuery, 
  totalResults, 
  activeFilters, 
  onClearFilters,
  onToggleFilters,
  showFilters 
}) => {
  const navigate = useNavigate();

  const getFilterCount = () => {
    let count = 0;
    if (activeFilters?.category && activeFilters?.category !== 'all') count++;
    if (activeFilters?.priceRange?.min > 0 || activeFilters?.priceRange?.max < 50000) count++;
    if (activeFilters?.condition?.length > 0) count++;
    if (activeFilters?.timeframe !== 'all') count++;
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <div className="bg-card border-b border-border sticky top-32 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Query and Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {searchQuery ? (
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Search results for "{searchQuery}"
                </h1>
                <span className="text-sm text-muted-foreground">
                  ({totalResults?.toLocaleString('en-IN')} items found)
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-foreground">
                  Browse Marketplace
                </h1>
                <span className="text-sm text-muted-foreground">
                  ({totalResults?.toLocaleString('en-IN')} items available)
                </span>
              </div>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={onToggleFilters}
              iconName="Filter"
              iconPosition="left"
              className="relative"
            >
              Filters
              {filterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {filterCount > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            <div className="flex items-center space-x-2 flex-wrap">
              {activeFilters?.category && activeFilters?.category !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  Category: {activeFilters?.category}
                </span>
              )}
              {(activeFilters?.priceRange?.min > 0 || activeFilters?.priceRange?.max < 50000) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  ₹{activeFilters?.priceRange?.min?.toLocaleString('en-IN')} - ₹{activeFilters?.priceRange?.max?.toLocaleString('en-IN')}
                </span>
              )}
              {activeFilters?.condition?.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  Condition: {activeFilters?.condition?.join(', ')}
                </span>
              )}
              {activeFilters?.timeframe !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  {activeFilters?.timeframe === '24h' ? 'Last 24 hours' : 
                   activeFilters?.timeframe === '7d' ? 'Last 7 days' : 
                   activeFilters?.timeframe === '30d' ? 'Last 30 days' : 'This week'}
                </span>
              )}
              <Button
                variant="ghost"
                size="xs"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate('/homepage')}
            className="hover:text-foreground transition-smooth"
          >
            Home
          </button>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground">Search Results</span>
          {searchQuery && (
            <>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground truncate max-w-xs">"{searchQuery}"</span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default SearchHeader;