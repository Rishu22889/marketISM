import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RelatedProducts = ({ products, currentProductId }) => {
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

  // Filter out current product and limit to 4 items
  const relatedItems = products?.filter(product => product?.id !== currentProductId)?.slice(0, 4);

  if (relatedItems?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Related Items</h2>
        <Link
          to="/search-results"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
        >
          View All
        </Link>
      </div>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedItems?.map((product) => (
          <Link
            key={product?.id}
            to={`/product-details?id=${product?.id}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-all"
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <Image
                src={product?.images?.[0]}
                alt={product?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-3 space-y-2">
              <div className="flex items-center space-x-1">
                <Icon name={getCategoryIcon(product?.category)} size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground capitalize">{product?.category}</span>
              </div>
              
              <h3 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {product?.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">
                  {formatPrice(product?.price)}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product?.availability === 'available' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  {product?.availability === 'available' ? 'Available' : 'Reserved'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto">
        <div className="flex space-x-3 pb-2">
          {relatedItems?.map((product) => (
            <Link
              key={product?.id}
              to={`/product-details?id=${product?.id}`}
              className="flex-shrink-0 w-48 bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-2 transition-all"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <Image
                  src={product?.images?.[0]}
                  alt={product?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-3 space-y-2">
                <div className="flex items-center space-x-1">
                  <Icon name={getCategoryIcon(product?.category)} size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground capitalize">{product?.category}</span>
                </div>
                
                <h3 className="font-medium text-foreground text-sm line-clamp-2">
                  {product?.title}
                </h3>
                
                <div className="space-y-1">
                  <span className="font-semibold text-primary text-sm">
                    {formatPrice(product?.price)}
                  </span>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    product?.availability === 'available' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                  }`}>
                    {product?.availability === 'available' ? 'Available' : 'Reserved'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;