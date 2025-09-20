import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageUploadSection = ({ images, onImagesChange, error }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleChange = (e) => {
    e?.preventDefault();
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray?.filter(file => {
      const isValidType = file?.type?.startsWith('image/');
      const isValidSize = file?.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles?.length > 0) {
      const newImages = validFiles?.map((file, index) => ({
        id: Date.now() + index,
        file,
        url: URL.createObjectURL(file),
        name: file?.name
      }));

      const updatedImages = [...images, ...newImages]?.slice(0, 8); // Max 8 images
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (imageId) => {
    const updatedImages = images?.filter(img => img?.id !== imageId);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages?.splice(fromIndex, 1);
    updatedImages?.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  const onButtonClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">
          Product Images
          <span className="text-error ml-1">*</span>
        </label>
        <span className="text-xs text-muted-foreground">
          {images?.length}/8 images
        </span>
      </div>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-smooth ${
          dragActive
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-error bg-error/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Upload" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            Upload product images
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Drag and drop your images here, or click to browse
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onButtonClick}
            iconName="Plus"
            iconPosition="left"
          >
            Add Images
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            PNG, JPG, JPEG up to 5MB each. Maximum 8 images.
          </p>
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {/* Image Preview Grid */}
      {images?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images?.map((image, index) => (
            <div
              key={image?.id}
              className="relative group bg-muted rounded-lg overflow-hidden aspect-square"
            >
              <Image
                src={image?.url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Image Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center space-x-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-smooth"
                  >
                    <Icon name="ChevronLeft" size={16} color="white" />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={() => removeImage(image?.id)}
                  className="p-1 bg-error/80 rounded-full hover:bg-error transition-smooth"
                >
                  <Icon name="Trash2" size={16} color="white" />
                </button>
                
                {index < images?.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-smooth"
                  >
                    <Icon name="ChevronRight" size={16} color="white" />
                  </button>
                )}
              </div>

              {/* Primary Image Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;