import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  documentTitle: string;
  isDeleting?: boolean;
}


export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  documentTitle,
  isDeleting = false
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="flex fixed inset-0 z-50 justify-center items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative mx-4 w-full max-w-md bg-white rounded-2xl shadow-2xl dark:bg-gray-800"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center w-12 h-12 bg-red-100 rounded-full dark:bg-red-900/30">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Document
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                disabled={isDeleting}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="flex-shrink-0 mt-1 w-8 h-8 text-red-500" />
                <div className="flex-1">
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete <strong>"{documentTitle}"</strong>?
                  </p>
                  
                  <div className="p-4 mb-4 bg-red-50 rounded-lg dark:bg-red-900/20">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Warning:</strong> This action will permanently delete the document and cannot be undone. 
                      All associated data, comments, and version history will be lost.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Alternative:</strong> Consider archiving the document instead of deleting it, 
                      or contact your administrator if you're unsure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 space-x-3 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                onClick={onClose}
                disabled={isDeleting}
                className="px-6 py-2 font-medium text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex items-center px-6 py-2 space-x-2 font-medium text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Document</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
