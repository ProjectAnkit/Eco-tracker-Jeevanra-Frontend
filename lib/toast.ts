// lib/toast.ts
import { toast } from 'sonner';
const channel = new BroadcastChannel('toast-channel');

type ToastType = 'success' | 'error' | 'info' | 'warning';

const defaultOptions = {
  position: 'top-right' as const,
  duration: 6000,
  style: {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 1000,
  },
};

// Function to show toast in the current tab
const showInCurrentTab = (type: ToastType, message: string, options: any = {}) => {
  toast[type](message, {
    ...defaultOptions,
    ...options,
  });
};

// Export the main toast functions
export const showToast = (type: ToastType, message: string, options: any = {}) => {
  // Show in current tab
  showInCurrentTab(type, message, options);
  // Broadcast to other tabs
  channel.postMessage({ type, message, options });
};

// Listen for toast events from other tabs
if (typeof window !== 'undefined') {
  channel.onmessage = (event) => {
    const { type, message, options } = event.data;
    showInCurrentTab(type, message, options);
  };
}

// Helper functions
export const toastSuccess = (message: string, options: any = {}) => 
  showToast('success', message, options);
export const toastError = (message: string, options: any = {}) => 
  showToast('error', message, options);
export const toastInfo = (message: string, options: any = {}) => 
  showToast('info', message, options);
export const toastWarning = (message: string, options: any = {}) => 
  showToast('warning', message, options);