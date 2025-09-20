import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ product, onContactSeller, onToggleWishlist, isWishlisted, isAuthenticated }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      textbooks: 'Book',
      electronics: 'Smartphone',
      furniture: 'Armchair',
      clothing: 'Shirt',
      sports: 'Dumbbell',
      kitchen: 'ChefHat',
      bikes: 'Bike',
      gaming: 'Gamepad2',
      art: 'Palette',
      other: 'Package'
    };
    return iconMap?.[category] || 'Package';
  };

  const getConditionColor = (condition) => {
    const colorMap = {
      'Like New': 'text-success',
      'Good': 'text-primary',
      'Fair': 'text-warning',
      'Poor': 'text-error'
    };
    return colorMap?.[condition] || 'text-muted-foreground';
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Check out this ${product?.category} for ${formatPrice(product?.price)}`,
          url: window.location?.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(window.location?.href);
      // You could show a toast notification here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Category Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            <Icon name={getCategoryIcon(product?.category)} size={14} />
            <span className="capitalize">{product?.category}</span>
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            product?.availability === 'available' ?'bg-success/10 text-success' 
              : product?.availability === 'reserved' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
          }`}>
            <Icon 
              name={product?.availability === 'available' ? 'CheckCircle' : product?.availability === 'reserved' ? 'Clock' : 'XCircle'} 
              size={12} 
              className="mr-1" 
            />
            {product?.availability === 'available' ? 'Available' : product?.availability === 'reserved' ? 'Reserved' : 'Sold'}
          </span>
        </div>

        {/* Title and Price */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {product?.title}
          </h1>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={16} />
            <span>Listed {new Date(product.listedDate)?.toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={16} />
            <span>{product?.views} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={16} />
            <span>{product?.location}</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onContactSeller}
          iconName="MessageCircle"
          iconPosition="left"
          className="flex-1"
          disabled={product?.availability === 'sold'}
        >
          Contact Seller
        </Button>
        
        {isAuthenticated && (
          <Button
            variant="outline"
            onClick={onToggleWishlist}
            iconName={isWishlisted ? "Heart" : "Heart"}
            iconPosition="left"
            className={isWishlisted ? "text-error border-error hover:bg-error/10" : ""}
          >
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={shareProduct}
          iconName="Share2"
          iconPosition="left"
        >
          Share
        </Button>
      </div>
      {/* Product Details */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Product Details</h2>
        
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <span className="text-sm text-muted-foreground">Condition</span>
            <p className={`font-medium ${getConditionColor(product?.condition)}`}>
              {product?.condition}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Category</span>
            <p className="font-medium capitalize">{product?.category}</p>
          </div>
          {product?.brand && (
            <div>
              <span className="text-sm text-muted-foreground">Brand</span>
              <p className="font-medium">{product?.brand}</p>
            </div>
          )}
          {product?.model && (
            <div>
              <span className="text-sm text-muted-foreground">Model</span>
              <p className="font-medium">{product?.model}</p>
            </div>
          )}
        </div>
      </div>
      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-wrap">
            {showFullDescription 
              ? product?.description 
              : product?.description?.length > 300 
                ? `${product?.description?.substring(0, 300)}...`
                : product?.description
            }
          </p>
          {product?.description?.length > 300 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-primary hover:text-primary/80 font-medium text-sm mt-2"
            >
              {showFullDescription ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
      {/* Tags */}
      {product?.tags && product?.tags?.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product?.tags?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;