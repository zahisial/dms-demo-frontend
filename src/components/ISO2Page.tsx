import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Search, Clock, CheckCircle, Upload } from 'lucide-react';
import { mockISO2Sections, type ISO2Section, type ISO2Document } from '../data/mockData';
import ISO2Card from './ISO2Card';
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

interface ISO2PageProps {
  onNavigateToDocsDB: (subjectTitle?: string) => void;
  onShowAllResults?: (query: string) => void;
  sections?: ISO2Section[];
  onUpdateSections?: (sections: ISO2Section[]) => void;
}

export default function ISO2Page({ onNavigateToDocsDB, onShowAllResults, sections: propSections, onUpdateSections }: ISO2PageProps) {
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
  
  // Use centralized ISO2 sections data from props or local state
  const [localSections, setLocalSections] = useState<ISO2Section[]>(mockISO2Sections);
  const iso2Sections = propSections || localSections;
  const setIso2Sections = onUpdateSections || ((sections: ISO2Section[] | ((prev: ISO2Section[]) => ISO2Section[])) => {
    if (typeof sections === 'function') {
      setLocalSections(sections);
    } else {
      setLocalSections(sections);
    }
  });

  const handleAddNewCard = (card: { title: string; color: string; icon: string }) => {
    const newSection: ISO2Section = {
      id: Date.now().toString(),
      title: card.title,
      color: card.color,
      documents: []
    };
    setIso2Sections(prev => [...prev, newSection]);
  };

  const handleDocumentClick = (document: ISO2Document) => {
    console.log('ISO2Page: Document clicked:', document.title);
    // Convert ISO2Document to Document format for view
    const viewDocument: Document = {
      id: document.id,
      title: document.title,
      type: document.type as any,
      fileType: 'pdf' as any,
      fileSize: '1.2 MB',
      department: 'ISO Management',
      uploadedBy: 'System Admin',
      uploadedAt: new Date(),
      lastModified: new Date(),
      accessType: 'public',
      approvalStatus: 'approved',
      tags: ['ISO', 'Management', 'Quality'],
      description: `${document.title} - ISO management system document`,
      url: '#'
    };
    
    console.log('ISO2Page: Opening DocumentPreviewModal for:', viewDocument.title);
    setSelectedDocument(viewDocument);
    setPreviewModalOpen(true);
  };

  const handleUploadComplete = (files: File[], subject: string) => {
    // Find the section that matches the subject
    const targetSection = iso2Sections.find(section => section.title === subject);
    
    if (targetSection) {
      // Create new documents from uploaded files
      const newDocuments: ISO2Document[] = files.map((file, index) => ({
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
      const updatedSections = iso2Sections.map(section => 
        section.id === targetSection.id 
          ? { ...section, documents: [...section.documents, ...newDocuments] }
          : section
      );

      // Update the sections state
      setIso2Sections(updatedSections);

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
      department: 'ISO Management',
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
  const pendingApprovalCount = iso2Sections.reduce((count, section) => count + section.documents.length, 0);

  // Filter sections based on search query
  const filteredSections = iso2Sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  ISO 9001
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
                    className="absolute top-full left-0 mt-2 w-60 glass-panel rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          console.log('Recent Visited clicked');
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span>Recently Visited</span>
                        </div>
                        {recentlyVisitedCount > 0 && (
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                            {recentlyVisitedCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center text-left space-x-3">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending for Approval</span>
                        </div>
                        {pendingApprovalCount > 0 && (
                          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
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

      {/* ISO2 Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              <ISO2Card
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
        iso2Sections={iso2Sections}
      />

      <Toaster
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
