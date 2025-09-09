"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import Toast from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    duration?: number;
  }>({
    message: '',
    isVisible: false,
    duration: 3000,
  });

  const showToast = (message: string, duration = 3000) => {
    setToast({
      message,
      isVisible: true,
      duration,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
}
