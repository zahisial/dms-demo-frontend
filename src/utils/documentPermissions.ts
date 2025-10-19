import { Document, User } from '../types';

// Calculate days delayed
export const calculateDaysDelayed = (assignedDate?: Date): number => {
  if (!assignedDate) return 0;
  
  const today = new Date();
  const assigned = new Date(assignedDate);
  const diffTime = Math.abs(today.getTime() - assigned.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Check if user can edit document
export const canEditDocument = (document: Document, currentUser: User): boolean => {
  // Cannot edit if deleted
  if (document.isDeleted) return false;
  
  // Employees cannot edit
  if (currentUser.role === 'employee') return false;
  
  // If document is assigned to someone else, cannot edit
  if (document.assignedTo && document.assignedTo !== currentUser.id) {
    return false;
  }
  
  // Managers and Admins can edit their own or unassigned documents
  return currentUser.role === 'manager' || currentUser.role === 'admin';
};

// Check if user can delete document
export const canDeleteDocument = (document: Document, currentUser: User): boolean => {
  // Same rules as edit
  return canEditDocument(document, currentUser);
};

// Check if user can approve document
export const canApproveDocument = (document: Document, currentUser: User): boolean => {
  // Only if document is assigned to this user
  if (document.assignedTo !== currentUser.id) return false;
  
  // Only if document is pending
  if (document.approvalStatus !== 'pending') return false;
  
  // Only managers and admins
  return currentUser.role === 'manager' || currentUser.role === 'admin';
};

// Check if user can change document status
export const canChangeStatus = (document: Document, currentUser: User): boolean => {
  // Only if document is assigned to this user
  if (document.assignedTo && document.assignedTo !== currentUser.id) {
    return false;
  }
  
  // Only managers and admins
  return currentUser.role === 'manager' || currentUser.role === 'admin';
};

// Check if user can re-assign document
export const canReassignDocument = (document: Document, currentUser: User): boolean => {
  // Only admins can reassign
  if (currentUser.role !== 'admin') return false;
  
  // Cannot reassign if already approved
  if (document.approvalStatus === 'approved') return false;
  
  return true;
};

// Check if user can restore deleted document
export const canRestoreDocument = (document: Document, currentUser: User): boolean => {
  // Only admins can restore
  return currentUser.role === 'admin' && document.isDeleted === true;
};

// Filter documents by user assignment (for Pending Approvals page)
export const filterDocumentsByUser = (
  documents: Document[], 
  currentUser: User,
  filterType: 'assigned-to-me' | 'assigned-to-all' | 'pending-only'
): Document[] => {
  let filtered = documents;
  
  // Filter by assignment
  if (filterType === 'assigned-to-me') {
    filtered = filtered.filter(doc => doc.assignedTo === currentUser.id);
  }
  
  // Only show pending documents
  if (filterType === 'pending-only' || filterType === 'assigned-to-me') {
    filtered = filtered.filter(doc => doc.approvalStatus === 'pending');
  }
  
  // Hide deleted documents
  filtered = filtered.filter(doc => !doc.isDeleted);
  
  return filtered;
};

// Get approver assignment suggestions based on section
export const getApproverForSection = (
  sectionName: string,
  mockUsers: User[]
): { id: string; name: string; title: string; email: string; avatar?: string } | undefined => {
  const isoAdmin = mockUsers.find(u => u.id === '4'); // ISO Administrator
  const hrManager = mockUsers.find(u => u.id === '2'); // Ahmed Al-Rashid
  const itAdmin = mockUsers.find(u => u.id === '1'); // Sarah Johnson
  
  // Assignment logic by section
  const sectionLower = sectionName.toLowerCase();
  
  if (sectionLower.includes('quality') || 
      sectionLower.includes('document') || 
      sectionLower.includes('audit') ||
      sectionLower.includes('process')) {
    return isoAdmin ? {
      id: isoAdmin.id,
      name: isoAdmin.name,
      title: 'Quality Manager',
      email: isoAdmin.email,
      avatar: isoAdmin.avatar
    } : undefined;
  }
  
  if (sectionLower.includes('training') || 
      sectionLower.includes('customer')) {
    return hrManager ? {
      id: hrManager.id,
      name: hrManager.name,
      title: 'HR Manager',
      email: hrManager.email,
      avatar: hrManager.avatar
    } : undefined;
  }
  
  if (sectionLower.includes('risk')) {
    return itAdmin ? {
      id: itAdmin.id,
      name: itAdmin.name,
      title: 'IT Administrator',
      email: itAdmin.email,
      avatar: itAdmin.avatar
    } : undefined;
  }
  
  // Default to ISO Administrator
  return isoAdmin ? {
    id: isoAdmin.id,
    name: isoAdmin.name,
    title: 'Quality Manager',
    email: isoAdmin.email,
    avatar: isoAdmin.avatar
  } : undefined;
};

