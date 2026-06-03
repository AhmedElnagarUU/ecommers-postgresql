'use client';

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      gutter={12}
      containerStyle={{
        margin: '20px'
      }}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#1F2937', // Dark background
          color: '#fff', // White text
          border: '1px solid #374151', // Subtle border
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          fontSize: '14px',
          maxWidth: '400px',
        },
        success: {
          iconTheme: {
            primary: '#10B981', // Green
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444', // Red
            secondary: '#fff',
          },
        },
      }}
    />
  );
}; 