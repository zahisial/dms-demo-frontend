import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Search, Clock, CheckCircle, Upload } from 'lucide-react';
import EDCCard from './EDCCard';
import NewCardModal from './NewCardModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';
import UploadModal from './UploadModal';
import Toaster, { useToaster } from './Toaster';
import SearchBar from './SearchBar';
import { mockDocuments } from '../data/mockData';

interface EDCDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  securityLevel: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret';
}

interface Document {
  id: string;
  title: string;
  type: string;
  department: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: string;
  status: 'approved' | 'pending' | 'revision';
  tags: string[];
  collaborators: Array<{
    id: string;
    name: string;
    initials: string;
    avatar?: string;
  }>;
  fileExtension: string;
  isLocked?: boolean;
  isPublic?: boolean;
  securityLevel?: 'public' | 'internal' | 'confidential' | 'restricted';
  description?: string;
}

interface EDCSection {
  id: string;
  title: string;
  color: string;
  documents: EDCDocument[];
}

interface EDCPageProps {
  onNavigateToDocsDB: () => void;
  onShowAllResults?: (query: string) => void;
}

export default function EDCPage({ onNavigateToDocsDB, onShowAllResults }: EDCPageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess } = useToaster();
  
  // State for EDC sections with random document counts
  const [edcSections, setEdcSections] = useState<EDCSection[]>([
    {
      id: '1',
      title: 'Data Center Infrastructure',
      color: '#08bed5', // Primary bright accent
      documents: [
        { id: '1', title: 'Server Configuration', type: 'Configuration', url: '#', securityLevel: 'Confidential' },
        { id: '2', title: 'Network Architecture', type: 'Documentation', url: '#', securityLevel: 'Top Secret' },
        { id: '3', title: 'Power Management', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
        { id: '4', title: 'Cooling Systems', type: 'Manual', url: '#', securityLevel: 'Public' },
        { id: '5', title: 'Security Protocols', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
        { id: '6', title: 'Rack Management', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
        { id: '7', title: 'Cable Management', type: 'Guideline', url: '#', securityLevel: 'Public' },
        { id: '8', title: 'Environmental Controls', type: 'Manual', url: '#', securityLevel: 'Confidential' }
      ]
    },
    {
      id: '2',
      title: 'Data Management',
      color: '#03778d', // Primary dark accent
      documents: [
        { id: '9', title: 'Data Backup Strategy', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
        { id: '10', title: 'Data Retention', type: 'Procedure', url: '#', securityLevel: 'Confidential' },
        { id: '11', title: 'Data Classification', type: 'Guideline', url: '#', securityLevel: 'Restricted' },
        { id: '12', title: 'Data Migration', type: 'Plan', url: '#', securityLevel: 'Top Secret' }
      ]
    },
    {
      id: '3',
      title: 'System Monitoring',
      color: '#08bed5', // Primary bright accent
      documents: [
        { id: '13', title: 'Performance Metrics', type: 'Dashboard', url: '#', securityLevel: 'Public' },
        { id: '14', title: 'Alert Configuration', type: 'Setup', url: '#', securityLevel: 'Restricted' },
        { id: '15', title: 'Log Management', type: 'Procedure', url: '#', securityLevel: 'Confidential' },
        { id: '16', title: 'Health Checks', type: 'Script', url: '#', securityLevel: 'Public' },
        { id: '17', title: 'Capacity Planning', type: 'Report', url: '#', securityLevel: 'Restricted' },
        { id: '18', title: 'Resource Monitoring', type: 'Dashboard', url: '#', securityLevel: 'Public' },
        { id: '19', title: 'Threshold Management', type: 'Configuration', url: '#', securityLevel: 'Confidential' },
        { id: '20', title: 'Reporting Tools', type: 'Manual', url: '#', securityLevel: 'Public' },
        { id: '21', title: 'Dashboard Setup', type: 'Guide', url: '#', securityLevel: 'Restricted' },
        { id: '22', title: 'Notification Rules', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
        { id: '23', title: 'Monitoring Schedule', type: 'Calendar', url: '#', securityLevel: 'Confidential' },
        { id: '24', title: 'System Alerts', type: 'Configuration', url: '#', securityLevel: 'Restricted' }
      ]
    },
    {
      id: '4',
      title: 'Security & Compliance',
      color: '#03778d', // Primary dark accent
      documents: [
        { id: '25', title: 'Access Control', type: 'Policy', url: '#', securityLevel: 'Top Secret' },
        { id: '26', title: 'Audit Procedures', type: 'Checklist', url: '#', securityLevel: 'Confidential' },
        { id: '27', title: 'Incident Response', type: 'Plan', url: '#', securityLevel: 'Top Secret' },
        { id: '28', title: 'Compliance Framework', type: 'Document', url: '#', securityLevel: 'Restricted' },
        { id: '29', title: 'Security Training', type: 'Material', url: '#', securityLevel: 'Public' }
      ]
    },
    {
      id: '5',
      title: 'Disaster Recovery',
      color: '#08bed5', // Primary bright accent
      documents: [
        { id: '30', title: 'DR Strategy', type: 'Plan', url: '#', securityLevel: 'Top Secret' },
        { id: '31', title: 'Backup Procedures', type: 'SOP', url: '#', securityLevel: 'Confidential' },
        { id: '32', title: 'Recovery Testing', type: 'Schedule', url: '#', securityLevel: 'Restricted' }
      ]
    },
    {
      id: '6',
      title: 'Operations & Maintenance',
      color: '#03778d', // Primary dark accent
      documents: [
        { id: '33', title: 'Maintenance Schedule', type: 'Calendar', url: '#', securityLevel: 'Public' },
        { id: '34', title: 'Change Management', type: 'Process', url: '#', securityLevel: 'Restricted' },
        { id: '35', title: 'Vendor Management', type: 'Agreement', url: '#', securityLevel: 'Confidential' },
        { id: '36', title: 'Service Level Agreements', type: 'SLA', url: '#', securityLevel: 'Public' },
        { id: '37', title: 'Performance Reports', type: 'Dashboard', url: '#', securityLevel: 'Public' },
        { id: '38', title: 'Work Order System', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
        { id: '39', title: 'Asset Management', type: 'Database', url: '#', securityLevel: 'Confidential' },
        { id: '40', title: 'Maintenance Logs', type: 'Record', url: '#', securityLevel: 'Restricted' }
      ]
    }
  ]);

  const handleAddNewCard = (card: { title: string; color: string; icon: string }) => {
    const newSection: EDCSection = {
      id: Date.now().toString(),
      title: card.title,
      color: card.color,
      documents: []
    };
    setEdcSections(prev => [...prev, newSection]);
  };

  const handleDocumentClick = (document: EDCDocument) => {
    console.log('EDCPage: Document clicked:', document.title);
    // Convert EDCDocument to Document format for view
    const viewDocument: Document = {
      id: document.id,
      title: document.title,
      type: document.type as any,
      fileType: 'pdf' as any,
      fileSize: '1.2 MB',
      department: 'EDC Management',
      uploadedBy: 'System Admin',
      uploadedAt: new Date(),
      lastModified: new Date(),
      accessType: 'public',
      approvalStatus: 'approved',
      tags: ['EDC', 'Data Center', 'Infrastructure'],
      description: `${document.title} - EDC data center management document`,
      url: '#'
    };
    
    console.log('EDCPage: Opening DocumentPreviewModal for:', viewDocument.title);
    setSelectedDocument(viewDocument);
    setPreviewModalOpen(true);
  };

  const handleUploadComplete = (files: File[], subject: string) => {
    // Show success notification
    showSuccess(
      'Upload Successful',
      `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully to ${subject}. Click the edit icon to modify document details.`,
      6000
    );
    
    // Here you would typically add the uploaded files to your document list
    console.log('Files uploaded:', files);
  };

  const handleEditUploadedDocument = (file: File) => {
    // Convert uploaded file to Document format for editing
    const uploadedDocument: Document = {
      id: Math.random().toString(36).substr(2, 9),
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      type: file.type || 'Unknown',
      department: 'EDC Management',
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      status: 'pending',
      tags: [],
      collaborators: [],
      fileExtension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      description: `Uploaded file: ${file.name}`,
      isLocked: false,
      isPublic: false,
      securityLevel: 'internal'
    };
    
    setEditingDocument(uploadedDocument);
    setEditModalOpen(true);
    setUploadModalOpen(false); // Close upload modal when opening edit modal
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    // Here you would typically update the document in your backend/database
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  const handleAcknowledge = (documentId: string) => {
    console.log('Document acknowledged:', documentId);
    alert(`Document "${selectedDocument?.title}" has been acknowledged`);
  };

  const handleApprove = (documentId: string) => {
    console.log('Document approved:', documentId);
    alert(`Document "${selectedDocument?.title}" has been approved`);
  };

  // Filter sections based on search query
  const filteredSections = edcSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl lg:px-8">
      {/* Header Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  EDC (Edarat Data Center)
                </h1>
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="glass-button-icon"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full z-50 mt-2 w-60 rounded-lg shadow-lg glass-panel"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          console.log('Recent Visited clicked');
                        }}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span>Recently Visited</span>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                          8
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          
                        }}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center text-left space-x-3">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending for Approval</span>
                        </div>
                        <span className="px-2 py-1 text-xs text-orange-600 bg-orange-100 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                          3
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="w-96">
              <SearchBar
                onSearch={(query, filters) => {
                  setSearchQuery(query);
                }}
                onShowAllResults={onShowAllResults || (() => {})}
                onDocumentClick={(doc) => handleDocumentClick(doc as any)}
                documents={mockDocuments}
                placeholder="Search"
              />
            </div>
            
            <motion.button
              onClick={() => setUploadModalOpen(true)}
              className="glass-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload className="w-4 h-4" />
              <span>Upload New</span>
            </motion.button>
            
            <motion.button
              onClick={() => setNewCardModalOpen(true)}
              className="glass-button-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Subject</span>
            </motion.button>
          </div>
        </div>

      </motion.div>

      {/* EDC Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <AnimatePresence>
          {filteredSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <EDCCard
                section={section}
                onShowAll={() => onNavigateToDocsDB()}
                onDocumentClick={handleDocumentClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* New Card Modal */}
      <NewCardModal
        isOpen={newCardModalOpen}
        onClose={() => setNewCardModalOpen(false)}
        onAdd={handleAddNewCard}
      />

      <DocumentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
        }}
        document={selectedDocument}
        onEdit={(document) => {
          setPreviewModalOpen(false);
          setSelectedDocument(null);
          setEditingDocument(document);
          setEditModalOpen(true);
        }}
        user={{
          id: '1',
          name: 'Current User',
          email: 'user@example.com',
          role: 'admin'
        }}
        onAcknowledge={handleAcknowledge}
        onApprove={handleApprove}
      />

      <DocumentEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        document={editingDocument}
        onSave={handleSaveDocument}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        onEditDocument={handleEditUploadedDocument}
      />

      <Toaster
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
