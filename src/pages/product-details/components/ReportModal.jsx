import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportModal = ({ isOpen, onClose, product, onReport }) => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reportReasons = [
    {
      id: 'inappropriate',
      label: 'Inappropriate Content',
      description: 'Contains offensive or inappropriate material'
    },
    {
      id: 'misleading',
      label: 'Misleading Information',
      description: 'Product details are false or misleading'
    },
    {
      id: 'spam',
      label: 'Spam or Duplicate',
      description: 'This listing appears to be spam or a duplicate'
    },
    {
      id: 'prohibited',
      label: 'Prohibited Item',
      description: 'Item is not allowed on the platform'
    },
    {
      id: 'pricing',
      label: 'Suspicious Pricing',
      description: 'Price seems unrealistic or suspicious'
    },
    {
      id: 'other',
      label: 'Other',
      description: 'Other reason not listed above'
    }
  ];

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form
      setSelectedReasons([]);
      setAdditionalDetails('');
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleReasonChange = (reasonId, checked) => {
    if (checked) {
      setSelectedReasons(prev => [...prev, reasonId]);
    } else {
      setSelectedReasons(prev => prev?.filter(id => id !== reasonId));
    }
  };

  const handleSubmitReport = async () => {
    if (selectedReasons?.length === 0) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reportData = {
        productId: product?.id,
        reasons: selectedReasons,
        details: additionalDetails?.trim(),
        timestamp: new Date()?.toISOString()
      };

      if (onReport) {
        onReport(reportData);
      }

      console.log('Report submitted:', reportData);
      onClose();
      // You could show a success toast here
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="relative w-full max-w-md bg-card rounded-lg shadow-elevation-3 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Report Listing</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Help us keep the marketplace safe
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
          {/* Product Info */}
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{product?.title}</h3>
              <p className="text-sm text-muted-foreground">Reporting this listing</p>
            </div>
          </div>

          {/* Report Reasons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">
              What's wrong with this listing? <span className="text-error">*</span>
            </h3>
            
            <div className="space-y-2">
              {reportReasons?.map((reason) => (
                <div key={reason?.id} className="border border-border rounded-lg p-3">
                  <Checkbox
                    label={reason?.label}
                    description={reason?.description}
                    checked={selectedReasons?.includes(reason?.id)}
                    onChange={(e) => handleReasonChange(reason?.id, e?.target?.checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Additional details (optional)
            </label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e?.target?.value)}
              placeholder="Provide any additional information that might help us understand the issue..."
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
            />
            <div className="text-xs text-muted-foreground text-right">
              {additionalDetails?.length}/500 characters
            </div>
          </div>

          {/* Warning */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-warning">Important</p>
                <p className="text-muted-foreground mt-1">
                  False reports may result in restrictions on your account. Please only report listings that genuinely violate our community guidelines.
                </p>
              </div>
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
              variant="destructive"
              onClick={handleSubmitReport}
              loading={isLoading}
              disabled={selectedReasons?.length === 0}
              fullWidth
              iconName="Flag"
              iconPosition="left"
            >
              Submit Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;