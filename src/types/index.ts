export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar?: string;
  phone?: string;
  position?: string;
  location?: string;
  bio?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  fileType: string;
  fileSize: string;
  department: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  accessType: 'public' | 'department' | 'restricted';
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'revision';
  approvedBy?: string;
  approvedAt?: Date;
  publishStatus?: 'draft' | 'published';
  publishedBy?: string;
  publishedAt?: Date;
  tags: string[];
  description?: string;
  url: string;
  thumbnail?: string;
  htmlPreviewUrl?: string;
  expiryDate?: Date;
  requiresAcceptance?: boolean;
  notifyAllAfterApproval?: boolean;
  securityLevel?: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret' | 'Highly Confidential';
  documentType?: string;
  approver?: {
    id: string;
    name: string;
    title: string;
    email: string;
    avatar?: string;
    approved?: boolean;
  };
  submittedForApproval?: string;
  assignedTo?: string;  // User ID who is assigned to review/approve
  assignedDate?: Date;  // When document was assigned
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  isDeleted?: boolean;  // Soft delete flag
  deletedAt?: Date;
  deletedBy?: string;
}

export interface DocumentAcceptance {
  id: string;
  documentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  acceptedAt: Date;
  acceptanceType: 'read' | 'acknowledged' | 'signed';
}

export interface Department {
  id: string;
  name: string;
  color: string;
  documentCount: number;
  parentId?: string | null;
  path?: string;
  children?: Department[];
  pendingCount?: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  documentId: string;
  documentTitle: string;
  action: 'view' | 'download' | 'approve' | 'reject' | 'upload';
  timestamp: Date;
}

export interface NotificationSettings {
  emailOnApproval: boolean;
  emailOnNewDocument: boolean;
  emailOnDocumentUpdate: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId: string;
  actions?: {
    type: 'approve' | 'acknowledge';
    label: string;
  }[];
  documentId?: string;
}