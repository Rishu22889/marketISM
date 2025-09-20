import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    hostelLocation: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

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

    // Full name validation
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/?.test(formData?.password)) {
      newErrors.password = 'Password should contain uppercase, lowercase, or numbers';
    }

    // Confirm password validation
    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Student ID validation
    if (!formData?.studentId?.trim()) {
      newErrors.studentId = 'Student ID is required';
    }

    // Terms acceptance validation
    if (!formData?.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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
      const { data, error } = await signUp(
        formData?.email,
        formData?.password,
        {
          full_name: formData?.fullName,
          student_id: formData?.studentId,
          hostel_location: formData?.hostelLocation || null,
          role: 'student'
        }
      );

      if (error) {
        if (error?.message?.includes('User already registered')) {
          setErrors({ submit: 'An account with this email already exists. Please sign in instead.' });
        } else if (error?.message?.includes('Password should be at least 6 characters')) {
          setErrors({ submit: 'Password must be at least 6 characters long.' });
        } else if (error?.message?.includes('Failed to fetch') || 
                   error?.message?.includes('AuthRetryableFetchError')) {
          setErrors({ submit: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' });
        } else {
          setErrors({ submit: error?.message });
        }
        return;
      }

      if (data?.user) {
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            user: data?.user,
            email: formData?.email,
            fullName: formData?.fullName
          });
        }
      }

    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
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

      {/* Full Name */}
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

      {/* Email */}
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

      {/* Student ID */}
      <Input
        label="Student ID"
        type="text"
        name="studentId"
        value={formData?.studentId}
        onChange={handleInputChange}
        placeholder="e.g., IIT2021001"
        error={errors?.studentId}
        required
      />

      {/* Hostel Location */}
      <Input
        label="Hostel Location (Optional)"
        type="text"
        name="hostelLocation"
        value={formData?.hostelLocation}
        onChange={handleInputChange}
        placeholder="e.g., Hostel 5, Room 204"
        description="This helps with pickup/delivery arrangements"
      />

      {/* Password */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData?.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
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

      {/* Confirm Password */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          error={errors?.confirmPassword}
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-8 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
        </button>
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-2">
        <Checkbox
          label={
            <span className="text-sm text-muted-foreground">
              I accept the{' '}
              <button type="button" className="text-primary hover:text-primary/80 transition-smooth">
                Terms and Conditions
              </button>
              {' '}and{' '}
              <button type="button" className="text-primary hover:text-primary/80 transition-smooth">
                Privacy Policy
              </button>
            </span>
          }
          name="acceptTerms"
          checked={formData?.acceptTerms}
          onChange={handleInputChange}
          error={errors?.acceptTerms}
        />
        {errors?.acceptTerms && (
          <p className="text-sm text-error">{errors?.acceptTerms}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isLoading}
        fullWidth
        iconName="UserPlus"
        iconPosition="left"
      >
        Create Account
      </Button>

      {/* Login Link */}
      <div className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/user-login"
            className="text-primary hover:text-primary/80 font-medium transition-smooth"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;