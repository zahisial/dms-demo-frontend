import React from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Edit,
  FileText,
  FileSpreadsheet,
  File,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Download,
  Share2,
  Trash2,
  Bell
} from 'lucide-react';
import { Document, User as UserType } from '../types';

// Column configuration interface
export interface ColumnConfig {
  id: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  render?: (document: Document, helpers: RenderHelpers) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  minWidth?: string;
}

interface RenderHelpers {
  getFileIcon: (fileType: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusBackgroundColor: (status: string) => React.CSSProperties;
  getSecurityLevelColor: (level?: string) => string;
  getSecurityLevelBackgroundColor: (level?: string) => React.CSSProperties;
  formatDateTime: (dateString: string) => string;
  user?: UserType | null;
  users?: UserType[];
}

interface UniversalDocumentsTableProps {
  documents: Document[];
  columns: ColumnConfig[];
  user?: UserType | null;
  users?: UserType[];
  selectedDocuments?: Set<string>;
  hoveredRow?: string | null;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  showCheckbox?: boolean;
  showActions?: boolean;
  onDocumentSelect?: (documentId: string, selected: boolean) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onSort?: (field: string) => void;
  onDocumentClick?: (document: Document) => void;
  onView?: (document: Document, e: React.MouseEvent) => void;
  onEdit?: (document: Document, e: React.MouseEvent) => void;
  onDownload?: (document: Document, e: React.MouseEvent) => void;
  onShare?: (document: Document, e: React.MouseEvent) => void;
  onDelete?: (document: Document, e: React.MouseEvent) => void;
  onReminder?: (document: Document, e: React.MouseEvent) => void;
  onHoverChange?: (documentId: string | null) => void;
  getDropdownItems?: (document: Document) => any[];
  customActions?: (document: Document) => React.ReactNode;
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

const UniversalDocumentsTable: React.FC<UniversalDocumentsTableProps> = ({
  documents,
  columns,
  user,
  users,
  selectedDocuments = new Set(),
  hoveredRow = null,
  sortBy = '',
  sortOrder = 'asc',
  showCheckbox = false,
  showActions = true,
  onDocumentSelect,
  onSelectAll,
  onDeselectAll,
  onSort,
  onDocumentClick,
  onView,
  onEdit,
  onDownload,
  onShare,
  onDelete,
  onReminder,
  onHoverChange,
  getDropdownItems,
  customActions,
}) => {
  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
    }
    return <ArrowUpDown className="w-3 h-3 opacity-50" />;
  };

  const helpers: RenderHelpers = {
    getFileIcon,
    getStatusIcon,
    getStatusColor,
    getStatusBackgroundColor,
    getSecurityLevelColor,
    getSecurityLevelBackgroundColor,
    formatDateTime,
    user,
    users,
  };

  const visibleColumns = columns.filter(col => col.visible !== false);

  return (
    <div className="rounded-lg glass-panel">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {showCheckbox && (
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.size === documents.length && documents.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                    className="rounded border-gray-300 shadow-sm dark:border-gray-600 text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    aria-label="Select all documents"
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={column.headerClassName || "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"}
                  style={column.minWidth ? { minWidth: column.minWidth } : undefined}
                >
                  {column.sortable !== false && onSort ? (
                    <button
                      onClick={() => onSort(column.id)}
                      className="flex items-center space-x-1 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label={`Sort by ${column.label}`}
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.id)}
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </th>
              ))}
              {showActions && (
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((document) => (
              <motion.tr
                key={document.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                onMouseEnter={() => onHoverChange?.(document.id)}
                onMouseLeave={() => onHoverChange?.(null)}
              >
                {showCheckbox && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.has(document.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        onDocumentSelect?.(document.id, e.target.checked);
                      }}
                      className="rounded border-gray-300 shadow-sm dark:border-gray-600 text-primary-600 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      aria-label={`Select ${document.title}`}
                    />
                  </td>
                )}
                {visibleColumns.map((column) => (
                  <td
                    key={column.id}
                    className={column.cellClassName || "px-6 py-4 whitespace-nowrap"}
                  >
                    {column.render ? column.render(document, helpers) : null}
                  </td>
                ))}
                {showActions && (
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {customActions ? (
                      customActions(document)
                    ) : (
                      <div className="flex items-center space-x-2">
                        {/* View - for all users */}
                        {onView && (
                          <motion.button
                            onClick={(e) => onView(document, e)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`View ${document.title}`}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        {/* Edit - for managers/admins */}
                        {onEdit && (user?.role === 'manager' || user?.role === 'admin') && (
                          <motion.button
                            onClick={(e) => onEdit(document, e)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Edit ${document.title}`}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        {/* Download - for all users if security is public */}
                        {onDownload && document.securityLevel === 'Public' && (
                          <motion.button
                            onClick={(e) => onDownload(document, e)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Download ${document.title}`}
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        {/* Share - for managers/admins if security is public */}
                        {onShare && (user?.role === 'manager' || user?.role === 'admin') && document.securityLevel === 'Public' && (
                          <motion.button
                            onClick={(e) => onShare(document, e)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Share ${document.title}`}
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        {/* Reminder - for admins only if status is pending */}
                        {onReminder && user?.role === 'admin' && document.approvalStatus === 'pending' && (
                          <motion.button
                            onClick={(e) => onReminder(document, e)}
                            className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Send reminder for ${document.title}`}
                            title="Send Reminder"
                          >
                            <Bell className="w-4 h-4" />
                          </motion.button>
                        )}
                        
                        {/* Delete - for admins only */}
                        {onDelete && user?.role === 'admin' && (
                          <motion.button
                            onClick={(e) => onDelete(document, e)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Delete ${document.title}`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    )}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UniversalDocumentsTable;

