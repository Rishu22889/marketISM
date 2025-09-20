import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onWishlistToggle, isWishlisted = false }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product-details?id=${product?.id}`);
  };

  const handleWishlistClick = (e) => {
    e?.stopPropagation();
    onWishlistToggle(product?.id);
  };

  const handleContactSeller = (e) => {
    e?.stopPropagation();
    // Navigate to product details with contact focus
    navigate(`/product-details?id=${product?.id}&action=contact`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return postDate?.toLocaleDateString('en-IN');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'textbooks': 'bg-blue-100 text-blue-800',
      'electronics': 'bg-purple-100 text-purple-800',
      'furniture': 'bg-orange-100 text-orange-800',
      'clothing': 'bg-pink-100 text-pink-800',
      'sports': 'bg-green-100 text-green-800',
      'bikes': 'bg-emerald-100 text-emerald-800',
      'kitchen': 'bg-yellow-100 text-yellow-800',
      'gaming': 'bg-indigo-100 text-indigo-800',
      'art': 'bg-rose-100 text-rose-800'
    };
    return colors?.[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-card rounded-xl border border-border hover:shadow-elevation-2 transition-smooth cursor-pointer group overflow-hidden"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product?.images?.[0]}
          alt={product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={() => setImageLoading(false)}
        />
        
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <Icon name="Image" size={32} className="text-muted-foreground" />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-smooth shadow-elevation-1"
        >
          <Icon 
            name="Heart" 
            size={16} 
            className={isWishlisted ? 'text-error fill-current' : 'text-muted-foreground'} 
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product?.category)}`}>
            {product?.category?.charAt(0)?.toUpperCase() + product?.category?.slice(1)}
          </span>
        </div>

        {/* New Badge */}
        {product?.isNew && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-success text-success-foreground rounded-full text-xs font-medium">
              New
            </span>
          </div>
        )}
      </div>
      {/* Content Section */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-smooth">
            {product?.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Condition */}
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Package" size={14} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Condition: <span className="font-medium text-foreground">{product?.condition}</span>
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={12} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-foreground truncate block">
              {product?.seller?.name}
            </span>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {product?.seller?.location}
              </span>
            </div>
          </div>
          {product?.seller?.isVerified && (
            <Icon name="BadgeCheck" size={16} className="text-success" />
          )}
        </div>

        {/* Posted Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDate(product?.postedDate)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {product?.views} views
            </span>
          </div>
        </div>

        {/* Contact Button */}
        <Button
          onClick={handleContactSeller}
          variant="outline"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          fullWidth
          className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-smooth"
        >
          Contact Seller
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;