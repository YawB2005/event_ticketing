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
    isConfirm: false,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
  });

  const showAlert = useCallback((message, type = 'info', title = null) => {
    let defaultTitle = 'Notification';
    if (type === 'success') defaultTitle = 'Success';
    if (type === 'error') defaultTitle = 'Error';
    if (type === 'warning') defaultTitle = 'Warning';

    setAlertState({
      isOpen: true,
      title: title || defaultTitle,
      message,
      type,
      isConfirm: false,
      onConfirm: null
    });
  }, []);

  const showConfirm = useCallback(({ 
    title = 'Confirm Action', 
    message = 'Are you sure you want to proceed?', 
    confirmText = 'Log Out', 
    cancelText = 'Cancel', 
    type = 'warning',
    onConfirm 
  }) => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
      isConfirm: true,
      confirmText,
      cancelText,
      onConfirm
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm, hideAlert }}>
      {children}
      <AlertModal 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        isConfirm={alertState.isConfirm}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
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
