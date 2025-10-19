import React from 'react';
import { Shield, Check } from 'lucide-react';
import { ColumnConfig } from './UniversalDocumentsTable';
import { Document } from '../types';

// DocsDB Page Configuration - Full featured table
export const docsDBColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Title',
    sortable: true,
    render: (document, helpers) => (
      <div 
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
        role="button"
        tabIndex={0}
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
    ),
  },
  {
    id: 'type',
    label: 'Type',
    sortable: true,
    render: (document, helpers) => (
      <div className="flex items-center space-x-2">
        {helpers.getFileIcon(document.fileType)}
        <span className="text-sm text-gray-900 dark:text-white">
          {document.fileType.toUpperCase()}
        </span>
      </div>
    ),
  },
  {
    id: 'uploadedAt',
    label: 'Date',
    sortable: true,
    render: (document, helpers) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {helpers.formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document, helpers) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpers.getStatusColor(document.approvalStatus)}`}
        style={helpers.getStatusBackgroundColor(document.approvalStatus)}
      >
        {helpers.getStatusIcon(document.approvalStatus)}
        <span className="ml-1">{document.approvalStatus}</span>
      </span>
    ),
  },
  {
    id: 'securityLevel',
    label: 'Security',
    sortable: true,
    visible: true, // Will be controlled dynamically based on user role
    render: (document, helpers) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpers.getSecurityLevelColor(document.securityLevel)}`}
        style={document.securityLevel === 'Confidential' ? { backgroundColor: '#ffedec', color: '#d22927' } : {}}
      >
        <Shield className="w-3 h-3 mr-1" />
        <span className="capitalize">{document.securityLevel || 'Public'}</span>
      </span>
    ),
  },
  {
    id: 'approver',
    label: 'Approver',
    sortable: false,
    visible: true, // Will be controlled dynamically based on user role
    render: (document) => {
      if (!document.approver) {
        return <span className="text-sm text-gray-400 dark:text-gray-500">No approver assigned</span>;
      }
      return (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={document.approver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(document.approver.name)}&background=6366f1&color=fff&size=32`}
              alt={document.approver.name}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                fallback?.classList.remove('hidden');
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
      );
    },
  },
];

// Pending Approvals Page Configuration
export const pendingApprovalsColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Document',
    sortable: true,
    render: (document, helpers) => (
      <div className="flex items-center space-x-3">
        {helpers.getFileIcon(document.fileType)}
        <div>
          <div className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200 text-left">
            {document.title}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {document.fileType} • {document.fileSize}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'department',
    label: 'Subject',
    sortable: true,
    render: (document) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {document.department}
      </span>
    ),
  },
  {
    id: 'submittedForApproval',
    label: 'Submitted',
    sortable: true,
    render: (document) => (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(document.submittedForApproval || document.uploadedAt).toLocaleString()}
      </span>
    ),
  },
  {
    id: 'approver',
    label: 'Approver',
    sortable: false,
    render: (document) => {
      if (!document.approver) {
        return <span className="text-sm text-gray-500 dark:text-gray-400">No approver assigned</span>;
      }
      return (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={document.approver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(document.approver.name)}&background=6366f1&color=fff&size=32`}
              alt={document.approver.name}
              className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                fallback?.classList.remove('hidden');
              }}
            />
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400 border-2 border-white dark:border-gray-800 hidden">
              {document.approver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            {document.approver.approved && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
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
      );
    },
  },
];

// Folder View Configuration - Simpler table
export const folderViewColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Name',
    sortable: true,
    render: (document, helpers) => (
      <div className="flex items-center space-x-3">
        {helpers.getFileIcon(document.fileType)}
        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {document.title}
        </span>
        {document.securityLevel && document.securityLevel !== 'Public' && (
          <Shield className={`w-4 h-4 ml-2 ${
            document.securityLevel === 'Top Secret' 
              ? 'text-red-500 dark:text-red-400' 
              : 'text-amber-500 dark:text-amber-400'
          }`} />
        )}
      </div>
    ),
  },
  {
    id: 'type',
    label: 'Type',
    sortable: true,
    render: (document) => (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {document.fileType}
      </span>
    ),
  },
  {
    id: 'uploadedAt',
    label: 'Date',
    sortable: true,
    render: (document, helpers) => (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {helpers.formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document, helpers) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpers.getStatusColor(document.approvalStatus)}`}
        style={helpers.getStatusBackgroundColor(document.approvalStatus)}
      >
        {helpers.getStatusIcon(document.approvalStatus)}
        <span className="ml-1 capitalize">{document.approvalStatus}</span>
      </span>
    ),
  },
];

// ISO9000/ISO2/EDC Pages Configuration - When clicking on cards
export const isoCardDocumentsColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Document',
    sortable: true,
    render: (document, helpers) => (
      <div className="flex items-center space-x-3">
        {helpers.getFileIcon(document.fileType)}
        <div>
          <div className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200 text-left">
            {document.title}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {document.fileSize}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {document.fileType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'uploadedAt',
    label: 'Date',
    sortable: true,
    render: (document, helpers) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {helpers.formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document, helpers) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpers.getStatusColor(document.approvalStatus)}`}
        style={helpers.getStatusBackgroundColor(document.approvalStatus)}
      >
        {helpers.getStatusIcon(document.approvalStatus)}
        <span className="ml-1 capitalize">{document.approvalStatus}</span>
      </span>
    ),
  },
  {
    id: 'securityLevel',
    label: 'Security',
    sortable: true,
    render: (document, helpers) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${helpers.getSecurityLevelColor(document.securityLevel)}`}
        style={document.securityLevel === 'Confidential' ? { backgroundColor: '#ffedec', color: '#d22927' } : {}}
      >
        <Shield className="w-3 h-3 mr-1" />
        <span className="capitalize">{document.securityLevel || 'Public'}</span>
      </span>
    ),
  },
  {
    id: 'uploadedBy',
    label: 'Uploaded By',
    sortable: true,
    render: (document) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {document.uploadedBy}
      </span>
    ),
  },
];

// Helper function to filter columns based on user role
export const filterColumnsByRole = (columns: ColumnConfig[], userRole?: string): ColumnConfig[] => {
  return columns.map(column => {
    // Hide security and approver columns for non-managers/non-admins
    if ((column.id === 'securityLevel' || column.id === 'approver') && 
        userRole !== 'manager' && userRole !== 'admin') {
      return { ...column, visible: false };
    }
    return column;
  });
};

