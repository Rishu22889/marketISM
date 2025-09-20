import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ 
  product, 
  viewMode = 'grid', 
  isAuthenticated = false,
  onWishlistToggle,
  onContactSeller 
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);

  const handleWishlistClick = (e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/user-login?returnTo=' + encodeURIComponent(window.location?.pathname));
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    if (onWishlistToggle) {
      onWishlistToggle(product?.id, !isWishlisted);
    }
  };

  const handleContactClick = (e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      navigate('/user-login?returnTo=' + encodeURIComponent(window.location?.pathname));
      return;
    }
    
    if (onContactSeller) {
      onContactSeller(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/product-details?id=${product?.id}`);
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'text-success bg-success/10 border-success/20';
      case 'like-new': return 'text-primary bg-primary/10 border-primary/20';
      case 'good': return 'text-warning bg-warning/10 border-warning/20';
      case 'fair': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'poor': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    return posted?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex items-start space-x-4">
          {/* Image */}
          <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 overflow-hidden rounded-lg">
            <Image
              src={product?.images?.[0]}
              alt={product?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {product?.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product?.description}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xl font-bold text-primary">
                    ₹{product?.price?.toLocaleString('en-IN')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getConditionColor(product?.condition)}`}>
                    {product?.condition === 'like-new' ? 'Like New' : 
                     product?.condition?.charAt(0)?.toUpperCase() + product?.condition?.slice(1)}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    {product?.category}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{product?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{formatTimeAgo(product?.postedAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={14} />
                    <span>{product?.seller?.name}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWishlistClick}
                  className={isWishlisted ? 'text-error' : 'text-muted-foreground hover:text-error'}
                >
                  <Icon name={isWishlisted ? "Heart" : "Heart"} size={20} fill={isWishlisted ? "currentColor" : "none"} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleContactClick}
                  iconName="MessageCircle"
                  iconPosition="left"
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-smooth cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product?.images?.[0]}
          alt={product?.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-smooth ${
            isWishlisted 
              ? 'bg-error text-white' :'bg-white/80 backdrop-blur-sm text-muted-foreground hover:text-error hover:bg-white'
          }`}
        >
          <Icon 
            name="Heart" 
            size={16} 
            fill={isWishlisted ? "currentColor" : "none"} 
          />
        </button>

        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getConditionColor(product?.condition)}`}>
            {product?.condition === 'like-new' ? 'Like New' : 
             product?.condition?.charAt(0)?.toUpperCase() + product?.condition?.slice(1)}
          </span>
        </div>

        {/* Image Count */}
        {product?.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            <Icon name="Camera" size={12} className="inline mr-1" />
            {product?.images?.length}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1 flex-1">
            {product?.title}
          </h3>
          <span className="text-lg font-bold text-primary ml-2">
            ₹{product?.price?.toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product?.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
            {product?.category}
          </span>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Clock" size={12} />
            <span>{formatTimeAgo(product?.postedAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Icon name="User" size={12} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{product?.seller?.name}</p>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Icon name="MapPin" size={10} />
                <span>{product?.location}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleContactClick}
            iconName="MessageCircle"
            iconPosition="left"
          >
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;