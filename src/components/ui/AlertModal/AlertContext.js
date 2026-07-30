"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertModal from './AlertModal';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', 'error'
  });

  const showAlert = useCallback((message, type = 'info', title = null) => {
    // Default titles based on type if not provided
    let defaultTitle = 'Notification';
    if (type === 'success') defaultTitle = 'Success';
    if (type === 'error') defaultTitle = 'Error';
    if (type === 'warning') defaultTitle = 'Warning';

    setAlertState({
      isOpen: true,
      title: title || defaultTitle,
      message,
      type,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertModal 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
