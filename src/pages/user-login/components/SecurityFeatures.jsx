import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityFeatures = () => {
  const features = [
    {
      icon: 'Shield',
      title: 'Secure Authentication',
      description: 'JWT-based security with encrypted data transmission'
    },
    {
      icon: 'Mail',
      title: 'College Email Verified',
      description: 'Only verified @iitism.ac.in accounts can access'
    },
    {
      icon: 'Users',
      title: 'Student Community',
      description: 'Connect with verified students from your campus'
    }
  ];

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="text-sm font-medium text-foreground mb-4 text-center">
        Why Choose Campus Marketplace?
      </h3>
      <div className="space-y-4">
        {features?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground">
                {feature?.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {feature?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityFeatures;