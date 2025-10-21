import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  FileCheck,
  Check,
  Bell,
  Trash2
} from 'lucide-react';
import DocumentEditModal from './DocumentEditModal';
import UniversalDocumentsTable from './UniversalDocumentsTable';
import PermissionDeniedModal from './PermissionDeniedModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { isoCardDocumentsColumnsWithSubject, pendingApprovalsColumns } from './tableConfigs';
import { Document, User } from '../types';
import { mockUsers } from '../data/mockData';
import { canEditDocument, canDeleteDocument } from '../utils/documentPermissions';

interface PendingApprovalsPageProps {
  onBack: () => void;
  onDocumentClick?: (document: Document) => void;
  user?: User | null;
  iso9000Sections?: any[];
  ceSections?: any[];
  edcSections?: any[];
  iso2Sections?: any[];
}

export default function PendingApprovalsPage({ 
  onBack, 
  onDocumentClick,
  user, 
  iso9000Sections = [], 
  ceSections = [], 
  edcSections = [],
  iso2Sections = []
}: PendingApprovalsPageProps) {
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [permissionDeniedModalOpen, setPermissionDeniedModalOpen] = useState(false);
  const [permissionDeniedInfo, setPermissionDeniedInfo] = useState<{
    documentTitle: string;
    assignedTo?: string;
    action: 'edit' | 'delete' | 'mark-status';
  } | null>(null);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Get all pending and rejected documents from all sections, filtered by manager assignment
  const pendingDocuments = useMemo(() => {
    const allDocs: Document[] = [];
    
    // Get from ISO9000 sections
    iso9000Sections.forEach(section => {
      section.documents.forEach((doc: any) => {
        if (doc.approvalStatus === 'pending' || doc.approvalStatus === 'rejected') {
          allDocs.push(doc as Document);
        }
      });
    });
    
    // Get from CE sections
    ceSections.forEach(section => {
      section.documents.forEach((doc: any) => {
        if (doc.approvalStatus === 'pending' || doc.approvalStatus === 'rejected') {
          allDocs.push(doc as Document);
        }
      });
    });
    
    // Get from EDC sections
    edcSections.forEach(section => {
      section.documents.forEach((doc: any) => {
        if (doc.approvalStatus === 'pending' || doc.approvalStatus === 'rejected') {
          allDocs.push(doc as Document);
        }
      });
    });
    
    // Get from ISO2 sections
    iso2Sections.forEach(section => {
      section.documents.forEach((doc: any) => {
        if (doc.approvalStatus === 'pending' || doc.approvalStatus === 'rejected') {
          allDocs.push(doc as Document);
        }
      });
    });
    
    // If no documents from sections, use mock data for testing
    if (allDocs.length === 0) {
      const mockDocs = oldPendingDocuments.map(doc => ({
        ...doc,
        approvalStatus: (doc as any).status as 'pending' | 'approved' | 'rejected' | 'revision',
        fileType: ((doc as any).fileExtension?.toLowerCase() || 'pdf'),
        uploadedAt: new Date(doc.uploadedAt),
        lastModified: new Date(doc.uploadedAt),
        accessType: 'public' as const,
        tags: doc.tags || [],
        url: `/documents/${doc.id}`,
        assignedTo: doc.approver?.id || '1',
        assignedDate: new Date(doc.submittedForApproval || doc.uploadedAt),
        securityLevel: 'Public' as const,
        uploadedBy: doc.uploadedBy,
        department: doc.department,
        type: doc.type,
        fileSize: doc.fileSize,
        description: doc.description,
        approver: doc.approver,
        priority: doc.priority
      }));
      allDocs.push(...mockDocs);
    }
    
    // Filter to show only documents assigned to the current manager
    if (user && user.role === 'manager') {
      return allDocs.filter(doc => doc.assignedTo === user.id);
    }
    
    // For non-managers or when no user is logged in, return all documents
    const result = allDocs;
    console.log('PendingApprovalsPage: Documents found:', result.length, result);
    return result;
  }, [iso9000Sections, ceSections, edcSections, iso2Sections, user]);

  // OLD Mock data - Now replaced with real data from sections
  const oldPendingDocuments: Document[] = [
    {
      id: '1',
      title: 'Q1 Financial Report',
      type: 'Financial Report',
      department: 'Finance',
      uploadedBy: 'John Smith',
      uploadedAt: new Date('2025-01-15T10:30:00Z'),
      fileSize: '2.4 MB',
      status: 'pending',
      tags: ['financial', 'quarterly', 'report'],
      fileExtension: 'PDF',
      description: 'Quarterly financial report for Q1 2025',
      submittedForApproval: '2025-01-15T10:30:00Z',
      approver: {
        id: '2',
        name: 'CFO',
        title: 'Chief Financial Officer',
        email: 'cfo@company.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
        approved: false
      },
      priority: 'high'
    },
    {
      id: '2',
      title: 'Security Policy Update',
      type: 'Policy Document',
      department: 'IT Security',
      uploadedBy: 'Mike Chen',
      uploadedAt: new Date('2025-01-14T14:20:00Z'),
      fileSize: '1.8 MB',
      status: 'pending',
      tags: ['security', 'policy', 'update'],
      fileExtension: 'DOCX',
      description: 'Updated security policy for 2025',
      submittedForApproval: '2025-01-14T14:20:00Z',
      approver: {
        id: '4',
        name: 'CISO',
        title: 'Chief Information Security Officer',
        email: 'ciso@company.com',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
        approved: false
      },
      priority: 'urgent'
    },
    {
      id: '3',
      title: 'Employee Handbook Revision',
      type: 'HR Document',
      department: 'Human Resources',
      uploadedBy: 'Emily Davis',
      uploadedAt: new Date('2025-01-13T09:15:00Z'),
      fileSize: '3.2 MB',
      status: 'pending',
      tags: ['hr', 'handbook', 'employee'],
      fileExtension: 'PDF',
      description: 'Revised employee handbook with new policies',
      submittedForApproval: '2025-01-13T09:15:00Z',
      approver: {
        id: '8',
        name: 'CEO',
        title: 'Chief Executive Officer',
        email: 'ceo@company.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
        approved: false
      },
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Project Charter - New Initiative',
      type: 'Project Document',
      department: 'Project Management',
      uploadedBy: 'Alex Rodriguez',
      uploadedAt: '2025-01-12T16:45:00Z',
      fileSize: '1.5 MB',
      status: 'pending',
      tags: ['project', 'charter', 'initiative'],
      fileExtension: 'DOCX',
      description: 'Project charter for new digital transformation initiative',
      submittedForApproval: '2025-01-12T16:45:00Z',
      approver: {
        id: '9',
        name: 'Project Director',
        title: 'Project Director',
        email: 'project.director@company.com',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
        approved: false
      },
      priority: 'high'
    },
    {
      id: '5',
      title: 'Vendor Agreement Template',
      type: 'Legal Document',
      department: 'Legal',
      uploadedBy: 'David Wilson',
      uploadedAt: '2025-01-11T11:30:00Z',
      fileSize: '0.9 MB',
      status: 'approved',
      tags: ['legal', 'vendor', 'agreement'],
      fileExtension: 'DOCX',
      description: 'Standard vendor agreement template',
      submittedForApproval: '2025-01-11T11:30:00Z',
      approver: {
        id: '11',
        name: 'Legal Counsel',
        title: 'Legal Counsel',
        email: 'legal.counsel@company.com',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
        approved: true
      },
      priority: 'low'
    },
    {
      id: '6',
      title: 'IT Infrastructure Assessment',
      type: 'Technical Report',
      department: 'IT Operations',
      uploadedBy: 'Kevin Park',
      uploadedAt: '2025-01-10T13:20:00Z',
      fileSize: '4.1 MB',
      status: 'pending',
      tags: ['it', 'infrastructure', 'assessment'],
      fileExtension: 'PDF',
      description: 'Comprehensive IT infrastructure assessment report',
      submittedForApproval: '2025-01-10T13:20:00Z',
      approver: {
        id: '12',
        name: 'IT Director',
        title: 'IT Director',
        email: 'it.director@company.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
        approved: false
      },
      priority: 'medium'
    }
  ];


  // Sort pending documents
  const sortedDocuments = useMemo(() => {
    return [...pendingDocuments].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'uploadedAt':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'status':
          comparison = a.approvalStatus.localeCompare(b.approvalStatus);
          break;
        case 'securityLevel':
          const securityOrder = { 'Public': 1, 'Restricted': 2, 'Confidential': 3, 'Top Secret': 4 };
          const aSecurity = a.securityLevel || 'Public';
          const bSecurity = b.securityLevel || 'Public';
          comparison = (securityOrder[aSecurity as keyof typeof securityOrder] || 1) - (securityOrder[bSecurity as keyof typeof securityOrder] || 1);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [pendingDocuments, sortBy, sortOrder]);


  const handleView = (document: Document) => {
    if (onDocumentClick) {
      onDocumentClick(document);
    }
  };

  const handleAcknowledge = (documentId: string) => {
    console.log('Document acknowledged:', documentId);
    alert(`Document "${selectedDocument?.title}" has been acknowledged`);
  };

  const handleApprove = (documentId: string) => {
    console.log('Document approved:', documentId);
    alert(`Document "${selectedDocument?.title}" has been approved`);
  };

  const handleSendReminder = (approver: { id: string; name: string; email: string }) => {
    console.log('Sending reminder to:', approver);
    alert(`Reminder sent to ${approver.name} (${approver.email})`);
  };

  const handleDocumentClick = (document: Document) => {
    console.log('PendingApprovalsPage: Document clicked:', document.title);
    if (onDocumentClick) {
      onDocumentClick(document);
    }
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user can edit this document
    if (user && !canEditDocument(document, user)) {
      // Find the assigned user name
      const assignedUser = mockUsers.find(u => u.id === document.assignedTo);
      setPermissionDeniedInfo({
        documentTitle: document.title,
        assignedTo: assignedUser?.name || 'Unknown User',
        action: 'edit'
      });
      setPermissionDeniedModalOpen(true);
      return;
    }
    
    // Navigate to DocumentDetailPage instead of opening the edit modal
    if (onDocumentClick) {
      onDocumentClick(document);
    }
  };

  const handleDownload = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Downloading document:', document.title);
    alert(`Downloading "${document.title}"`);
  };

  const handleShare = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Sharing document:', document.title);
    navigator.clipboard.writeText(window.location.href + `?doc=${document.id}`);
    alert('Link copied to clipboard!');
  };

  // Send reminder for a single document (triggered from table actions)
  const handleReminder = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.approver) {
      handleSendReminder(document.approver);
    }
  };

  const handleDelete = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user can delete this document
    if (user && !canDeleteDocument(document, user)) {
      // Find the assigned user name
      const assignedUser = mockUsers.find(u => u.id === document.assignedTo);
      setPermissionDeniedInfo({
        documentTitle: document.title,
        assignedTo: assignedUser?.name || 'Unknown User',
        action: 'delete'
      });
      setPermissionDeniedModalOpen(true);
      return;
    }
    
    setDocumentToDelete(document);
    setDeleteConfirmationModalOpen(true);
  };

  const handleReassign = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) return;
    
    if (confirm(`Are you sure you want to re-assign "${document.title}" to yourself?`)) {
      // Update the document assignment
      const updatedDocument = {
        ...document,
        assignedTo: user.id,
        assignedDate: new Date()
      };
      
      // Log the activity
      console.log(`Document "${document.title}" re-assigned to ${user.name} (${user.id})`);
      
      // Show success message
      alert(`"${document.title}" has been re-assigned to you successfully!`);
      
      // In a real app, you would update the document in the database here
      // For now, we'll just log it
    }
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      console.log('Deleting document:', documentToDelete.title);
      // In a real app, you would delete the document here
      alert(`"${documentToDelete.title}" deleted successfully!`);
      setDeleteConfirmationModalOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleClosePermissionDeniedModal = () => {
    setPermissionDeniedModalOpen(false);
    setPermissionDeniedInfo(null);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setDeleteConfirmationModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field as any);
      setSortOrder('asc');
    }
  };

  // Document selection handlers
  const handleDocumentSelect = (documentId: string, selected: boolean) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(documentId);
      } else {
        newSet.delete(documentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(sortedDocuments.map(doc => doc.id));
    setSelectedDocuments(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedDocuments(new Set());
  };

  // Bulk action handlers
  const handleBulkApprove = () => {
    const count = selectedDocuments.size;
    console.log('Bulk approving documents:', Array.from(selectedDocuments));
    alert(`${count} document${count > 1 ? 's' : ''} approved successfully!`);
    setSelectedDocuments(new Set());
  };

  const handleBulkDelete = () => {
    const count = selectedDocuments.size;
    if (confirm(`Are you sure you want to delete ${count} selected document${count > 1 ? 's' : ''}?`)) {
      console.log('Bulk deleting documents:', Array.from(selectedDocuments));
      alert(`${count} document${count > 1 ? 's' : ''} deleted successfully!`);
      setSelectedDocuments(new Set());
    }
  };

  const handleBulkReminder = () => {
    const count = selectedDocuments.size;
    console.log('Sending bulk reminders for documents:', Array.from(selectedDocuments));
    alert(`Reminders sent for ${count} pending document${count > 1 ? 's' : ''}!`);
    setSelectedDocuments(new Set());
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-8xl lg:px-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
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
                Pending Approvals
              </h1>
              {user && user.role === 'manager' && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Documents assigned to you for review
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <FileCheck className="w-4 h-4" />
              <span>{sortedDocuments.length} pending</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedDocuments.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <div className="p-4 rounded-lg glass-panel">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedDocuments.size} document{selectedDocuments.size > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleDeselectAll}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Clear selection
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleBulkApprove}
                    className="text-green-600 glass-button hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </motion.button>

                  <motion.button
                    onClick={handleBulkReminder}
                    className="text-orange-600 glass-button hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-4 h-4" />
                    <span>Send Reminder</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={handleBulkDelete}
                    className="text-red-600 glass-button hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Table */}
      <motion.div
        className="rounded-2xl glass-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <UniversalDocumentsTable
          documents={sortedDocuments}
          columns={pendingApprovalsColumns}
          user={user}
          users={mockUsers}
          showCheckbox={true}
          showActions={true}
          selectedDocuments={selectedDocuments}
          hoveredRow={hoveredRow}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onDocumentSelect={handleDocumentSelect}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onSort={handleSort}
          onHoverChange={setHoveredRow}
          onDocumentClick={handleDocumentClick}
          onView={handleView}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onShare={handleShare}
          onDelete={handleDelete}
          onReassign={handleReassign}
          onReminder={handleReminder}
        />
      </motion.div>

      {/* Empty State */}
      {sortedDocuments.length === 0 && (
        <motion.div
          className="py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FileCheck className="mx-auto mb-4 w-16 h-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            {user && user.role === 'manager' ? 'No documents assigned to you' : 'No pending approvals'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {user && user.role === 'manager' 
              ? 'You have no documents assigned for review at the moment.'
              : 'All documents have been reviewed and approved.'
            }
          </p>
        </motion.div>
      )}

      {/* Modals */}

      <DocumentEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        document={editingDocument as any}
        onSave={(updatedDocument) => {
          console.log('Document updated:', updatedDocument);
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        hideApproveActions={true}
      />

      {/* Permission Denied Modal */}
      {permissionDeniedInfo && (
        <PermissionDeniedModal
          isOpen={permissionDeniedModalOpen}
          onClose={handleClosePermissionDeniedModal}
          documentTitle={permissionDeniedInfo.documentTitle}
          assignedTo={permissionDeniedInfo.assignedTo}
          action={permissionDeniedInfo.action}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmationModalOpen}
        onClose={handleCloseDeleteConfirmationModal}
        onConfirm={handleConfirmDelete}
        documentTitle={documentToDelete?.title || ''}
      />
    </div>
  );
}
