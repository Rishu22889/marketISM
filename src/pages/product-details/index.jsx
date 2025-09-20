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

  // Mock product data
  const mockProducts = [
    {
      id: '1',
      title: 'MacBook Air M2 13-inch (2022) - Excellent Condition',
      price: 85000,
      originalPrice: 119900,
      category: 'electronics',
      condition: 'Like New',
      availability: 'available',
      description: `Selling my MacBook Air M2 in excellent condition. Used for only 6 months for college work.\n\nSpecifications:\n• Apple M2 chip with 8-core CPU and 8-core GPU\n• 8GB unified memory\n• 256GB SSD storage\n• 13.6-inch Liquid Retina display\n• 1080p FaceTime HD camera\n• MagSafe 3 charging port\n• Two Thunderbolt ports\n\nIncludes:\n• Original box and documentation\n• MagSafe 3 charger\n• USB-C to MagSafe 3 cable\n• Laptop sleeve (bonus)\n\nReason for selling: Upgrading to MacBook Pro for video editing needs.\n\nNo scratches, dents, or issues. Battery health is at 98%. Perfect for students or professionals.`,
      brand: 'Apple',
      model: 'MacBook Air M2',
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&h=800&fit=crop'
      ],
      tags: ['laptop', 'apple', 'macbook', 'student', 'programming'],
      listedDate: '2025-01-15T10:30:00Z',
      views: 247,
      location: 'IIT ISM Campus, Dhanbad',
      seller: {
        id: 'seller1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@iitism.ac.in',
        studentId: 'IIT2021001',
        university: 'IIT (ISM) Dhanbad',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        isVerified: true,
        rating: 4.8,
        reviewCount: 23,
        totalListings: 8,
        soldItems: 15,
        responseRate: 95,
        joinDate: '2021-08-15T00:00:00Z',
        whatsapp: '919876543210'
      }
    },
    {
      id: '2',
      title: 'Engineering Mathematics Textbook Set - 4 Books',
      price: 1200,
      originalPrice: 2800,
      category: 'textbooks',
      condition: 'Good',
      availability: 'available',
      description: `Complete set of Engineering Mathematics textbooks for first and second year students.\n\nIncludes:\n• Higher Engineering Mathematics by B.S. Grewal\n• Engineering Mathematics by N.P. Bali\n• Advanced Engineering Mathematics by Erwin Kreyszig\n• Differential Equations by Shepley L. Ross\n\nAll books are in good condition with minimal highlighting and notes. Perfect for engineering students.`,
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop'
      ],
      tags: ['textbooks', 'engineering', 'mathematics', 'study'],
      listedDate: '2025-01-18T14:20:00Z',
      views: 89,
      location: 'IIT ISM Campus, Dhanbad',
      seller: {
        id: 'seller2',
        name: 'Priya Patel',
        email: 'priya.patel@iitism.ac.in',
        studentId: 'IIT2020045',
        university: 'IIT (ISM) Dhanbad',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        isVerified: true,
        rating: 4.6,
        reviewCount: 12,
        totalListings: 5,
        soldItems: 8,
        responseRate: 88,
        joinDate: '2020-08-20T00:00:00Z',
        whatsapp: '919876543211'
      }
    },
    {
      id: '3',
      title: 'Gaming Chair - Ergonomic Design with RGB Lighting',
      price: 8500,
      originalPrice: 12000,
      category: 'furniture',
      condition: 'Good',
      availability: 'reserved',
      description: `High-quality gaming chair with ergonomic design and RGB lighting.\n\nFeatures:\n• Adjustable height and armrests\n• 360-degree swivel\n• RGB LED lighting\n• Premium PU leather\n• Lumbar support cushion\n• Headrest pillow\n\nUsed for 1 year, in good condition. Minor wear on armrests but fully functional.`,
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=800&fit=crop'
      ],
      tags: ['gaming', 'chair', 'furniture', 'rgb', 'ergonomic'],
      listedDate: '2025-01-16T09:15:00Z',
      views: 156,
      location: 'IIT ISM Campus, Dhanbad',
      seller: {
        id: 'seller3',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@iitism.ac.in',
        studentId: 'IIT2019078',
        university: 'IIT (ISM) Dhanbad',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
        isVerified: true,
        rating: 4.9,
        reviewCount: 31,
        totalListings: 12,
        soldItems: 22,
        responseRate: 97,
        joinDate: '2019-08-10T00:00:00Z',
        whatsapp: '919876543212'
      }
    }
  ];

  useEffect(() => {
    // Simulate loading and fetch product data
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const foundProduct = mockProducts?.find(p => p?.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          // Simulate checking if product is wishlisted
          setIsWishlisted(Math.random() > 0.5);
        } else {
          // Product not found, redirect to homepage
          navigate('/homepage');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/homepage');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
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
          <div className="mt-16">
            <RelatedProducts
              products={mockProducts}
              currentProductId={product?.id}
            />
          </div>
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