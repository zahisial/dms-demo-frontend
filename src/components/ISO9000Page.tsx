import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockISO9000Sections, type ISO9000Section, type ISO9000Document } from '../data/mockData';
import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  Clock, 
  CheckCircle, 
  Upload, 
  Award, 
  FileText, 
  Users, 
  Shield, 
  Heart, 
  TrendingUp,
  Folder,
  Settings,
  Database,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Zap,
  Target,
  Briefcase,
  Home,
  Building,
  Globe,
  Lock,
  Key,
  Camera,
  Image,
  Music,
  Video,
  Download,
  Share2,
  Edit3,
  Save,
  Filter,
  Eye,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  MessageCircle,
  Bell,
  User,
  Users2
} from 'lucide-react';
import ISO9000Card from './ISO9000Card';
import NewCardModal from './NewCardModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';
import UploadModal from './UploadModal';
import Toaster, { useToaster } from './Toaster';
import SearchBar from './SearchBar';
import UniversalDocumentsTable from './UniversalDocumentsTable';
import { isoCardDocumentsColumns } from './tableConfigs';
import { mockDocuments } from '../data/mockData';
import { ArrowLeft } from 'lucide-react';

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

interface ISO9000PageProps {
  onNavigateToDocsDB: (subjectTitle?: string) => void;
  onNavigateToPendingApprovals?: () => void;
  onShowAllResults?: (query: string) => void;
  sections?: ISO9000Section[];
  onUpdateSections?: (sections: ISO9000Section[]) => void;
}

