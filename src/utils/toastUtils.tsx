import { toast, Flip, Bounce, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastOptions {
  position?:
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  theme?: "light" | "dark" | "colored";
  transition?: typeof Flip | typeof Bounce | typeof Zoom;
  className?: string;
  bodyClassName?: string;
  progressClassName?: string;
  icon?: React.ReactNode;
}

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
  transition: Bounce,
  className: "!rounded-xl !shadow-lg !p-4 !font-sans",
  bodyClassName: "!flex !items-center !gap-3 !text-sm !font-medium",
  progressClassName: "!h-1 !bg-opacity-50",
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
    className: `
      ${defaultOptions.className} 
      !bg-gradient-to-r !from-emerald-100 !to-green-100 
      !text-green-800 !border !border-green-200
      !shadow-green-100/50
    `,
    progressClassName: `${defaultOptions.progressClassName} !bg-green-500`,
    icon: (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultOptions,
    ...options,
    className: `
      ${defaultOptions.className} 
      !bg-gradient-to-r !from-rose-100 !to-red-100 
      !text-red-800 !border !border-red-200
      !shadow-red-100/50
    `,
    progressClassName: `${defaultOptions.progressClassName} !bg-red-500`,
    icon: (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  });
};

export const showLoadingToast = (message: React.ReactNode, options?: ToastOptions) => {
  return toast.loading(message, {
    ...defaultOptions,
    ...options,
    autoClose: false,
    closeButton: false,
    className: `
      ${defaultOptions.className} 
      !bg-gradient-to-r !from-blue-100 !to-indigo-100 
      !text-indigo-800 !border !border-indigo-200
      !shadow-indigo-100/50
    `,
    icon: (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-spin" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  });
};

export const updateToastToSuccess = (
  toastId: string | number,
  message: React.ReactNode,
  options?: ToastOptions
) => {
  toast.update(toastId, {
    render: message,
    type: "success",
    isLoading: false,
    ...defaultOptions,
    ...options,
    autoClose: options?.autoClose ?? 6000,
    className: `
      ${defaultOptions.className} 
      !bg-gradient-to-r !from-emerald-100 !to-green-100 
      !text-green-800 !border !border-green-200
      !shadow-green-100/50
    `,
    progressClassName: `${defaultOptions.progressClassName} !bg-green-500`,
    icon: (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  });
};

export const updateToastToError = (
  toastId: string | number,
  message: React.ReactNode,
  options?: ToastOptions
) => {
  toast.update(toastId, {
    render: message,
    type: "error",
    isLoading: false,
    ...defaultOptions,
    ...options,
    className: `
      ${defaultOptions.className} 
      !bg-gradient-to-r !from-rose-100 !to-red-100 
      !text-red-800 !border !border-red-200
      !shadow-red-100/50
    `,
    progressClassName: `${defaultOptions.progressClassName} !bg-red-500`,
    icon: (
      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    ),
  });
};