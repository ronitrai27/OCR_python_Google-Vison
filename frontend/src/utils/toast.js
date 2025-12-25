import toast from 'react-hot-toast';

// Custom styled toasts with consistent theme
export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#292929',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#fff',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#292929',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#292929',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Processing...',
        success: messages.success || 'Success!',
        error: messages.error || 'Something went wrong',
      },
      {
        position: 'top-right',
        style: {
          background: '#292929',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }
    );
  },

  info: (message) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#292929',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  welcome: (name) => {
    toast(`Welcome back, ${name}! 👋`, {
      duration: 4000,
      position: 'top-right',
      icon: '🎉',
      style: {
        background: '#292929',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
      },
    });
  },

  custom: (message, options = {}) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
      style: {
        background: '#292929',
        color: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        ...options.style,
      },
    });
  },
};

export default showToast;
