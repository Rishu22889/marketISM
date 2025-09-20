import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import AuthenticationModal from './AuthenticationModal';
import UserAccountDropdown from './UserAccountDropdown';
import { useAuth } from '../auth';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, userProfile } = useAuth(); // Use Supabase auth

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const location = useLocation();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Mock search suggestions
  const mockSuggestions = [
    'Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Sports Equipment',
    'Kitchen Appliances', 'Study Materials', 'Bikes', 'Gaming', 'Art Supplies'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setIsSearchExpanded(false);
      }
      if (!event?.target?.closest('.mobile-menu') && !event?.target?.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    if (query?.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(query?.trim())}`);
      setShowSuggestions(false);
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    
    if (value?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      )?.slice(0, 5);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleAuthAction = () => {
    setIsMobileMenuOpen(false);
    if (user) {
      handleSignOut();
    } else {
      navigate('/user-login');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      navigate('/homepage');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const navigationItems = [
    { label: 'Browse', path: '/homepage', icon: 'Grid3X3' },
    { label: 'Sell Item', path: '/add-product-listing', icon: 'Plus', requiresAuth: true }
  ];

  const isActivePath = (path) => {
    if (path === '/homepage') {
      return location?.pathname === '/' || location?.pathname === '/homepage';
    }
    return location?.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/homepage" className="flex items-center space-x-2 hover:opacity-80 transition-smooth">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ShoppingBag" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">marketISM</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  } ${item?.requiresAuth && !user ? 'opacity-50' : ''}`}
                  onClick={(e) => {
                    if (item?.requiresAuth && !user) {
                      e?.preventDefault();
                      setIsAuthModalOpen(true);
                    }
                  }}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8" ref={searchRef}>
              <div className="relative w-full">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="search"
                    placeholder="Search marketplace..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery?.length > 0 && setShowSuggestions(true)}
                    className="pl-10 pr-4"
                  />
                  <Icon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
                  />
                </form>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions?.length > 0 && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation-2 z-50 animate-fade-in"
                  >
                    {searchSuggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg"
                      >
                        <Icon name="Search" size={14} className="inline mr-2 text-muted-foreground" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <UserAccountDropdown 
                  user={userProfile} 
                  onLogout={handleSignOut}
                />
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsAuthModalOpen(true)}
                  iconName="User"
                  iconPosition="left"
                >
                  Account
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden mobile-menu-button p-2 rounded-lg hover:bg-muted transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mobile-menu bg-card border-t border-border shadow-elevation-2 animate-slide-in">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    type="search"
                    placeholder="Search marketplace..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery?.length > 0 && setShowSuggestions(true)}
                    className="pl-10 pr-4"
                  />
                  <Icon 
                    name="Search" 
                    size={18} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" 
                  />
                </form>
                
                {/* Mobile Search Suggestions */}
                {showSuggestions && searchSuggestions?.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevation-2 z-50">
                    {searchSuggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth first:rounded-t-lg last:rounded-b-lg"
                      >
                        <Icon name="Search" size={14} className="inline mr-2 text-muted-foreground" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={(e) => {
                      if (item?.requiresAuth && !user) {
                        e?.preventDefault();
                        setIsAuthModalOpen(true);
                      } else {
                        setIsMobileMenuOpen(false);
                      }
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                      isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    } ${item?.requiresAuth && !user ? 'opacity-50' : ''}`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span>{item?.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} color="white" />
                      </div>
                      <span className="text-sm font-medium">{userProfile?.name || 'User'}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={handleSignOut}
                      iconName="LogOut"
                      iconPosition="left"
                      className="w-full justify-start"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleAuthAction}
                    iconName="User"
                    iconPosition="left"
                    className="w-full"
                  >
                    Sign In / Register
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Authentication Modal */}
      <AuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;