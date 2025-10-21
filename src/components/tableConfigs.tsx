import React from 'react';
import { Shield, Check } from 'lucide-react';
import { ColumnConfig } from './UniversalDocumentsTable';
import { Document } from '../types';
import { calculateDaysDelayed } from '../utils/documentPermissions';

// DocsDB Page Configuration - Full featured table
export const docsDBColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Title',
    sortable: true,
    render: (document, helpers) => (
      <div 
        className="p-2 -m-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        role="button"
        tabIndex={0}
        aria-label={`View ${document.title}`}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-left transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
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
        style={helpers.getSecurityLevelBackgroundColor(document.securityLevel)}
      >
        <Shield className="mr-1 w-3 h-3" />
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
            <div className="flex hidden justify-center items-center w-8 h-8 text-xs font-medium rounded-full border-2 border-white bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 dark:border-gray-800">
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
          <div className="text-sm font-medium text-left transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
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
    id: 'approvalStatus',
    label: 'Status',
    sortable: true,
    render: (document, helpers) => {
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
            return <Check className="w-3 h-3" />;
          case 'pending':
            return <Shield className="w-3 h-3" />;
          case 'rejected':
            return <Shield className="w-3 h-3" />;
          case 'revision':
            return <Shield className="w-3 h-3" />;
          default:
            return <Shield className="w-3 h-3" />;
        }
      };

      return (
        <span 
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
          style={getStatusBackgroundColor(document.approvalStatus)}
        >
          {getStatusIcon(document.approvalStatus)}
          <span className="ml-1 capitalize">{document.approvalStatus}</span>
        </span>
      );
    },
  },
  {
    id: 'daysDelayed',
    label: 'Days Delayed',
    sortable: true,
    render: (document) => {
      const daysDelayed = calculateDaysDelayed(document.assignedDate);
      return (
        <span className={`text-sm font-medium ${
          daysDelayed > 7 
            ? 'text-red-600 dark:text-red-400' 
            : daysDelayed > 3 
            ? 'text-orange-600 dark:text-orange-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {daysDelayed} days
        </span>
      );
    },
  },
  {
    id: 'assignedTo',
    label: 'Assigned To',
    sortable: true,
    render: (document, helpers) => {
      if (!document.assignedTo) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      
      const assignedUser = helpers.users?.find(user => user.id === document.assignedTo);
      if (!assignedUser) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unknown User
          </span>
        );
      }
      
      return (
        <div className="flex items-center space-x-2">
          <div className="flex justify-center items-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {assignedUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {assignedUser.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {assignedUser.role}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: 'securityLevel',
    label: 'Security Level',
    sortable: true,
    render: (document, helpers) => {
      if (!document.securityLevel) {
        return <span className="text-sm text-gray-400 dark:text-gray-500">Public</span>;
      }
      
      return (
        <span 
          className="px-2 py-1 text-xs font-medium text-white rounded-full"
          style={helpers.getSecurityLevelBackgroundColor(document.securityLevel)}
        >
          {document.securityLevel}
        </span>
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
        <span className="text-sm font-medium text-gray-900 truncate dark:text-white">
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

// ISO9000/ISO2/EDC Pages Configuration - When clicking on cards (with Subject)
export const isoCardDocumentsColumnsWithSubject: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Document',
    sortable: true,
    render: (document, helpers) => (
      <div className="flex items-center space-x-3">
        {helpers.getFileIcon(document.fileType)}
        <div>
          <div className="text-sm font-medium text-left transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
            {document.title}
          </div>
          <div className="flex items-center mt-1 space-x-2">
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
    id: 'assignedTo',
    label: 'Assigned To',
    sortable: true,
    render: (document, helpers) => {
      if (!document.assignedTo) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      const assignedUser = helpers.users?.find(u => u.id === document.assignedTo);
      if (!assignedUser) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unknown User
          </span>
        );
      }
      return (
        <div className="flex items-center space-x-2">
          <div className="flex justify-center items-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {assignedUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {assignedUser.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {assignedUser.role}
            </div>
          </div>
        </div>
      );
    },
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
    id: 'uploadedAt',
    label: 'Uploaded Date',
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
        style={helpers.getSecurityLevelBackgroundColor(document.securityLevel)}
      >
        <Shield className="mr-1 w-3 h-3" />
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

// ISO9000/ISO2/EDC Pages Configuration - When clicking on cards (without Subject)
export const isoCardDocumentsColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Document',
    sortable: true,
    render: (document, helpers) => (
      <div className="flex items-center space-x-3">
        {helpers.getFileIcon(document.fileType)}
        <div>
          <div className="text-sm font-medium text-left transition-colors duration-200 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline">
            {document.title}
          </div>
          <div className="flex items-center mt-1 space-x-2">
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
    id: 'assignedTo',
    label: 'Assigned To',
    sortable: true,
    render: (document, helpers) => {
      if (!document.assignedTo) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      const assignedUser = helpers.users?.find(u => u.id === document.assignedTo);
      if (!assignedUser) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unknown User
          </span>
        );
      }
      return (
        <div className="flex items-center space-x-2">
          <div className="flex justify-center items-center w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30">
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              {assignedUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {assignedUser.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {assignedUser.role}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: 'uploadedAt',
    label: 'Uploaded Date',
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
        style={helpers.getSecurityLevelBackgroundColor(document.securityLevel)}
      >
        <Shield className="mr-1 w-3 h-3" />
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

