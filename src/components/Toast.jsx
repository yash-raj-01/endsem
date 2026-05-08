import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} color="#10b981" />,
    error: <AlertCircle size={20} color="#ef4444" />,
    info: <Info size={20} color="#0ea5e9" />,
  };

  return (
    <div className="glass-card toast-notification" style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out forwards',
    }}>
      {icons[type]}
      <span style={{ flex: 1, fontSize: '0.9rem' }}>{message}</span>
      <button onClick={onClose} style={{ opacity: 0.5 }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
