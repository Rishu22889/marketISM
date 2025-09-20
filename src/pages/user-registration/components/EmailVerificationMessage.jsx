import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmailVerificationMessage = ({ userEmail, onResendVerification }) => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendVerification = async () => {
    setIsResending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onResendVerification) {
        onResendVerification(userEmail);
      }
      
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      console.error('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Icon name="Mail" size={32} className="text-green-600" />
        </div>
      </div>

      {/* Main Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Check Your Email
        </h2>
        <p className="text-muted-foreground">
          We've sent a verification link to
        </p>
        <p className="text-foreground font-medium break-all">
          {userEmail}
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center">
          <Icon name="Info" size={16} className="mr-2" />
          Next Steps:
        </h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Check your email inbox (and spam folder)</li>
          <li>Click the verification link in the email</li>
          <li>Return to marketISM to start buying and selling</li>
        </ol>
      </div>

      {/* Verification Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
        <h3 className="font-medium text-yellow-900 mb-2 flex items-center">
          <Icon name="Lightbulb" size={16} className="mr-2" />
          Didn't receive the email?
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure you entered the correct email address</li>
          <li>• Wait a few minutes for the email to arrive</li>
          <li>• Contact support if you still don't receive it</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleResendVerification}
          loading={isResending}
          disabled={resendCooldown > 0}
          variant="outline"
          iconName="RefreshCw"
          iconPosition="left"
          fullWidth
        >
          {resendCooldown > 0 
            ? `Resend in ${resendCooldown}s` 
            : 'Resend Verification Email'
          }
        </Button>

        <Button
          onClick={() => navigate('/user-login')}
          variant="ghost"
          iconName="ArrowLeft"
          iconPosition="left"
          fullWidth
        >
          Back to Login
        </Button>
      </div>

      {/* Support Contact */}
      <div className="pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Having trouble? Contact us at{' '}
          <a 
            href="mailto:support@marketism.iitism.ac.in" 
            className="text-primary hover:text-primary/80 transition-smooth"
          >
            support@marketism.iitism.ac.in
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationMessage;