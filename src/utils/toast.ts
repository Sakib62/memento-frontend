import { toast, ToastOptions } from 'react-toastify';

const defaultToastConfig: ToastOptions = {
  position: 'top-center',
  closeOnClick: true,
  pauseOnHover: false,
};

export const showToast = (
  message: string,
  type: 'success' | 'error' | 'warning'
) => {
  let autoCloseDuration = 3000;
  let toastMethod = toast.success;

  if (type === 'error') {
    autoCloseDuration = 5000;
    toastMethod = toast.error;
  } else if (type === 'warning') {
    autoCloseDuration = 4000;
    toastMethod = toast.warn;
  }

  toastMethod(message, {
    ...defaultToastConfig,
    autoClose: autoCloseDuration,
  });
};
