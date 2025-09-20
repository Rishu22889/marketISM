import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link to="/homepage" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-smooth">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="ShoppingBag" size={24} color="white" />
        </div>
        <span className="text-2xl font-bold text-foreground">marketISM</span>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your campus marketplace account
        </p>
      </div>

      {/* College Badge */}
      <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
        <Icon name="GraduationCap" size={16} />
        <span>IIT (ISM) Dhanbad Students</span>
      </div>
    </div>
  );
};

export default LoginHeader;