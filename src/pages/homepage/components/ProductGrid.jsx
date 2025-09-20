import React, { useState, useEffect } from 'react';
import { SupabaseService } from '../../../utils/supabaseService';
import { useAuth } from '../../../contexts/AuthContext';
import ProductCard from './ProductCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ProductGrid = ({ searchQuery = '', selectedCategory = 'all' }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistedItems, setWishlistedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(12);
  
  const { user } = useAuth();

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Load products from Supabase
  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await SupabaseService?.getProducts({
        searchQuery: searchQuery,
        category: selectedCategory,
        sortBy: sortBy,
        limit: 50,
        offset: 0
      });

      if (fetchError) {
        throw fetchError;
      }

      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load user's wishlist if authenticated
  const loadWishlist = async () => {
    if (!user) {
      setWishlistedItems(new Set());
      return;
    }

    try {
      const { data, error: wishlistError } = await SupabaseService?.getUserWishlist(user?.id);
      
      if (!wishlistError && data) {
        const wishlistedIds = new Set(data.map(item => item?.product_id));
        setWishlistedItems(wishlistedIds);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  };

  // Load products when component mounts or search parameters change
  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, sortBy]);

  // Load wishlist when user changes
  useEffect(() => {
    loadWishlist();
  }, [user]);

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/user-login?returnTo=' + encodeURIComponent(window.location?.pathname);
      return;
    }

    const isCurrentlyWishlisted = wishlistedItems?.has(productId);

    try {
      if (isCurrentlyWishlisted) {
        const { error } = await SupabaseService?.removeFromWishlist(productId);
        if (!error) {
          setWishlistedItems(prev => {
            const newSet = new Set(prev);
            newSet?.delete(productId);
            return newSet;
          });
        }
      } else {
        const { error } = await SupabaseService?.addToWishlist(productId);
        if (!error) {
          setWishlistedItems(prev => {
            const newSet = new Set(prev);
            newSet?.add(productId);
            return newSet;
          });
        }
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)]?.map((_, index) => (
          <div key={index} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="AlertCircle" size={32} className="text-error" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Error Loading Products
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {error}
        </p>
        <Button
          onClick={loadProducts}
          variant="outline"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const displayedProducts = filteredProducts?.slice(0, displayCount);
  const hasMoreProducts = displayCount < filteredProducts?.length;

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Listings'}
          </h2>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {filteredProducts?.length} items
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-48"
          />
        </div>
      </div>
      {/* Products Grid */}
      {displayedProducts?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts?.map((product) => (
              <ProductCard
                key={product?.id}
                product={product}
                onWishlistToggle={handleWishlistToggle}
                isWishlisted={wishlistedItems?.has(product?.id)}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreProducts && (
            <div className="text-center pt-8">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="lg"
                iconName="ChevronDown"
                iconPosition="right"
              >
                Load More Products
              </Button>
            </div>
          )}
        </>
      ) : (
        /* No Results */
        (<div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Search" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `We could not find any products matching "${searchQuery}". Try adjusting your search terms.`
              : 'No products available in this category right now. Check back later!'
            }
          </p>
          <Button
            onClick={loadProducts}
            variant="outline"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh Results
          </Button>
        </div>)
      )}
    </div>
  );
};

export default ProductGrid;