export default function ISO9000Page({ onNavigateToDocsDB, onNavigateToPendingApprovals, onShowAllResults, sections: propSections, onUpdateSections }: ISO9000PageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<ISO9000Section | null>(null);
  const [showTableView, setShowTableView] = useState(false);
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
  
  // Use centralized ISO9000 sections data from props or local state
  const [localSections, setLocalSections] = useState<ISO9000Section[]>(mockISO9000Sections);
  const iso9000Sections = propSections || localSections;
  const setIso9000Sections = onUpdateSections || ((sections: ISO9000Section[] | ((prev: ISO9000Section[]) => ISO9000Section[])) => {
    if (typeof sections === 'function') {
      setLocalSections(sections);
    } else {
      setLocalSections(sections);
    }
  });

  const handleAddNewCard = (card: { title: string; color: string; icon: string }) => {
    // Import the icon component dynamically based on the icon name
    const getIconComponent = (iconName: string) => {
      const iconMap: { [key: string]: any } = {
        'FileText': FileText,
        'Folder': Folder,
        'Users': Users,
        'Settings': Settings,
        'Shield': Shield,
        'Database': Database,
        'BarChart3': BarChart3,
        'Calendar': Calendar,
        'Mail': Mail,
        'Phone': Phone,
        'MapPin': MapPin,
        'Clock': Clock,
        'Star': Star,
        'Heart': Heart,
        'Zap': Zap,
        'Target': Target,
        'Award': Award,
        'Briefcase': Briefcase,
        'Home': Home,
        'Building': Building,
        'Globe': Globe,
        'Lock': Lock,
        'Key': Key,
        'Camera': Camera,
        'Image': Image,
        'Music': Music,
        'Video': Video,
        'Download': Download,
        'Upload': Upload,
        'Share2': Share2,
        'Edit3': Edit3,
        'Save': Save,
        'Search': Search,
        'Filter': Filter,
        'Eye': Eye,
        'Check': Check,
        'AlertCircle': AlertCircle,
        'Info': Info,
        'HelpCircle': HelpCircle,
        'MessageCircle': MessageCircle,
        'Bell': Bell,
        'User': User,
        'Users2': Users2,
      };
      return iconMap[iconName] || Award;
    };

    const newSection: ISO9000Section = {
      id: Date.now().toString(),
      title: card.title,
      color: card.color,
      icon: getIconComponent(card.icon),
      documents: []
    };
    setIso9000Sections(prev => [...prev, newSection]);
  };

  // Convert ISO9000Document to Document format
  const convertToDocument = (isoDoc: ISO9000Document, sectionTitle: string): Document => {
    return {
      id: isoDoc.id,
      title: isoDoc.title,
      type: isoDoc.type as any,
      fileType: 'pdf' as any,
      fileSize: '1.2 MB',
      department: sectionTitle,
      uploadedBy: isoDoc.uploadedBy || 'System Admin',
      uploadedAt: isoDoc.uploadedAt ? new Date(isoDoc.uploadedAt) : new Date(),
      lastModified: new Date(),
      accessType: 'public',
      approvalStatus: 'approved',
      tags: ['ISO9000', 'Quality', sectionTitle],
      description: `${isoDoc.title} - ISO9000 quality management document`,
      url: isoDoc.url || '#',
      securityLevel: isoDoc.securityLevel || 'Public'
    };
  };

  const handleDocumentClick = (document: ISO9000Document) => {
    console.log('ISO9000Page: Document clicked:', document.title);
    const viewDocument = convertToDocument(document, selectedSection?.title || 'ISO9000 Management');
    
    console.log('ISO9000Page: Opening DocumentPreviewModal for:', viewDocument.title);
    setSelectedDocument(viewDocument);
    setPreviewModalOpen(true);
  };

  // Handle card click to show table view
  const handleCardClick = (section: ISO9000Section) => {
    setSelectedSection(section);
    setShowTableView(true);
  };

  // Handle back from table view
  const handleBackToCards = () => {
    setShowTableView(false);
    setSelectedSection(null);
  };

  const handleUploadComplete = (files: File[], subject: string) => {
    // Find the section that matches the subject
    const targetSection = iso9000Sections.find(section => section.title === subject);
    
    if (targetSection) {
      // Create new documents from uploaded files
      const newDocuments: ISO9000Document[] = files.map((file, index) => ({
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
      const updatedSections = iso9000Sections.map(section => 
        section.id === targetSection.id 
          ? { ...section, documents: [...section.documents, ...newDocuments] }
          : section
      );

      // Update the sections state
      setIso9000Sections(updatedSections);

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
      department: 'ISO9000 Management',
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

  // Filter sections based on search query
  // Calculate dynamic counts
  const recentlyVisitedCount = 0; // TODO: Track document views
  const pendingApprovalCount = iso9000Sections.reduce((count, section) => {
    return count + section.documents.filter(doc => doc.securityLevel === 'Top Secret' || doc.securityLevel === 'Confidential').length;
  }, 0);

  const filteredSections = iso9000Sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="px-4 py-8 mx-auto max-w-8xl lg:px-8">
      {/* Header Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              ISO
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 3 Dots Menu */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                className="glass-button-icon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </motion.button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg shadow-lg glass-panel"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span>Recently Visited</span>
                        </div>
                        {recentlyVisitedCount > 0 && (
                        <span className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full dark:bg-gray-900/30 dark:text-gray-400">
                            {recentlyVisitedCount}
                        </span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          if (onNavigateToPendingApprovals) {
                            onNavigateToPendingApprovals();
                          }
                        }}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending for Approval</span>
                        </div>
                        {pendingApprovalCount > 0 && (
                        <span className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full dark:bg-red-900/30 dark:text-gray-400">
                            {pendingApprovalCount}
                        </span>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          </div>
        </div>

      </motion.div>

      {/* Conditional Rendering: Cards View or Table View */}
      {!showTableView ? (
        <>
          {/* ISO9000 Cards Grid */}
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
                  <ISO9000Card
                    section={section}
                    onShowAll={() => handleCardClick(section)}
                    onDocumentClick={handleDocumentClick}
                    onUpload={handleCardUpload}
                    onCardClick={() => handleCardClick(section)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      ) : (
        <>
          {/* Table View for Selected Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button and Section Title */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleBackToCards}
                  className="glass-button-icon"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedSection?.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedSection?.documents.length} document{selectedSection?.documents.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Universal Table */}
            <UniversalDocumentsTable
              documents={selectedSection?.documents.map(doc => convertToDocument(doc, selectedSection.title)) || []}
              columns={isoCardDocumentsColumns}
              showCheckbox={false}
              showActions={true}
              onDocumentClick={(doc) => handleDocumentClick(doc as any)}
              onView={(doc) => {
                const viewDocument = convertToDocument(doc as any, selectedSection?.title || '');
                setSelectedDocument(viewDocument);
                setPreviewModalOpen(true);
              }}
            />
          </motion.div>
        </>
      )}

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
        document={selectedDocument as any}
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
        document={editingDocument as any}
        onSave={handleSaveDocument as any}
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
        iso9000Sections={iso9000Sections}
      />

      <Toaster
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
    
  );
}
