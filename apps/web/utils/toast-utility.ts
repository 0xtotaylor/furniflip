import { toast, ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'custom' | 'promise';

interface ToastConfig {
  message: string;
  type?: ToastType;
  theme?: 'light' | 'dark';
  duration?: number;
}

interface PromiseToastConfig {
  promise: Promise<any>;
  messages: {
    loading: string;
    success: string;
    error: string;
  };
  theme?: 'light' | 'dark';
}

const defaultConfig: Partial<ToastConfig> = {
  type: 'custom',
  theme: 'light',
  duration: 5000
};

export const showToast = (config: ToastConfig | PromiseToastConfig) => {
  if ('promise' in config) {
    return showPromiseToast(config);
  }

  const { message, type, theme, duration } = { ...defaultConfig, ...config };

  const toastOptions: ToastOptions = {
    duration,
    style: {
      borderRadius: '10px',
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      textAlign: 'center',
      maxWidth: '500px',
      padding: '16px',
      lineHeight: '1.5'
    }
  };

  switch (type) {
    case 'success':
      return toast.success(message, toastOptions);
    case 'error':
      return toast.error(message, toastOptions);
    case 'loading':
      return toast.loading(message, toastOptions);
    default:
      return toast(message, toastOptions);
  }
};

const showPromiseToast = (config: PromiseToastConfig) => {
  const { promise, messages, theme } = config;

  const toastOptions: ToastOptions = {
    style: {
      borderRadius: '10px',
      background: theme === 'dark' ? '#333' : '#fff',
      color: theme === 'dark' ? '#fff' : '#333',
      textAlign: 'center',
      maxWidth: '500px',
      padding: '16px',
      lineHeight: '1.5'
    }
  };

  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error
    },
    toastOptions
  );
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
