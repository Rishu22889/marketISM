import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const NoResults = ({ searchQuery, onClearFilters, onCategorySelect }) => {
  const navigate = useNavigate();

  const popularCategories = [
    { id: 'textbooks', label: 'Textbooks', icon: 'Book', count: 342 },
    { id: 'electronics', label: 'Electronics', icon: 'Smartphone', count: 189 },
    { id: 'furniture', label: 'Furniture', icon: 'Armchair', count: 156 },
    { id: 'clothing', label: 'Clothing', icon: 'Shirt', count: 234 }
  ];

  const searchSuggestions = [
    'laptop', 'textbook', 'bicycle', 'furniture', 'phone', 'calculator',
    'study table', 'backpack', 'headphones', 'gaming chair'
  ];

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    navigate(`/search-results?category=${categoryId}`);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/search-results?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      {/* Illustration */}
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="Search" size={48} className="text-muted-foreground" />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-background border-2 border-border rounded-full flex items-center justify-center">
              <Icon name="Frown" size={24} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      {/* Main Message */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          No results found
        </h2>
        {searchQuery ? (
          <p className="text-muted-foreground">
            We couldn't find any items matching "<span className="font-medium text-foreground">{searchQuery}</span>". 
            Try adjusting your search or browse our popular categories below.
          </p>
        ) : (
          <p className="text-muted-foreground">
            No items match your current filters. Try adjusting your criteria or browse our popular categories.
          </p>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Clear All Filters
        </Button>
        <Button
          onClick={() => navigate('/homepage')}
          iconName="Home"
          iconPosition="left"
        >
          Back to Homepage
        </Button>
      </div>
      {/* Search Suggestions */}
      {searchQuery && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-foreground mb-4">Try searching for:</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {searchSuggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-primary hover:text-primary-foreground transition-smooth"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Popular Categories */}
      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">Browse Popular Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => handleCategoryClick(category?.id)}
              className="p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                <Icon name={category?.icon} size={24} />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">{category?.label}</h4>
              <p className="text-xs text-muted-foreground">{category?.count} items</p>
            </button>
          ))}
        </div>
      </div>
      {/* Help Section */}
      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium text-foreground mb-2">Still can't find what you're looking for?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Try posting a request or contact our support team for assistance.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/add-product-listing')}
            iconName="Plus"
            iconPosition="left"
          >
            Post a Request
          </Button>
          <Button
            variant="ghost"
            iconName="MessageCircle"
            iconPosition="left"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoResults;