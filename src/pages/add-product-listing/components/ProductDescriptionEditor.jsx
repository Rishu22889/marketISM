import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductDescriptionEditor = ({ value, onChange, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const maxLength = 2000;
  const currentLength = value?.length || 0;

  const handleChange = (e) => {
    const newValue = e?.target?.value;
    if (newValue?.length <= maxLength) {
      onChange(newValue);
    }
  };

  const insertText = (beforeText, afterText = '') => {
    const textarea = document.getElementById('description-textarea');
    const start = textarea?.selectionStart;
    const end = textarea?.selectionEnd;
    const selectedText = value?.substring(start, end);
    const newText = value?.substring(0, start) + beforeText + selectedText + afterText + value?.substring(end);
    
    if (newText?.length <= maxLength) {
      onChange(newText);
      
      // Restore cursor position
      setTimeout(() => {
        textarea?.focus();
        textarea?.setSelectionRange(
          start + beforeText?.length,
          start + beforeText?.length + selectedText?.length
        );
      }, 0);
    }
  };

  const formatButtons = [
    {
      icon: 'Bold',
      action: () => insertText('**', '**'),
      tooltip: 'Bold'
    },
    {
      icon: 'Italic',
      action: () => insertText('*', '*'),
      tooltip: 'Italic'
    },
    {
      icon: 'List',
      action: () => insertText('\n• '),
      tooltip: 'Bullet List'
    },
    {
      icon: 'ListOrdered',
      action: () => insertText('\n1. '),
      tooltip: 'Numbered List'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Product Description
        <span className="text-error ml-1">*</span>
      </label>
      <div className={`border rounded-lg overflow-hidden transition-smooth ${
        error ? 'border-error' : isFocused ? 'border-primary' : 'border-border'
      }`}>
        {/* Formatting Toolbar */}
        <div className="flex items-center space-x-1 p-2 bg-muted border-b border-border">
          {formatButtons?.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button?.action}
              className="p-2 rounded hover:bg-background transition-smooth"
              title={button?.tooltip}
            >
              <Icon name={button?.icon} size={16} className="text-muted-foreground" />
            </button>
          ))}
          
          <div className="flex-1" />
          
          <span className={`text-xs font-mono ${
            currentLength > maxLength * 0.9 ? 'text-warning' : 'text-muted-foreground'
          }`}>
            {currentLength}/{maxLength}
          </span>
        </div>

        {/* Text Area */}
        <textarea
          id="description-textarea"
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Describe your product in detail. Include condition, usage history, any defects, and why you're selling it. Be honest and detailed to attract serious buyers."
          className="w-full p-4 bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none min-h-[200px]"
          rows={8}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 <strong>Tips for a great description:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Mention the exact condition and any wear/damage</li>
          <li>Include purchase date and usage frequency</li>
          <li>Specify what's included (accessories, manuals, etc.)</li>
          <li>Add reason for selling to build trust</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductDescriptionEditor;