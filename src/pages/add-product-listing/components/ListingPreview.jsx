import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ListingPreview = ({ formData, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })?.format(price);
  };

  const getCategoryLabel = (categoryValue) => {
    const categories = {
      'textbooks': 'Textbooks & Study Materials',
      'electronics': 'Electronics & Gadgets',
      'cycles': 'Bicycles & Vehicles',
      'furniture': 'Furniture & Home',
      'clothing': 'Clothing & Fashion',
      'sports': 'Sports & Fitness',
      'kitchen': 'Kitchen & Appliances',
      'gaming': 'Gaming & Entertainment',
      'art': 'Art & Craft Supplies',
      'other': 'Other Items'
    };
    return categories?.[categoryValue] || categoryValue;
  };

  const getConditionLabel = (conditionValue) => {
    const conditions = {
      'new': 'Brand New',
      'like-new': 'Like New',
      'good': 'Good',
      'fair': 'Fair',
      'poor': 'Poor'
    };
    return conditions?.[conditionValue] || conditionValue;
  };

  const getConditionColor = (condition) => {
    const colors = {
      'new': 'text-success',
      'like-new': 'text-primary',
      'good': 'text-accent',
      'fair': 'text-warning',
      'poor': 'text-error'
    };
    return colors?.[condition] || 'text-muted-foreground';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-elevation-3 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Listing Preview
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              This is how your listing will appear to other students
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {/* Images */}
          {formData?.images && formData?.images?.length > 0 && (
            <div className="mb-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={formData?.images?.[0]?.url}
                  alt={formData?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {formData?.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData?.images?.slice(1, 5)?.map((image, index) => (
                    <div key={index} className="aspect-square bg-muted rounded overflow-hidden">
                      <Image
                        src={image?.url}
                        alt={`${formData?.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {formData?.images?.length > 5 && (
                    <div className="aspect-square bg-muted rounded flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        +{formData?.images?.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {formData?.title || 'Product Title'}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Icon name="Tag" size={14} />
                  <span>{getCategoryLabel(formData?.category)}</span>
                </span>
                <span className={`flex items-center space-x-1 ${getConditionColor(formData?.condition)}`}>
                  <Icon name="CheckCircle" size={14} />
                  <span>{getConditionLabel(formData?.condition)}</span>
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">
                {formatPrice(formData?.price || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Fixed price • Negotiable
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Description
              </h3>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {formData?.description ? (
                  <p className="whitespace-pre-wrap">{formData?.description}</p>
                ) : (
                  <p className="italic">No description provided</p>
                )}
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-muted rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Seller Information
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    IIT ISM Dhanbad • Verified Student
                  </p>
                </div>
              </div>
              
              {/* Contact Options */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-foreground">Contact Options:</p>
                <div className="flex flex-wrap gap-2">
                  {formData?.contactPreferences?.email && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-background rounded-full text-xs">
                      <Icon name="Mail" size={12} />
                      <span>Email</span>
                    </span>
                  )}
                  {formData?.contactPreferences?.whatsapp && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-background rounded-full text-xs">
                      <Icon name="MessageCircle" size={12} />
                      <span>WhatsApp</span>
                    </span>
                  )}
                  {formData?.contactPreferences?.phone && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-background rounded-full text-xs">
                      <Icon name="Phone" size={12} />
                      <span>Phone</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="primary"
                fullWidth
                iconName="MessageCircle"
                iconPosition="left"
              >
                Contact Seller
              </Button>
              <Button
                variant="outline"
                iconName="Heart"
                iconPosition="left"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPreview;