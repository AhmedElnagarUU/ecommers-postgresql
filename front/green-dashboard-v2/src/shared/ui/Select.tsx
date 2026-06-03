'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export function Select({ 
  label, 
  options, 
  error, 
  className = '', 
  ...props 
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-mintlify-text">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full px-4 py-2 bg-mintlify-hover/30 text-mintlify-text rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-mintlify-accent/50
          appearance-none cursor-pointer
          [&>option]:bg-mintlify-select [&>option]:text-mintlify-text
          [&>option]:py-2 [&>option]:px-4
          [&>option:hover]:bg-mintlify-option-hover
          [&>option:checked]:bg-mintlify-accent/10
          [&>option:checked]:text-mintlify-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-2 border-red-500' : ''}
          ${className}
        `}
      >
        {options.map(({ value, label }) => (
          <option
            key={value}
            value={value}
            className="py-2 px-4 hover:bg-mintlify-option-hover"
          >
            {label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
} 