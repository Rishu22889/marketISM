import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const HeroSection = ({ isAuthenticated, onSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const mockSuggestions = [
    'Engineering Textbooks', 'iPhone 13', 'Study Table', 'Mountain Bike',
    'Laptop Bag', 'Scientific Calculator', 'Hostel Furniture', 'Gaming Mouse',
    'Chemistry Books', 'Cycle Lock', 'Desk Lamp', 'Backpack'
  ];

  const quickCategories = [
    { id: 'textbooks', label: 'Textbooks', icon: 'Book', color: 'bg-blue-500' },
    { id: 'electronics', label: 'Electronics', icon: 'Smartphone', color: 'bg-purple-500' },
    { id: 'bikes', label: 'Bikes', icon: 'Bike', color: 'bg-green-500' },
    { id: 'furniture', label: 'Furniture', icon: 'Armchair', color: 'bg-orange-500' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInputChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    
    if (value?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      )?.slice(0, 6);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearchSubmit(searchQuery?.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearchSubmit(suggestion);
    setShowSuggestions(false);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search-results?category=${categoryId}`);
  };

  const handlePostItemClick = () => {
    if (isAuthenticated) {
      navigate('/add-product-listing');
    } else {
      navigate('/user-login?returnTo=/add-product-listing');
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Campus Marketplace for
            <span className="text-primary block sm:inline sm:ml-3">IIT(ISM) Students</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Buy and sell textbooks, electronics, furniture, and more within your college community. 
            Verified student-to-student commerce made simple.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-8" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for textbooks, electronics, furniture..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => searchQuery?.length > 0 && setShowSuggestions(true)}
                className="pl-12 pr-20 py-4 text-lg rounded-xl shadow-elevation-2"
              />
              <Icon 
                name="Search" 
                size={24} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
              >
                Search
              </Button>
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-elevation-3 z-50 animate-fade-in">
                {searchSuggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-smooth first:rounded-t-xl last:rounded-b-xl flex items-center space-x-3"
                  >
                    <Icon name="Search" size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Quick Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {quickCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => handleCategoryClick(category?.id)}
              className="flex flex-col items-center p-6 bg-card rounded-xl border border-border hover:shadow-elevation-2 transition-smooth group"
            >
              <div className={`w-12 h-12 ${category?.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon name={category?.icon} size={24} color="white" />
              </div>
              <span className="text-sm font-medium text-foreground">{category?.label}</span>
            </button>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            size="lg"
            onClick={handlePostItemClick}
            iconName="Plus"
            iconPosition="left"
            className="px-8 py-4 text-lg rounded-xl shadow-elevation-2"
          >
            {isAuthenticated ? 'Post Your Item' : 'Sign In to Post Item'}
          </Button>
          
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Shield" size={20} className="text-success" />
            <span className="text-sm">Verified @iitism.ac.in students only</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1,247</div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">856</div>
            <div className="text-sm text-muted-foreground">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">₹2.3L</div>
            <div className="text-sm text-muted-foreground">Money Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;