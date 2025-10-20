import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, X } from 'lucide-react';

interface PermissionDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  assignedTo?: string;
  action: 'edit' | 'delete' | 'mark-status';
}

export default function PermissionDeniedModal({ 
  isOpen, 
  onClose, 
  documentTitle, 
  assignedTo,
  action 
}: PermissionDeniedModalProps) {
  const getActionText = () => {
    switch (action) {
      case 'edit':
        return 'edit';
      case 'delete':
        return 'delete';
      case 'mark-status':
        return 'change the status of';
      default:
        return 'modify';
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case 'edit':
        return <AlertTriangle className="w-8 h-8 text-orange-500" />;
      case 'delete':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'mark-status':
        return <AlertTriangle className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                  <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Permission Denied
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Access restricted
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {getActionIcon()}
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You cannot {getActionText()} <strong>"{documentTitle}"</strong> because it is assigned to another user.
                  </p>
                  
                  {assignedTo && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Currently assigned to:
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {assignedTo}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Security Notice:</strong> Document access is restricted to assigned users only. 
                      Contact your administrator if you need access to this document.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Understood
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
