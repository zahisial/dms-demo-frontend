import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Search, Clock, CheckCircle, Upload } from 'lucide-react';
import { mockEDCSections, type EDCSection, type EDCDocument } from '../data/mockData';
import EDCCard from './EDCCard';
import NewCardModal from './NewCardModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';
import UploadModal from './UploadModal';
import Toaster, { useToaster } from './Toaster';
import SearchBar from './SearchBar';
import { mockDocuments } from '../data/mockData';

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

interface EDCPageProps {
  onNavigateToDocsDB: (subjectTitle?: string) => void;
  onShowAllResults?: (query: string) => void;
  sections?: EDCSection[];
  onUpdateSections?: (sections: EDCSection[]) => void;
}

export default function EDCPage({ onNavigateToDocsDB, onShowAllResults, sections: propSections, onUpdateSections }: EDCPageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState<string>('');
  const { toasts, removeToast, showSuccess } = useToaster();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  
  // Use centralized EDC sections data from props or local state
  const [localSections, setLocalSections] = useState<EDCSection[]>(mockEDCSections);
  const edcSections = propSections || localSections;
  const setEdcSections = onUpdateSections || ((sections: EDCSection[] | ((prev: EDCSection[]) => EDCSection[])) => {
    if (typeof sections === 'function') {
      setLocalSections(sections);
    } else {
      setLocalSections(sections);
    }
  });

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
    // Find the section that matches the subject
    const targetSection = edcSections.find(section => section.title === subject);
    
    if (targetSection) {
      // Create new documents from uploaded files
      const newDocuments: EDCDocument[] = files.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        type: 'Uploaded Document',
        url: URL.createObjectURL(file), // Create temporary URL for preview
        securityLevel: 'Public' as const,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'Current User', // You can get this from user context
        fileSize: file.size,
        fileType: file.type.split('/')[1] || 'unknown'
      }));

      // Update the section with new documents
      const updatedSections = edcSections.map(section => 
        section.id === targetSection.id 
          ? { ...section, documents: [...section.documents, ...newDocuments] }
          : section
      );

      // Update the sections state
      setEdcSections(updatedSections);

      // Show success notification
      showSuccess(
        'Upload Successful',
        `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully to ${subject}. Documents are now visible in the card.`,
        6000
      );
    } else {
      // Fallback if section not found
      showSuccess(
        'Upload Successful',
        `${files.length} file${files.length > 1 ? 's' : ''} uploaded successfully.`,
        6000
      );
    }
    
    console.log('Files uploaded to section:', subject, files);
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

  const handleCardUpload = (sectionTitle: string) => {
    setUploadSubject(sectionTitle);
    setUploadModalOpen(true);
  };

  // Calculate dynamic counts
  const recentlyVisitedCount = 0; // TODO: Track document views
  const pendingApprovalCount = edcSections.reduce((count, section) => {
    return count + section.documents.filter(doc => doc.securityLevel === 'Top Secret' || doc.securityLevel === 'Confidential').length;
  }, 0);

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
            <div className="relative" ref={dropdownRef}>
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
                        {recentlyVisitedCount > 0 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            {recentlyVisitedCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          
                        }}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending for Approval</span>
                        </div>
                        {pendingApprovalCount > 0 && (
                          <span className="px-2 py-1 text-xs text-orange-600 bg-orange-100 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                            {pendingApprovalCount}
                          </span>
                        )}
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
              onClick={() => {
                setUploadSubject('');
                setUploadModalOpen(true);
              }}
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
                onShowAll={() => onNavigateToDocsDB(section.title)}
                onDocumentClick={handleDocumentClick}
                onUpload={handleCardUpload}
                onCardClick={(sectionTitle) => onNavigateToDocsDB(sectionTitle)}
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
        onClose={() => {
          setUploadModalOpen(false);
          setUploadSubject('');
        }}
        onUploadComplete={handleUploadComplete}
        onEditDocument={handleEditUploadedDocument}
        initialSubject={uploadSubject}
        edcSections={edcSections}
      />

      <Toaster
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
