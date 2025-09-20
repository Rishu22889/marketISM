import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SellerInfo = ({ seller, onContactSeller }) => {
  const formatJoinDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={16} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Seller Information</h2>
      {/* Seller Profile */}
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted">
            {seller?.avatar ? (
              <Image
                src={seller?.avatar}
                alt={seller?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                <Icon name="User" size={24} />
              </div>
            )}
          </div>
          {seller?.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={14} color="white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-foreground truncate">{seller?.name}</h3>
            {seller?.isVerified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                <Icon name="Shield" size={12} className="mr-1" />
                Verified Student
              </span>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{seller?.university}</p>
          <p className="text-xs text-muted-foreground">
            Student ID: {seller?.studentId}
          </p>
          
          {/* Rating */}
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1">
              {renderStars(seller?.rating)}
            </div>
            <span className="text-sm font-medium">{seller?.rating?.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({seller?.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
      {/* Seller Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{seller?.totalListings}</div>
          <div className="text-xs text-muted-foreground">Total Listings</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{seller?.soldItems}</div>
          <div className="text-xs text-muted-foreground">Items Sold</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">{seller?.responseRate}%</div>
          <div className="text-xs text-muted-foreground">Response Rate</div>
        </div>
      </div>
      {/* Member Since */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Icon name="Calendar" size={16} />
        <span>Member since {formatJoinDate(seller?.joinDate)}</span>
      </div>
      {/* Contact Options */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Button
          onClick={onContactSeller}
          iconName="MessageCircle"
          iconPosition="left"
          fullWidth
        >
          Send Message
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(`mailto:${seller?.email}`, '_blank')}
            iconName="Mail"
            iconPosition="left"
            className="text-xs"
          >
            Email
          </Button>
          
          {seller?.whatsapp && (
            <Button
              variant="outline"
              onClick={() => window.open(`https://wa.me/${seller?.whatsapp}`, '_blank')}
              iconName="MessageSquare"
              iconPosition="left"
              className="text-xs"
            >
              WhatsApp
            </Button>
          )}
        </div>
      </div>
      {/* Safety Tips */}
      <div className="bg-muted/50 rounded-lg p-3 mt-4">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-foreground">Safety Tips</h4>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              <li>• Meet in public places on campus</li>
              <li>• Inspect items before payment</li>
              <li>• Use secure payment methods</li>
              <li>• Report suspicious activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;