import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ContactSellerModal = ({ isOpen, onClose, seller, product, currentUser }) => {
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('message');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Set default message
      setMessage(`Hi ${seller?.name},\n\nI'm interested in your ${product?.title} listed for ${formatPrice(product?.price)}. Is it still available?\n\nThanks!`);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, seller?.name, product?.title, product?.price]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const handleSendMessage = async () => {
    if (!message?.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful message send
      console.log('Message sent:', {
        to: seller?.id,
        from: currentUser?.id,
        product: product?.id,
        message: message?.trim(),
        method: contactMethod
      });

      onClose();
      // You could show a success toast here
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`Interested in: ${product?.title}`);
    const body = encodeURIComponent(message);
    window.open(`mailto:${seller?.email}?subject=${subject}&body=${body}`, '_blank');
    onClose();
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${seller?.whatsapp}?text=${text}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-lg shadow-elevation-3 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Contact Seller</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Get in touch with {seller?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Summary */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Package" size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{product?.title}</h3>
              <p className="text-sm text-muted-foreground">{formatPrice(product?.price)}</p>
            </div>
          </div>

          {/* Contact Method Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Choose contact method:</h3>
            
            <div className="grid gap-2">
              <button
                onClick={() => setContactMethod('message')}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-smooth ${
                  contactMethod === 'message' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="MessageCircle" size={20} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium">Send Message</div>
                  <div className="text-xs text-muted-foreground">Send via platform messaging</div>
                </div>
                {contactMethod === 'message' && (
                  <Icon name="CheckCircle" size={16} className="text-primary ml-auto" />
                )}
              </button>

              <button
                onClick={() => setContactMethod('email')}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-smooth ${
                  contactMethod === 'email' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <Icon name="Mail" size={20} className="text-primary" />
                <div className="text-left">
                  <div className="font-medium">Email</div>
                  <div className="text-xs text-muted-foreground">{seller?.email}</div>
                </div>
                {contactMethod === 'email' && (
                  <Icon name="CheckCircle" size={16} className="text-primary ml-auto" />
                )}
              </button>

              {seller?.whatsapp && (
                <button
                  onClick={() => setContactMethod('whatsapp')}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-smooth ${
                    contactMethod === 'whatsapp' ?'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon name="MessageSquare" size={20} className="text-primary" />
                  <div className="text-left">
                    <div className="font-medium">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">+{seller?.whatsapp}</div>
                  </div>
                  {contactMethod === 'whatsapp' && (
                    <Icon name="CheckCircle" size={16} className="text-primary ml-auto" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Your message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              placeholder="Type your message here..."
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
            />
            <div className="text-xs text-muted-foreground text-right">
              {message?.length}/500 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
            
            <Button
              onClick={
                contactMethod === 'message' 
                  ? handleSendMessage
                  : contactMethod === 'email'
                  ? handleEmailContact
                  : handleWhatsAppContact
              }
              loading={isLoading}
              disabled={!message?.trim()}
              fullWidth
              iconName={
                contactMethod === 'message' ?'Send'
                  : contactMethod === 'email' ?'Mail' :'MessageSquare'
              }
              iconPosition="left"
            >
              {contactMethod === 'message' ?'Send Message'
                : contactMethod === 'email' ?'Open Email' :'Open WhatsApp'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSellerModal;