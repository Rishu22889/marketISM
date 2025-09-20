import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import UserLogin from './pages/user-login';
import SearchResults from './pages/search-results';
import ProductDetailsPage from './pages/product-details';
import UserRegistration from './pages/user-registration';
import AddProductListing from './pages/add-product-listing';
import Homepage from './pages/homepage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AddProductListing />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/product-details" element={<ProductDetailsPage />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/add-product-listing" element={<AddProductListing />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
