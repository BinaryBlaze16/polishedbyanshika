import { toast } from 'react-hot-toast';

// Base styling for dark luxury theme
const toastOptions = {
  style: {
    background: '#1a1b33',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  }
};

export const showSuccess = (msg) => {
  toast.success(msg, {
    ...toastOptions,
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  });
};

export const showError = (msg) => {
  toast.error(msg, {
    ...toastOptions,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  });
};

export const showLoading = (msg) => {
  return toast.loading(msg, toastOptions);
};

export const showInfo = (msg) => {
  toast(msg, {
    ...toastOptions,
    icon: 'ℹ️',
  });
};

// Re-export toast instance if needed directly
export { toast };
