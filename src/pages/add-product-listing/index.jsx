import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ImageUploadSection from "./components/ImageUploadSection";
import ProductDescriptionEditor from "./components/ProductDescriptionEditor";
import CategorySelector from "./components/CategorySelector";
import PriceInput from "./components/PriceInput";
import ConditionSelector from "./components/ConditionSelector";
import ContactPreferences from "./components/ContactPreferences";
import ListingPreview from "./components/ListingPreview";
import { supabase } from "../../lib/supabase";

const AddProductListing = () => {
  const navigate = useNavigate();

  // Fake logged-in user (replace with real auth later)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: "1", // ⚠️ replace with UUID from Supabase auth.users
    name: "John Doe",
    email: "john.doe@iitism.ac.in",
    studentId: "STU123456",
    university: "IIT ISM Dhanbad",
  });

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    images: [],
    contactPreferences: {
      email: true,
      whatsapp: false,
      phone: false,
    },
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

  // Auto-save draft
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.title || formData.description) {
        localStorage.setItem("draft-listing", JSON.stringify(formData));
        setAutoSaveStatus("Draft saved");
        setTimeout(() => setAutoSaveStatus(""), 2000);
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  // Load draft
  useEffect(() => {
    const savedDraft = localStorage.getItem("draft-listing");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...draftData }));
        setIsDraft(true);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.condition) {
      newErrors.condition = "Please select item condition";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    if (!Object.values(formData.contactPreferences).some(Boolean)) {
      newErrors.contactPreferences = "Select at least one contact method";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.from("products").insert([
        {
          seller_id: currentUser.id, // must be valid UUID in your DB
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          condition: formData.condition,
          price: Number(formData.price),
          images: formData.images,
          contact_preferences: formData.contactPreferences,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      localStorage.removeItem("draft-listing");

      navigate("/homepage", {
        state: {
          message: "Your listing has been published successfully!",
          type: "success",
        },
      });
    } catch (err) {
      console.error("Error publishing:", err);
      setErrors({ submit: "Failed to publish listing. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem("draft-listing", JSON.stringify(formData));
    setIsDraft(true);
    setAutoSaveStatus("Draft saved manually");
    setTimeout(() => setAutoSaveStatus(""), 2000);
  };

  const handleClearDraft = () => {
    localStorage.removeItem("draft-listing");
    setFormData({
      title: "",
      category: "",
      price: "",
      condition: "",
      description: "",
      images: [],
      contactPreferences: { email: true, whatsapp: false, phone: false },
    });
    setIsDraft(false);
    setErrors({});
  };

  const handleAuthStateChange = (authenticated, user) => {
    setIsAuthenticated(authenticated);
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        onAuthStateChange={handleAuthStateChange}
      />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <button
                onClick={() => navigate("/homepage")}
                className="hover:text-foreground transition-smooth"
              >
                Home
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Add Product Listing</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Sell Your Item
                </h1>
                <p className="text-muted-foreground mt-2">
                  Create a detailed listing to reach fellow students on campus
                </p>
              </div>

              {autoSaveStatus && (
                <div className="flex items-center space-x-2 text-sm text-success">
                  <Icon name="Check" size={16} />
                  <span>{autoSaveStatus}</span>
                </div>
              )}
            </div>

            {isDraft && (
              <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon
                    name="FileText"
                    size={20}
                    className="text-accent mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-accent">
                      Draft Loaded
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your previous work has been restored. Continue editing or
                      start fresh.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearDraft}
                    iconName="X"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {errors.submit && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={20} className="text-error" />
                  <p className="text-error">{errors.submit}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Basic Information
                  </h2>

                  <div className="space-y-4">
                    <Input
                      label="Product Title"
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="e.g., iPhone 13 Pro Max 256GB Space Gray"
                      error={errors.title}
                      required
                      description="Be specific and descriptive (10+ characters)"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <CategorySelector
                        value={formData.category}
                        onChange={(value) =>
                          handleInputChange("category", value)
                        }
                        error={errors.category}
                      />

                      <ConditionSelector
                        value={formData.condition}
                        onChange={(value) =>
                          handleInputChange("condition", value)
                        }
                        error={errors.condition}
                      />
                    </div>

                    <PriceInput
                      value={formData.price}
                      onChange={(value) => handleInputChange("price", value)}
                      error={errors.price}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Product Images
                  </h2>
                  <ImageUploadSection
                    images={formData.images}
                    onImagesChange={(imgs) => handleInputChange("images", imgs)}
                    error={errors.images}
                  />
                </div>

                {/* Description */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Product Description
                  </h2>
                  <ProductDescriptionEditor
                    value={formData.description}
                    onChange={(val) => handleInputChange("description", val)}
                    error={errors.description}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-card rounded-lg border border-border p-6">
                  <ContactPreferences
                    preferences={formData.contactPreferences}
                    onChange={(prefs) =>
                      handleInputChange("contactPreferences", prefs)
                    }
                  />
                  {errors.contactPreferences && (
                    <p className="text-sm text-error mt-2">
                      {errors.contactPreferences}
                    </p>
                  )}
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">
                    Listing Actions
                  </h3>

                  <div className="space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setShowPreview(true)}
                      iconName="Eye"
                      iconPosition="left"
                      disabled={!formData.title && !formData.description}
                    >
                      Preview Listing
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      onClick={handleSaveDraft}
                      iconName="Save"
                      iconPosition="left"
                    >
                      Save as Draft
                    </Button>

                    <Button
                      type="submit"
                      variant="default"
                      fullWidth
                      loading={isLoading}
                      iconName="Upload"
                      iconPosition="left"
                    >
                      {isLoading ? "Publishing..." : "Publish Listing"}
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Icon
                      name="Info"
                      size={16}
                      className="text-primary mt-0.5"
                    />
                    <div className="text-xs text-primary">
                      <p className="font-medium mb-1">Listing Guidelines</p>
                      <ul className="space-y-1">
                        <li>• Only sell items you own</li>
                        <li>• No prohibited items</li>
                        <li>• Meet in safe public campus locations</li>
                        <li>• Be honest about condition</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Preview Modal */}
      <ListingPreview
        formData={formData}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default AddProductListing;
