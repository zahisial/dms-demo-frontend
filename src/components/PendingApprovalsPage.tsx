import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileCheck,
  Check
} from 'lucide-react';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';
import UniversalDocumentsTable from './UniversalDocumentsTable';
import { pendingApprovalsColumns } from './tableConfigs';
import { Document, User } from '../types';

interface PendingApprovalsPageProps {
  onBack: () => void;
  user?: User | null;
}

export default function PendingApprovalsPage({ onBack, user }: PendingApprovalsPageProps) {
  const [searchQuery] = useState('');
  const [selectedDepartment] = useState<string>('all');
  const [selectedPriority] = useState<string>('all');
  const [sortBy] = useState<'date' | 'title' | 'department' | 'priority'>('date');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Mock data for pending approval documents
  const pendingDocuments: Document[] = [
    {
      id: '1',
      title: 'Q1 Financial Report',
      type: 'Financial Report',
      department: 'Finance',
      uploadedBy: 'John Smith',
      uploadedAt: '2025-01-15T10:30:00Z',
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
      uploadedAt: '2025-01-14T14:20:00Z',
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
      uploadedAt: '2025-01-13T09:15:00Z',
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


  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = pendingDocuments.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment = selectedDepartment === 'all' || doc.department === selectedDepartment;
      const matchesPriority = selectedPriority === 'all' || doc.priority === selectedPriority;
      
      return matchesSearch && matchesDepartment && matchesPriority;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
                      (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [pendingDocuments, searchQuery, selectedDepartment, selectedPriority, sortBy, sortOrder]);


  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setPreviewModalOpen(true);
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
    setSelectedDocument(document);
    setPreviewModalOpen(true);
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  // Custom actions renderer for pending approvals
  const renderCustomActions = (document: Document) => {
    if (document.approver && !document.approver.approved) {
      return (
        <motion.button
          onClick={() => handleSendReminder(document.approver!)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send Reminder
        </motion.button>
      );
    } else if (document.approver && document.approver.approved) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Check className="w-3 h-3 mr-1" />
          Approved
        </span>
      );
    } else {
      return <span className="text-sm text-gray-500 dark:text-gray-400">No action needed</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
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
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{filteredAndSortedDocuments.length} pending</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        
      </motion.div>

      {/* Documents Table */}
      <motion.div
        className="glass-panel rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <UniversalDocumentsTable
          documents={filteredAndSortedDocuments}
          columns={pendingApprovalsColumns}
          user={user}
          showCheckbox={false}
          showActions={true}
          onDocumentClick={handleDocumentClick}
          onView={handleView}
          customActions={renderCustomActions}
        />
      </motion.div>

      {/* Empty State */}
      {filteredAndSortedDocuments.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No pending approvals
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            All documents have been reviewed and approved.
          </p>
        </motion.div>
      )}

      {/* Modals */}
      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument as any}
        onEdit={(document) => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
          setEditingDocument(document as any);
          setEditModalOpen(true);
        }}
        user={user}
        onAcknowledge={handleAcknowledge}
        onApprove={handleApprove}
      />

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
      />
    </div>
  );
}
