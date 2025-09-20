import React from 'react';
import Select from '../../../components/ui/Select';

const CategorySelector = ({ value, onChange, error }) => {
  const categories = [
    { 
      value: 'textbooks', 
      label: 'Textbooks & Study Materials',
      description: 'Academic books, notes, guides'
    },
    { 
      value: 'electronics', 
      label: 'Electronics & Gadgets',
      description: 'Phones, laptops, accessories'
    },
    { 
      value: 'cycles', 
      label: 'Bicycles & Vehicles',
      description: 'Bikes, scooters, parts'
    },
    { 
      value: 'furniture', 
      label: 'Furniture & Home',
      description: 'Chairs, tables, decor'
    },
    { 
      value: 'clothing', 
      label: 'Clothing & Fashion',
      description: 'Clothes, shoes, accessories'
    },
    { 
      value: 'sports', 
      label: 'Sports & Fitness',
      description: 'Equipment, gear, accessories'
    },
    { 
      value: 'kitchen', 
      label: 'Kitchen & Appliances',
      description: 'Cookware, appliances, utensils'
    },
    { 
      value: 'gaming', 
      label: 'Gaming & Entertainment',
      description: 'Games, consoles, accessories'
    },
    { 
      value: 'art', 
      label: 'Art & Craft Supplies',
      description: 'Drawing, painting, craft materials'
    },
    { 
      value: 'other', 
      label: 'Other Items',
      description: 'Miscellaneous products'
    }
  ];

  return (
    <Select
      label="Product Category"
      description="Choose the category that best describes your product"
      placeholder="Select a category..."
      options={categories}
      value={value}
      onChange={onChange}
      error={error}
      required
      searchable
    />
  );
};

export default CategorySelector;