import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CategoryQuickNav from '../../components/ui/CategoryQuickNav';
import SearchHeader from './components/SearchHeader';
import FilterPanel from './components/FilterPanel';
import SortControls from './components/SortControls';
import ProductCard from './components/ProductCard';
import NoResults from './components/NoResults';
import Pagination from './components/Pagination';

import Button from '../../components/ui/Button';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Authentication state (mock)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [filters, setFilters] = useState({
    category: searchParams?.get('category') || 'all',
    priceRange: { min: 0, max: 50000 },
    condition: [],
    timeframe: 'all'
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(24);
  const [hasInfiniteScroll] = useState(false);

  // Loading and data state
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  // Mock products data
  const mockProducts = [
    {
      id: '1',
      title: 'Engineering Mathematics Textbook - 3rd Edition',
      description: 'Comprehensive mathematics textbook for engineering students. Covers calculus, linear algebra, and differential equations. Excellent condition with minimal highlighting.',
      price: 850,
      category: 'textbooks',
      condition: 'good',
      location: 'IIT Campus',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
      ],
      seller: {
        id: 'seller1',
        name: 'Rahul Sharma',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.8,
        university: 'IIT ISM Dhanbad'
      },
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isWishlisted: false,
      views: 45,
      isAvailable: true
    },
    {
      id: '2',
      title: 'MacBook Air M1 - 8GB RAM, 256GB SSD',
      description: 'Excellent condition MacBook Air with M1 chip. Perfect for coding and design work. Includes original charger and box. Battery health at 95%.',
      price: 65000,
      category: 'electronics',
      condition: 'like-new',
      location: 'Hostel Block A',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
      ],
      seller: {
        id: 'seller2',
        name: 'Priya Patel',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.9,
        university: 'IIT ISM Dhanbad'
      },
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isWishlisted: true,
      views: 128,
      isAvailable: true
    },
    {
      id: '3',
      title: 'Study Table with Chair - Wooden',
      description: 'Solid wood study table with matching chair. Perfect for dorm room or study space. Some minor scratches but very sturdy and functional.',
      price: 3500,
      category: 'furniture',
      condition: 'good',
      location: 'Near Main Gate',
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
      ],
      seller: {
        id: 'seller3',
        name: 'Amit Kumar',
        avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
        rating: 4.6,
        university: 'IIT ISM Dhanbad'
      },
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isWishlisted: false,
      views: 67,
      isAvailable: true
    },
    {
      id: '4',
      title: 'Gaming Headphones - Sony WH-1000XM4',
      description: 'Premium noise-canceling headphones perfect for gaming and music. Excellent sound quality with active noise cancellation. Barely used.',
      price: 18000,
      category: 'electronics',
      condition: 'like-new',
      location: 'Hostel Block C',
      images: [
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
      ],
      seller: {
        id: 'seller4',
        name: 'Sneha Gupta',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 4.7,
        university: 'IIT ISM Dhanbad'
      },
      postedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isWishlisted: false,
      views: 89,
      isAvailable: true
    },
    {
      id: '5',
      title: 'Mountain Bike - Trek 3500',
      description: 'Well-maintained mountain bike perfect for campus rides and weekend adventures. 21-speed gear system, good tire condition. Ready to ride!',
      price: 12000,
      category: 'bikes',
      condition: 'good',
      location: 'Sports Complex',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400'
      ],
      seller: {
        id: 'seller5',
        name: 'Vikash Singh',
        avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
        rating: 4.5,
        university: 'IIT ISM Dhanbad'
      },
      postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isWishlisted: false,
      views: 156,
      isAvailable: true
    },
    {
      id: '6',
      title: 'Winter Jacket - North Face',
      description: 'Warm winter jacket perfect for cold weather. Waterproof and windproof. Size L, excellent condition with no tears or stains.',
      price: 4500,
      category: 'clothing',
      condition: 'good',
      location: 'Hostel Block B',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'
      ],
      seller: {
        id: 'seller6',
        name: 'Anita Rao',
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
        rating: 4.8,
        university: 'IIT ISM Dhanbad'
      },
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isWishlisted: true,
      views: 34,
      isAvailable: true
    }
  ];

  // Filter and search logic
  const getFilteredProducts = () => {
    let filtered = [...mockProducts];

    // Search query filter
    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(product =>
        product?.title?.toLowerCase()?.includes(query) ||
        product?.description?.toLowerCase()?.includes(query) ||
        product?.category?.toLowerCase()?.includes(query)
      );
    }

    // Category filter
    if (filters?.category && filters?.category !== 'all') {
      filtered = filtered?.filter(product => product?.category === filters?.category);
    }

    // Price range filter
    filtered = filtered?.filter(product =>
      product?.price >= filters?.priceRange?.min &&
      product?.price <= filters?.priceRange?.max
    );

    // Condition filter
    if (filters?.condition?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.condition?.includes(product?.condition)
      );
    }

    // Timeframe filter
    if (filters?.timeframe !== 'all') {
      const now = new Date();
      const timeLimit = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      }?.[filters?.timeframe];

      if (timeLimit) {
        filtered = filtered?.filter(product =>
          now - new Date(product.postedAt) <= timeLimit
        );
      }
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'newest':
        filtered?.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
        break;
      case 'popularity':
        filtered?.sort((a, b) => b?.views - a?.views);
        break;
      default: // relevance
        // Keep original order for relevance
        break;
    }

    return filtered;
  };

  // Update products when filters change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filteredProducts = getFilteredProducts();
      setProducts(filteredProducts);
      setTotalResults(filteredProducts?.length);
      setCurrentPage(1);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, filters, sortBy]);

  // Update search query from URL params
  useEffect(() => {
    const query = searchParams?.get('q') || '';
    const category = searchParams?.get('category') || 'all';
    
    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      category: category
    }));
  }, [searchParams]);

  // Pagination
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentProducts = products?.slice(startIndex, endIndex);

  // Event handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: { min: 0, max: 50000 },
      condition: [],
      timeframe: 'all'
    };
    setFilters(defaultFilters);
    setSearchQuery('');
    navigate('/search-results');
  };

  const handleWishlistToggle = (productId, isWishlisted) => {
    if (!isAuthenticated) {
      navigate('/user-login?returnTo=' + encodeURIComponent(window.location?.pathname));
      return;
    }
    
    setProducts(prev =>
      prev?.map(product =>
        product?.id === productId
          ? { ...product, isWishlisted }
          : product
      )
    );
  };

  const handleContactSeller = (product) => {
    if (!isAuthenticated) {
      navigate('/user-login?returnTo=' + encodeURIComponent(window.location?.pathname));
      return;
    }
    
    // Mock contact functionality
    console.log('Contacting seller for product:', product?.title);
    alert(`Contact functionality would open for ${product?.seller?.name}`);
  };

  const handleAuthStateChange = (authenticated, user) => {
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
  };

  const handleCategorySelect = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      category: categoryId
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onAuthStateChange={handleAuthStateChange}
      />
      {/* Category Navigation */}
      <CategoryQuickNav
        activeCategory={filters?.category}
        onCategoryChange={handleCategorySelect}
      />
      {/* Search Header */}
      <SearchHeader
        searchQuery={searchQuery}
        totalResults={totalResults}
        activeFilters={filters}
        onClearFilters={handleClearFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />
      {/* Sort Controls */}
      <SortControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={totalResults}
      />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-48">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isVisible={true}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-md mt-20">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isVisible={true}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              // Loading State
              (<div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>)
            ) : totalResults === 0 ? (
              // No Results
              (<NoResults
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
                onCategorySelect={handleCategorySelect}
              />)
            ) : (
              // Products Grid
              (<>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
                }`}>
                  {currentProducts?.map((product) => (
                    <ProductCard
                      key={product?.id}
                      product={product}
                      viewMode={viewMode}
                      isAuthenticated={isAuthenticated}
                      onWishlistToggle={handleWishlistToggle}
                      onContactSeller={handleContactSeller}
                    />
                  ))}
                </div>
                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onPageChange={setCurrentPage}
                  onLoadMore={() => setCurrentPage(prev => prev + 1)}
                  hasInfiniteScroll={hasInfiniteScroll}
                />
              </>)
            )}
          </div>
        </div>
      </div>
      {/* Floating Action Button (Mobile) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setShowFilters(true)}
          size="icon"
          className="w-14 h-14 rounded-full shadow-elevation-3"
          iconName="Filter"
        />
      </div>
    </div>
  );
};

export default SearchResults;