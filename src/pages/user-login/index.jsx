import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SecurityFeatures from './components/SecurityFeatures';
import LoginStats from './components/LoginStats';

const UserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect if user is already authenticated
    if (!loading && user) {
      navigate('/homepage');
    }
  }, [user, loading, navigate]);

  const handleLoginSuccess = (userData) => {
    // Auth context already handles the user state
    console.log('Login successful:', userData);
  };

  const handleLoadingChange = (loadingState) => {
    setIsLoading(loadingState);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is already authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <LoginHeader />
            
            <div className="bg-card rounded-lg shadow-elevation-2 p-6 sm:p-8">
              <LoginForm 
                onLoginSuccess={handleLoginSuccess}
                isLoading={isLoading}
                onLoadingChange={handleLoadingChange}
              />
              
              <SecurityFeatures />
            </div>
          </div>
        </div>

        {/* Right Side - Stats & Info (Desktop Only) */}
        <div className="hidden lg:flex lg:w-96 bg-muted/30 items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <LoginStats />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Section */}
      <div className="lg:hidden bg-muted/30 p-4">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-foreground">2,500+</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">1,200+</div>
              <div className="text-xs text-muted-foreground">Items</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">95%</div>
              <div className="text-xs text-muted-foreground">Success</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;