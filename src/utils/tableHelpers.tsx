import React from 'react';
import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { User } from '../types';

export interface RenderHelpers {
  getFileIcon: (fileType: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  getStatusBackgroundColor: (status: string) => React.CSSProperties;
  getSecurityLevelColor: (level?: string) => string;
  getSecurityLevelBackgroundColor: (level?: string) => React.CSSProperties;
  formatDateTime: (dateString: string) => string;
  user?: User;
  users?: User[];
}

// Utility functions
export const getFileIcon = (fileType: string) => {
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

export const getStatusColor = (status: string) => {
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

export const getStatusBackgroundColor = (status: string): React.CSSProperties => {
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

export const getStatusIcon = (status: string) => {
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

export const getSecurityLevelColor = (level?: string) => {
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

export const getSecurityLevelBackgroundColor = (level?: string): React.CSSProperties => {
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

export const formatDateTime = (dateString: string) => {
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

// Create a helpers object factory
export const createRenderHelpers = (user?: User, users?: User[]): RenderHelpers => ({
  getFileIcon,
  getStatusIcon,
  getStatusColor,
  getStatusBackgroundColor,
  getSecurityLevelColor,
  getSecurityLevelBackgroundColor,
  formatDateTime,
  user,
  users,
});