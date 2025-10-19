import React from 'react';
import { motion } from 'framer-motion';
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
  ArrowUpDown,
  Check
} from 'lucide-react';
import DropdownMenu from './DropdownMenu';
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
  formatDateTime: (dateString: string) => string;
  user?: UserType | null;
}

interface UniversalDocumentsTableProps {
  documents: Document[];
  columns: ColumnConfig[];
  user?: UserType | null;
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
      return 'text-green-600 dark:text-green-400';
    case 'pending':
      return 'text-white dark:text-white';
    case 'revision':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getStatusBackgroundColor = (status: string): React.CSSProperties => {
  switch (status) {
    case 'approved':
      return { backgroundColor: 'rgba(16, 185, 129, 0.1)' };
    case 'pending':
      return { backgroundColor: '#ffeefb', color: '#b64198' };
    case 'revision':
      return {};
    default:
      return {};
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
    formatDateTime,
    user,
  };

  const visibleColumns = columns.filter(col => col.visible !== false);

  return (
    <div className="glass-panel rounded-lg">
      <div className="overflow-x-auto lg:overflow-x-visible">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {showCheckbox && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
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
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
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
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {customActions ? (
                      customActions(document)
                    ) : (
                      <div className="flex items-center space-x-2">
                        {onView && (
                          <motion.button
                            onClick={(e) => onView(document, e)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`View ${document.title}`}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                        )}
                        {onEdit && (user?.role === 'manager' || user?.role === 'admin') && (
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
                        {getDropdownItems && (
                          <div className="relative">
                            <DropdownMenu
                              position="top-right"
                              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                              buttonClassName="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                              items={getDropdownItems(document)}
                            />
                          </div>
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

