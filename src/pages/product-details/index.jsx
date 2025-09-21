import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ImageGallery from './components/ImageGallery';
import ProductInfo from './components/ProductInfo';
import SellerInfo from './components/SellerInfo';
import ContactSellerModal from './components/ContactSellerModal';
import RelatedProducts from './components/RelatedProducts';
import ReportModal from './components/ReportModal';
import { supabase } from '../../lib/supabase';

const ProductDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams?.get('id') || '1';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          title,
          description,
          category,
          condition,
          price,
          original_price,
          images,
          location,
          views_count,
          created_at,
          user_profiles (
            id,
            full_name,
            avatar_url,
            hostel_location,
            is_verified
          )
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error loading product:', error);
        navigate('/homepage');
      } else if (data) {
        // match your component’s structure (seller nested)
        setProduct({
          ...data,
          seller: {
            id: data.user_profiles?.id,
            name: data.user_profiles?.full_name,
            avatar: data.user_profiles?.avatar_url,
            hostel_location: data.user_profiles?.hostel_location,
            isVerified: data.user_profiles?.is_verified
          }
        });

        // TODO: Optionally update views_count here
        // await supabase.from("products").update({ views_count: data.views_count + 1 }).eq("id", productId);
      } else {
        navigate('/homepage');
      }
    } catch (err) {
      console.error('Error loading product:', err);
      navigate('/homepage');
    } finally {
      setIsLoading(false);
    }
  };

  if (productId) loadProduct();
}, [productId, navigate]);

  const handleAuthStateChange = (authenticated, user) => {
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      // Redirect to login or show auth modal
      navigate('/user-login?returnTo=' + encodeURIComponent(window.location?.pathname + window.location?.search));
      return;
    }
    setIsContactModalOpen(true);
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/user-login?returnTo=' + encodeURIComponent(window.location?.pathname + window.location?.search));
      return;
    }
    setIsWishlisted(!isWishlisted);
    // Here you would typically make an API call to update the wishlist
  };

  const handleReport = (reportData) => {
    console.log('Product reported:', reportData);
    // Here you would typically send the report to your backend
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onAuthStateChange={handleAuthStateChange}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          onAuthStateChange={handleAuthStateChange}
        />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/homepage')}>
              Back to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onAuthStateChange={handleAuthStateChange}
      />
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate('/homepage')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                Home
              </button>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <button
                onClick={() => navigate(`/search-results?category=${product?.category}`)}
                className="text-muted-foreground hover:text-foreground transition-smooth capitalize"
              >
                {product?.category}
              </button>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              <span className="text-foreground font-medium truncate">
                {product?.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2">
              <ImageGallery 
                images={product?.images} 
                productName={product?.title}
              />
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <ProductInfo
                product={product}
                onContactSeller={handleContactSeller}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isWishlisted}
                isAuthenticated={isAuthenticated}
              />

              <SellerInfo
                seller={product?.seller}
                onContactSeller={handleContactSeller}
              />

              {/* Report Button */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setIsReportModalOpen(true)}
                  iconName="Flag"
                  iconPosition="left"
                  className="text-error hover:text-error hover:bg-error/10 w-full justify-start"
                >
                  Report this listing
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {/* <div className="mt-16">
            <RelatedProducts
              products={mockProducts}
              currentProductId={product?.id}
            />
          </div> */}
        </div>
      </main>
      {/* Modals */}
      <ContactSellerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        seller={product?.seller}
        product={product}
        currentUser={currentUser}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        product={product}
        onReport={handleReport}
      />
    </div>
  );
};

export default ProductDetailsPage;