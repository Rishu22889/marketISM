import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import EmailVerificationMessage from './components/EmailVerificationMessage';
import TermsModal from './components/TermsModal';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const UserRegistration = () => {
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form' | 'verification'
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleRegistrationSuccess = (user) => {
    setRegisteredUser(user);
    setRegistrationStep('verification');
  };

  const handleResendVerification = (email) => {
    console.log('Resending verification email to:', email);
    // In a real app, this would trigger an API call
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ShoppingBag" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">marketISM</span>
            </Link>
            
            <nav className="flex items-center space-x-4">
              <Link
                to="/user-login"
                className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
              >
                Already have an account?
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Side - Branding & Info */}
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Join the Campus Marketplace
                </h1>
                <p className="text-lg text-muted-foreground">
                  Connect with fellow IIT (ISM) students to buy and sell textbooks, electronics, furniture, and more in a trusted campus community.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Shield" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Verified Students Only</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure marketplace limited to verified @iitism.ac.in email addresses
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Users" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Campus Community</h3>
                    <p className="text-sm text-muted-foreground">
                      Buy and sell within your trusted campus network
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Zap" size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Quick & Easy</h3>
                    <p className="text-sm text-muted-foreground">
                      List items in minutes and connect with buyers instantly
                    </p>
                  </div>
                </div>
              </div>

              {/* Campus Image */}
              <div className="hidden lg:block">
                <div className="relative rounded-lg overflow-hidden shadow-elevation-2">
                  <Image
                    src="https://www.iitism.ac.in/images/iitism_banner_new.gif?w=600&h=400&fit=crop"
                    alt="IIT ISM Campus"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    {/* <p className="text-sm font-medium">IIT (ISM) Dhanbad Campus</p>
                    <p className="text-xs opacity-90">Your trusted marketplace community</p> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="bg-card rounded-lg shadow-elevation-2 p-6 lg:p-8">
                {registrationStep === 'form' ? (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold text-foreground">
                        Create Your Account
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2">
                        Join thousands of students already using marketISM
                      </p>
                    </div>

                    <RegistrationForm onRegistrationSuccess={handleRegistrationSuccess} />
                  </>
                ) : (
                  <EmailVerificationMessage 
                    userEmail={registeredUser?.email}
                    onResendVerification={handleResendVerification}
                  />
                )}
              </div>

              {/* Additional Info */}
              {registrationStep === 'form' && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    By registering, you agree to our{' '}
                    <button
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-primary hover:text-primary/80 transition-smooth"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-primary hover:text-primary/80 transition-smooth"
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Icon name="ShoppingBag" size={14} color="white" />
              </div>
              <span className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} marketISM - IIT (ISM) Dhanbad
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="hover:text-foreground transition-smooth"
              >
                Terms
              </button>
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="hover:text-foreground transition-smooth"
              >
                Privacy
              </button>
              <a
                href="mailto:support@marketism.iitism.ac.in"
                className="hover:text-foreground transition-smooth"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => {
          console.log('Terms accepted');
        }}
      />
    </div>
  );
};

export default UserRegistration;