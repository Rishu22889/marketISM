import React, { useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const termsContent = `Last updated: September 20, 2025

Welcome to marketISM, the official campus marketplace for IIT (ISM) Dhanbad students. By creating an account and using our services, you agree to comply with and be bound by the following terms and conditions.

1. ELIGIBILITY AND ACCOUNT REGISTRATION
• You must be a current student of IIT (ISM) Dhanbad with a valid @iitism.ac.in email address
• You must be at least 18 years old to use this service
• You are responsible for maintaining the confidentiality of your account credentials
• You agree to provide accurate and complete information during registration
• One account per student - multiple accounts are prohibited

2. MARKETPLACE CONDUCT
• All items listed must be legal, safe, and appropriate for a campus environment
• Prohibited items include: weapons, illegal substances, counterfeit goods, adult content
• You must accurately describe items and provide honest condition assessments
• Pricing should be fair and reasonable for the campus community
• Respect other users and maintain professional communication

3. TRANSACTION RESPONSIBILITIES
• marketISM facilitates connections between buyers and sellers but is not party to transactions
• All transactions are conducted directly between users
• Users are responsible for payment processing, item delivery, and dispute resolution
• We recommend meeting in safe, public campus locations for exchanges
• Verify item condition before completing any transaction

4. CONTENT AND INTELLECTUAL PROPERTY
• You retain ownership of content you post but grant marketISM license to display it
• Do not post copyrighted material without permission
• marketISM reserves the right to remove inappropriate content
• Users are responsible for ensuring their listings comply with copyright laws

5. PRIVACY AND DATA PROTECTION
• We collect and use personal information as described in our Privacy Policy
• Your college email is used for verification and communication purposes
• We do not sell personal information to third parties
• You can request account deletion and data removal at any time

6. PLATFORM RULES AND ENFORCEMENT
• Users must follow community guidelines and campus policies
• Violations may result in warnings, account suspension, or permanent bans
• We reserve the right to investigate suspicious activities
• False reporting or abuse of the platform is prohibited

7. LIMITATION OF LIABILITY
• marketISM is provided "as is" without warranties of any kind
• We are not liable for transaction disputes, item quality, or user interactions
• Users participate at their own risk and discretion
• Our liability is limited to the maximum extent permitted by law

8. MODIFICATIONS AND TERMINATION
• We may update these terms with notice to users
• Continued use after changes constitutes acceptance
• We reserve the right to suspend or terminate accounts for violations
• Users may delete their accounts at any time

9. DISPUTE RESOLUTION
• Users should first attempt to resolve disputes directly
• Campus security or administration may be contacted for serious issues
• Legal disputes will be governed by Indian law and local jurisdiction

10. CONTACT INFORMATION
For questions about these terms, contact us at:
Email: support@marketism.iitism.ac.in
Campus Office: Student Activity Center, IIT (ISM) Dhanbad

By clicking "I Accept," you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-elevation-3 animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Terms of Service
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              marketISM Campus Marketplace Agreement
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
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-sm text-foreground leading-relaxed">
              {termsContent}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (onAccept) {
                onAccept();
              }
              onClose();
            }}
            iconName="Check"
            iconPosition="left"
          >
            I Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;