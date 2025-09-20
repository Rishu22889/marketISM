import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HeroSection from './components/HeroSection';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Icon from '../../components/AppIcon';

const Homepage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { user, loading } = useAuth();

  // Handle URL parameters
  useEffect(() => {
    const query = searchParams?.get('q');
    const category = searchParams?.get('category');
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (category) {
      setActiveCategory(category);
    }
  }, [searchParams]);

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    // Update URL with search query
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams?.set('q', query);
    } else {
      newParams?.delete('q');
    }
    setSearchParams(newParams);
    
    // Scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Update URL with category
    const newParams = new URLSearchParams(searchParams);
    if (categoryId !== 'all') {
      newParams?.set('category', categoryId);
    } else {
      newParams?.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection 
        isAuthenticated={!!user && !loading}
        user={user}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Category Filter */}
      <CategoryFilter 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Products Section */}
      <section id="products-section" className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid 
            searchQuery={searchQuery}
            selectedCategory={activeCategory}
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Choose marketISM?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted campus marketplace designed specifically for IIT(ISM) students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Shield" size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Verified Students Only
              </h3>
              <p className="text-muted-foreground">
                All users verified with @iitism.ac.in email addresses for secure transactions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Campus-Wide Delivery
              </h3>
              <p className="text-muted-foreground">
                Easy pickup and delivery within campus hostels and academic buildings
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="IndianRupee" size={32} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Best Prices
              </h3>
              <p className="text-muted-foreground">
                Student-friendly pricing with no hidden fees or commissions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;