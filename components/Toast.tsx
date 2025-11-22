import React, { useEffect, useState } from 'react';
import { CheckIcon, InfoIcon, ErrorIcon, WarningIcon } from './icons';

interface ToastProps {
  message?: string;
  type?: 'success' | 'info' | 'error' | 'warning';
  isVisible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', isVisible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 2800); // A little less than the parent timer to allow for fade-out
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  if (!message) return null;

  const typeInfo = {
    success: { icon: CheckIcon, styles: 'bg-green-500' },
    info: { icon: InfoIcon, styles: 'bg-blue-500' },
    error: { icon: ErrorIcon, styles: 'bg-red-500' },
    warning: { icon: WarningIcon, styles: 'bg-amber-500' },
  };
  
  const { icon: Icon, styles: bgColor } = typeInfo[type];

  return (
    <div
      className={`fixed top-5 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
