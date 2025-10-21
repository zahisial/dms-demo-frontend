import React from 'react';
import { Shield, Check } from 'lucide-react';
import { ColumnConfig } from './UniversalDocumentsTable';
import { Document } from '../types';
import { calculateDaysDelayed } from '../utils/documentPermissions';
import { 
  getFileIcon, 
  getStatusIcon, 
  getStatusColor, 
  getStatusBackgroundColor, 
  getSecurityLevelColor, 
  getSecurityLevelBackgroundColor, 
  formatDateTime 
} from '../utils/tableHelpers';
import { mockUsers } from '../data/mockData';

// DocsDB Page Configuration - Full featured table
export const docsDBColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Title',
    sortable: true,
    render: (document) => (
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
    render: (document) => (
      <div className="flex items-center space-x-2">
        {getFileIcon(document.fileType)}
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
    render: (document) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}
        style={getStatusBackgroundColor(document.approvalStatus)}
      >
        {getStatusIcon(document.approvalStatus)}
        <span className="ml-1">{document.approvalStatus}</span>
      </span>
    ),
  },
  {
    id: 'securityLevel',
    label: 'Security',
    sortable: true,
    visible: true, // Will be controlled dynamically based on user role
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityLevelColor(document.securityLevel)}`}
        style={getSecurityLevelBackgroundColor(document.securityLevel)}
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
    render: (document) => (
      <div className="flex items-center space-x-3">
        {getFileIcon(document.fileType)}
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
    id: 'approvalStatus',
    label: 'Status',
    sortable: true,
    render: (document) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'approved':
            return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
          case 'pending':
            return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
          case 'rejected':
            return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
          case 'revision':
            return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
          default:
            return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
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
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}>
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
  {
    id: 'assignedTo',
    label: 'Assigned To',
    sortable: true,
    render: (document) => {
      if (!document.assignedTo) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      
      const assignedUser = mockUsers.find(user => user.id === document.assignedTo);
      if (!assignedUser) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unknown User
          </span>
        );
      }
      
      return (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
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
    render: (document) => {
      if (!document.securityLevel) {
        return <span className="text-sm text-gray-400 dark:text-gray-500">Public</span>;
      }
      
      return (
        <span 
          className="text-xs font-medium px-2 py-1 rounded-full text-white"
          style={getSecurityLevelBackgroundColor(document.securityLevel)}
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
    render: (document) => (
      <div className="flex items-center space-x-3">
        {getFileIcon(document.fileType)}
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
    render: (document) => (
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}
        style={getStatusBackgroundColor(document.approvalStatus)}
      >
        {getStatusIcon(document.approvalStatus)}
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
    render: (document) => (
      <div className="flex items-center space-x-3">
        {getFileIcon(document.fileType)}
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
    id: 'assignedTo',
    label: 'Assigned To',
    sortable: true,
    render: (document) => {
      if (!document.assignedTo) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      const assignedUser = mockUsers.find(u => u.id === document.assignedTo);
      if (!assignedUser) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unknown User
          </span>
        );
      }
      return (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
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
    render: (document) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}
        style={getStatusBackgroundColor(document.approvalStatus)}
      >
        {getStatusIcon(document.approvalStatus)}
        <span className="ml-1 capitalize">{document.approvalStatus}</span>
      </span>
    ),
  },
  {
    id: 'securityLevel',
    label: 'Security',
    sortable: true,
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityLevelColor(document.securityLevel)}`}
        style={getSecurityLevelBackgroundColor(document.securityLevel)}
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

// ISO9000/ISO2/EDC Pages Configuration - When clicking on cards (without Subject)
export const isoCardDocumentsColumns: ColumnConfig[] = [
  {
    id: 'title',
    label: 'Document',
    sortable: true,
    render: (document) => (
      <div className="flex items-center space-x-3">
        {getFileIcon(document.fileType)}
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
    id: 'assignedTo',
    label: 'Assigned To',
    sortable: true,
    render: (document) => {
      if (!document.assignedTo) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unassigned
          </span>
        );
      }
      const assignedUser = mockUsers.find(u => u.id === document.assignedTo);
      if (!assignedUser) {
        return (
          <span className="text-sm text-gray-400 dark:text-gray-500">
            Unknown User
          </span>
        );
      }
      return (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
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
    render: (document) => (
      <span className="text-sm text-gray-900 dark:text-white">
        {formatDateTime(document.uploadedAt.toISOString())}
      </span>
    ),
  },
  {
    id: 'status',
    label: 'Status',
    sortable: true,
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}
        style={getStatusBackgroundColor(document.approvalStatus)}
      >
        {getStatusIcon(document.approvalStatus)}
        <span className="ml-1 capitalize">{document.approvalStatus}</span>
      </span>
    ),
  },
  {
    id: 'securityLevel',
    label: 'Security',
    sortable: true,
    render: (document) => (
      <span 
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityLevelColor(document.securityLevel)}`}
        style={getSecurityLevelBackgroundColor(document.securityLevel)}
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

