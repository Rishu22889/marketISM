import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ activeCategory = 'all', onCategoryChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items', icon: 'Grid3X3', count: 1247 },
    { id: 'textbooks', label: 'Textbooks', icon: 'Book', count: 342 },
    { id: 'electronics', label: 'Electronics', icon: 'Smartphone', count: 189 },
    { id: 'furniture', label: 'Furniture', icon: 'Armchair', count: 156 },
    { id: 'clothing', label: 'Clothing', icon: 'Shirt', count: 234 },
    { id: 'sports', label: 'Sports', icon: 'Dumbbell', count: 98 },
    { id: 'kitchen', label: 'Kitchen', icon: 'ChefHat', count: 67 },
    { id: 'bikes', label: 'Bikes', icon: 'Bike', count: 45 },
    { id: 'gaming', label: 'Gaming', icon: 'Gamepad2', count: 78 },
    { id: 'art', label: 'Art Supplies', icon: 'Palette', count: 34 }
  ];

  const visibleCategories = isExpanded ? categories : categories?.slice(0, 6);
  const hasMoreCategories = categories?.length > 6;

  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="bg-card border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              {visibleCategories?.map((category) => (
                <button
                  key={category?.id}
                  onClick={() => handleCategoryClick(category?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth ${
                    activeCategory === category?.id
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={category?.icon} size={16} />
                  <span>{category?.label}</span>
                  <span className="text-xs opacity-75 font-mono bg-white/20 px-1.5 py-0.5 rounded">
                    {category?.count}
                  </span>
                </button>
              ))}
            </div>

            {hasMoreCategories && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth ml-4"
              >
                <span>{isExpanded ? 'Less' : 'More'}</span>
                <Icon 
                  name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                />
              </button>
            )}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-foreground">Browse Categories</h3>
              {hasMoreCategories && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-primary hover:text-primary/80 transition-smooth"
                >
                  {isExpanded ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {visibleCategories?.map((category) => (
                <button
                  key={category?.id}
                  onClick={() => handleCategoryClick(category?.id)}
                  className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-smooth ${
                    activeCategory === category?.id
                      ? 'bg-primary text-primary-foreground shadow-elevation-1'
                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  }`}
                >
                  <Icon name={category?.icon} size={16} />
                  <div className="flex-1 text-left">
                    <div className="truncate">{category?.label}</div>
                    <div className="text-xs opacity-75 font-mono">
                      {category?.count} items
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Expanded Categories (Mobile) */}
          {isExpanded && hasMoreCategories && (
            <div className="md:hidden mt-4 pt-4 border-t border-border animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                {categories?.slice(6)?.map((category) => (
                  <button
                    key={category?.id}
                    onClick={() => handleCategoryClick(category?.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-smooth ${
                      activeCategory === category?.id
                        ? 'bg-primary text-primary-foreground shadow-elevation-1'
                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Icon name={category?.icon} size={16} />
                    <div className="flex-1 text-left">
                      <div className="truncate">{category?.label}</div>
                      <div className="text-xs opacity-75 font-mono">
                        {category?.count} items
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;