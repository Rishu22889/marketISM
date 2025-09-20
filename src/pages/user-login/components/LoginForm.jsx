import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLoginSuccess, isLoading, onLoadingChange }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

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
    } else if (!formData?.email?.endsWith('@iitism.ac.in')) {
      newErrors.email = 'Please use your college email (@iitism.ac.in)';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onLoadingChange(true);

    try {
      const { data, error } = await signIn(formData?.email, formData?.password);

      if (error) {
        if (error?.message?.includes('Invalid login credentials')) {
          setErrors({ submit: 'Invalid email or password. Please check your credentials.' });
        } else if (error?.message?.includes('Email not confirmed')) {
          setErrors({ submit: 'Please check your email and verify your account before signing in.' });
        } else if (error?.message?.includes('Failed to fetch') || 
                   error?.message?.includes('AuthRetryableFetchError')) {
          setErrors({ submit: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' });
        } else {
          setErrors({ submit: error?.message });
        }
        return;
      }

      if (data?.user) {
        if (onLoginSuccess) {
          onLoginSuccess(data?.user);
        }

        // Navigate to homepage or intended destination
        const urlParams = new URLSearchParams(window.location.search);
        const returnTo = urlParams?.get('returnTo') || '/homepage';
        navigate(returnTo);
      }

    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {errors?.submit && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} className="mt-0.5 flex-shrink-0" />
            <span>{errors?.submit}</span>
          </div>
        </div>
      )}

      {/* Demo Credentials Section */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800 mb-2">Demo Credentials for Testing:</p>
            <div className="space-y-1 text-blue-700">
              <p><strong>Admin:</strong> admin@iitism.ac.in / admin123</p>
              <p><strong>Student:</strong> student@iitism.ac.in / password123</p>
              <p><strong>Student 2:</strong> john.doe@iitism.ac.in / password123</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Email Field */}
      <Input
        label="College Email"
        type="email"
        name="email"
        value={formData?.email}
        onChange={handleInputChange}
        placeholder="your.email@iitism.ac.in"
        description="Use your verified college email address"
        error={errors?.email}
        required
      />

      {/* Password Field */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData?.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          error={errors?.password}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
        </button>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
        />
        
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-smooth"
          onClick={() => {
            // Handle forgot password
            console.log('Forgot password clicked');
          }}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isLoading}
        fullWidth
        iconName="LogIn"
        iconPosition="left"
      >
        Sign In
      </Button>

      {/* Registration Link */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          New to Campus Marketplace?{' '}
          <Link
            to="/user-registration"
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;