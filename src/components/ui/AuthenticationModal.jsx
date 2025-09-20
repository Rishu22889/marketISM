import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import { Checkbox } from './Checkbox';

const AuthenticationModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: '',
    university: '',
    agreeToTerms: false,
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset form when modal opens
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        studentId: '',
        university: '',
        agreeToTerms: false,
        rememberMe: false
      });
      setErrors({});
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration-specific validation
    if (!isLogin) {
      if (!formData?.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData?.studentId) {
        newErrors.studentId = 'Student ID is required';
      }

      if (!formData?.university) {
        newErrors.university = 'University is required';
      }

      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData?.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful authentication
      const mockUser = {
        id: '1',
        name: formData?.fullName || 'John Doe',
        email: formData?.email,
        studentId: formData?.studentId || 'STU123456',
        university: formData?.university || 'Sample University',
        avatar: null
      };

      if (onAuthSuccess) {
        onAuthSuccess(mockUser);
      }

      // Navigate based on context
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams?.get('returnTo');
      if (returnTo) {
        navigate(returnTo);
      }

    } catch (error) {
      setErrors({ submit: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(prev => ({
      ...prev,
      confirmPassword: '',
      fullName: '',
      studentId: '',
      university: '',
      agreeToTerms: false
    }));
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
            <h2 className="text-xl font-semibold text-foreground">
              {isLogin ? 'Welcome Back' : 'Join marketISM'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin 
                ? 'Sign in to your campus marketplace account' :'Create your student marketplace account'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors?.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {errors?.submit}
            </div>
          )}

          {/* Registration Fields */}
          {!isLogin && (
            <>
              <Input
                label="Full Name"
                type="text"
                name="fullName"
                value={formData?.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                error={errors?.fullName}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Student ID"
                  type="text"
                  name="studentId"
                  value={formData?.studentId}
                  onChange={handleInputChange}
                  placeholder="STU123456"
                  error={errors?.studentId}
                  required
                />

                <Input
                  label="University"
                  type="text"
                  name="university"
                  value={formData?.university}
                  onChange={handleInputChange}
                  placeholder="Your university"
                  error={errors?.university}
                  required
                />
              </div>
            </>
          )}

          {/* Common Fields */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            placeholder="your.email@university.edu"
            error={errors?.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData?.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors?.password}
            required
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              error={errors?.confirmPassword}
              required
            />
          )}

          {/* Checkboxes */}
          <div className="space-y-3">
            {isLogin ? (
              <Checkbox
                label="Remember me"
                name="rememberMe"
                checked={formData?.rememberMe}
                onChange={handleInputChange}
              />
            ) : (
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                name="agreeToTerms"
                checked={formData?.agreeToTerms}
                onChange={handleInputChange}
                error={errors?.agreeToTerms}
                required
              />
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            className="mt-6"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>

          {/* Forgot Password (Login only) */}
          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 transition-smooth"
                onClick={() => {
                  // Handle forgot password
                  console.log('Forgot password clicked');
                }}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={switchMode}
              className="ml-1 text-primary hover:text-primary/80 font-medium transition-smooth"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;