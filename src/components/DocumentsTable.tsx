import React from 'react';
import { motion } from 'framer-motion';

// Helper function for security level background colors
const getSecurityLevelBackgroundColor = (level?: string): React.CSSProperties => {
  switch (level) {
    case 'Public':
      return { backgroundColor: 'rgb(77, 183, 72)', color: 'white' };
    case 'Restricted':
      return { backgroundColor: 'rgb(182, 65, 51)', color: 'white' };
    case 'Confidential':
      return { backgroundColor: 'rgb(210, 41, 39)', color: 'white' };
    case 'Top Secret':
      return { backgroundColor: 'rgb(210, 41, 39)', color: 'white' };
    case 'Highly Confidential':
      return { backgroundColor: 'rgb(210, 41, 39)', color: 'white' };
    default:
      return { backgroundColor: 'rgb(77, 183, 72)', color: 'white' };
  }
};
import {
  Eye,
  Edit,
  Shield,
  FileText,
  FileSpreadsheet,
  File,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import DropdownMenu from './DropdownMenu';
import { Document, User as UserType } from '../types';

interface DocumentsTableProps {
  documents: Document[];
  user?: UserType | null;
  selectedDocuments: Set<string>;
  hoveredRow: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onDocumentSelect: (documentId: string, selected: boolean) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSort: (field: string) => void;
  onDocumentClick: (document: Document) => void;
  onView: (document: Document, e: React.MouseEvent) => void;
  onEdit: (document: Document, e: React.MouseEvent) => void;
  onHoverChange: (documentId: string | null) => void;
  getDropdownItems: (document: Document) => any[];
}

// Utility functions
const getFileIcon = (fileType: string) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheet className="w-4 h-4 text-gray-500" />;
    case 'docx':
    case 'doc':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'image':
    case 'pptx':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'markdown':
    case 'md':
      return <FileText className="w-4 h-4 text-gray-500" />;
    case 'sql':
      return <FileText className="w-4 h-4 text-gray-500" />;
    default:
      return <File className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'text-white dark:text-white';
    case 'pending':
      return 'text-white dark:text-white';
    case 'revision':
      return 'text-white dark:text-white';
    case 'rejected':
      return 'text-white dark:text-white';
    default:
      return 'text-white dark:text-white';
  }
};

const getStatusBackgroundColor = (status: string): React.CSSProperties => {
  switch (status) {
    case 'approved':
      return { backgroundColor: 'rgb(77, 183, 72)', color: 'white' };
    case 'pending':
      return { backgroundColor: 'rgb(182, 65, 51)', color: 'white' };
    case 'revision':
      return { backgroundColor: 'rgb(182, 65, 51)', color: 'white' };
    case 'rejected':
      return { backgroundColor: 'rgb(210, 41, 39)', color: 'white' };
    default:
      return { backgroundColor: 'rgb(210, 41, 39)', color: 'white' };
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-3 h-3" />;
    case 'pending':
      return <Clock className="w-3 h-3" />;
    case 'revision':
      return <AlertCircle className="w-3 h-3" />;
    default:
      return <File className="w-3 h-3" />;
  }
};

const getSecurityLevelColor = (level?: string) => {
  switch (level) {
    case 'Public':
      return 'text-white dark:text-white';
    case 'Restricted':
      return 'text-white dark:text-white';
    case 'Confidential':
      return 'text-white dark:text-white';
    case 'Top Secret':
      return 'text-white dark:text-white';
    case 'Highly Confidential':
      return 'text-white dark:text-white';
    default:
      return 'text-white dark:text-white';
  }
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  user,
  selectedDocuments,
  hoveredRow,
  sortBy,
  sortOrder,
  onDocumentSelect,
  onSelectAll,
  onDeselectAll,
  onSort,
  onDocumentClick,
  onView,
  onEdit,
  onHoverChange,
  getDropdownItems,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
    }
    return <ArrowUpDown className="w-3 h-3 opacity-50" />;
  };

  return (
    <div className="glass-panel rounded-lg">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedDocuments.size === documents.length && documents.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectAll();
                    } else {
                      onDeselectAll();
                    }
                  }}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  aria-label="Select all documents"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => onSort('title')}
                  className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Sort by title"
                >
                  <span>Title</span>
                  {getSortIcon('title')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => onSort('type')}
                  className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Sort by type"
                >
                  <span>Type</span>
                  {getSortIcon('type')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => onSort('uploadedAt')}
                  className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Sort by date"
                >
                  <span>Date</span>
                  {getSortIcon('uploadedAt')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Sort by status"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              {/* Security column - Only visible to managers and admins */}
              {(user?.role === 'manager' || user?.role === 'admin') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => onSort('securityLevel')}
                    className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    aria-label="Sort by security level"
                  >
                    <span>Security</span>
                    {getSortIcon('securityLevel')}
                  </button>
                </th>
              )}
              {/* Approver column - Only visible to managers and admins */}
              {(user?.role === 'manager' || user?.role === 'admin') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span>Approver</span>
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((document) => (
              <motion.tr
                key={document.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                onMouseEnter={() => onHoverChange(document.id)}
                onMouseLeave={() => onHoverChange(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(document.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onDocumentSelect(document.id, e.target.checked);
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    aria-label={`Select ${document.title}`}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div 
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => onDocumentClick(document)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onDocumentClick(document);
                      }
                    }}
                    aria-label={`View ${document.title}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200 text-left">
                        {document.title}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {document.fileSize}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(document.fileType)}
                    <span className="text-sm text-gray-900 dark:text-white">
                      {document.fileType.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDateTime(document.uploadedAt.toISOString())}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}
                    style={getStatusBackgroundColor(document.approvalStatus)}
                  >
                    {getStatusIcon(document.approvalStatus)}
                    <span className="ml-1">{document.approvalStatus}</span>
                  </span>
                </td>
                {/* Security column - Only visible to managers and admins */}
                {(user?.role === 'manager' || user?.role === 'admin') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityLevelColor(document.securityLevel)}`}
                      style={getSecurityLevelBackgroundColor(document.securityLevel)}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      <span className="capitalize">{document.securityLevel || 'Public'}</span>
                    </span>
                  </td>
                )}
                {/* Approver column - Only visible to managers and admins */}
                {(user?.role === 'manager' || user?.role === 'admin') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {document.approver ? (
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={document.approver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(document.approver.name)}&background=6366f1&color=fff&size=32`}
                            alt={document.approver.name}
                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400 border-2 border-white dark:border-gray-800 hidden">
                            {document.approver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {document.approver.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {document.approver.title}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">No approver assigned</span>
                    )}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {hoveredRow === document.id && (
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={(e) => onView(document, e)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={`View ${document.title}`}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      {/* Edit button - Only for managers and admins */}
                      {(user?.role === 'manager' || user?.role === 'admin') && (
                        <motion.button
                          onClick={(e) => onEdit(document, e)}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={`Edit ${document.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      )}
                      <div className="relative">
                        <DropdownMenu
                          position="top-right"
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                          buttonClassName="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                          items={getDropdownItems(document)}
                        />
                      </div>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentsTable;

