import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Edit, 
  Trash2, 
  Bell,
  FileText,
  Calendar,
  User,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Document, User as UserType } from '../types';
import { canEditDocument, canDeleteDocument } from '../utils/documentPermissions';

interface DocumentDetailPageProps {
  document: Document;
  user?: UserType | null;
  onBack: () => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onShare?: (document: Document) => void;
  onReminder?: (document: Document) => void;
}

export default function DocumentDetailPage({ 
  document, 
  user, 
  onBack, 
  onEdit, 
  onDelete, 
  onDownload, 
  onShare, 
  onReminder 
}: DocumentDetailPageProps) {
  const [showActions, setShowActions] = useState(false);

  const getFileIcon = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="w-8 h-8 text-green-500" />;
      default:
        return <FileText className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'pending':
        return 'text-white dark:text-white';
      case 'rejected':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getSecurityLevelColor = (level?: string) => {
    switch (level) {
      case 'Public':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Restricted':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Confidential':
        return 'text-white dark:text-white';
      case 'Top Secret':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(document);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(document);
    }
  };

  const handleReminder = () => {
    if (onReminder) {
      onReminder(document);
    }
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-6xl lg:px-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              className="glass-button-icon"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Document Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and manage document information
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handleDownload}
              className="glass-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.button>
            
            <motion.button
              onClick={handleShare}
              className="glass-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>

            {canEditDocument(document, user) && (
              <motion.button
                onClick={handleEdit}
                className="glass-button-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </motion.button>
            )}

            {canDeleteDocument(document, user) && (
              <motion.button
                onClick={handleDelete}
                className="glass-button-danger"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Document Content */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Document Header Card */}
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-start space-x-6">
            {/* Document Icon */}
            <div className="flex-shrink-0">
              <div className="flex justify-center items-center w-16 h-16 bg-gray-100 rounded-lg dark:bg-gray-800">
                {getFileIcon(document.fileType)}
              </div>
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {document.title}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Status */}
                <span 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.approvalStatus)}`}
                >
                  {getStatusIcon(document.approvalStatus)}
                  <span className="ml-2 capitalize">{document.approvalStatus}</span>
                </span>

                {/* Security Level */}
                <span 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSecurityLevelColor(document.securityLevel)}`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {document.securityLevel}
                </span>

                {/* File Type */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {document.fileType?.toUpperCase() || 'FILE'}
                </span>
              </div>

              {/* Document Path */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Department:</span>
                <span>{document.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="glass-panel rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">File Size:</span>
                <span className="text-sm text-gray-900 dark:text-white">{document.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Type:</span>
                <span className="text-sm text-gray-900 dark:text-white">{document.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploaded By:</span>
                <span className="text-sm text-gray-900 dark:text-white">{document.uploadedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Upload Date:</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(document.uploadedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Modified:</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatDateTime(document.lastModified)}</span>
              </div>
            </div>
          </div>

          {/* Approval Information */}
          <div className="glass-panel rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Approval Information
            </h3>
            <div className="space-y-3">
              {document.approver ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Approver:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{document.approver.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Title:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{document.approver.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{document.approver.email}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  No approver assigned
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {document.description && (
          <div className="glass-panel rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {document.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="glass-panel rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
