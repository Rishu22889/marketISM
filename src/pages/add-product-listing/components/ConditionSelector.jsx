import React from 'react';
import Select from '../../../components/ui/Select';

const ConditionSelector = ({ value, onChange, error }) => {
  const conditions = [
    {
      value: 'new',
      label: 'Brand New',
      description: 'Never used, with original packaging'
    },
    {
      value: 'like-new',
      label: 'Like New',
      description: 'Barely used, excellent condition'
    },
    {
      value: 'good',
      label: 'Good',
      description: 'Used with minor signs of wear'
    },
    {
      value: 'fair',
      label: 'Fair',
      description: 'Used with noticeable wear but functional'
    },
    {
      value: 'poor',
      label: 'Poor',
      description: 'Heavy wear, may need repairs'
    }
  ];

  return (
    <Select
      label="Item Condition"
      description="Honestly describe the current condition of your item"
      placeholder="Select condition..."
      options={conditions}
      value={value}
      onChange={onChange}
      error={error}
      required
    />
  );
};

export default ConditionSelector;