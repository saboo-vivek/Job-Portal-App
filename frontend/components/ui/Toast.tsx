import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className: 'rounded-2xl border border-border bg-white/95 backdrop-blur-md shadow-xl text-neutral font-medium text-sm p-4',
        duration: 4000,
      }}
    />
  );
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },
};
