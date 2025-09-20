import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ContactPreferences = ({ preferences, onChange }) => {
  const handlePreferenceChange = (key, checked) => {
    onChange({
      ...preferences,
      [key]: checked
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">
          Contact Preferences
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose how buyers can contact you about this listing
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full flex-shrink-0">
            <Icon name="Mail" size={16} color="white" />
          </div>
          <div className="flex-1">
            <Checkbox
              label="Email notifications"
              description="Receive inquiries via your registered college email"
              checked={preferences?.email}
              onChange={(e) => handlePreferenceChange('email', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-success rounded-full flex-shrink-0">
            <Icon name="MessageCircle" size={16} color="white" />
          </div>
          <div className="flex-1">
            <Checkbox
              label="WhatsApp messages"
              description="Allow buyers to contact you via WhatsApp"
              checked={preferences?.whatsapp}
              onChange={(e) => handlePreferenceChange('whatsapp', e?.target?.checked)}
            />
          </div>
        </div>

        <div className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full flex-shrink-0">
            <Icon name="Phone" size={16} color="white" />
          </div>
          <div className="flex-1">
            <Checkbox
              label="Phone calls"
              description="Share your phone number with interested buyers"
              checked={preferences?.phone}
              onChange={(e) => handlePreferenceChange('phone', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div className="text-xs text-primary">
            <p className="font-medium">Privacy & Safety</p>
            <p>Your contact details are only shared with verified college students. You can change these preferences anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPreferences;