import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockISO9000Sections, type ISO9000Section, type ISO9000Document } from '../data/mockData';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  Upload, 
  Award, 
  FileText, 
  Users, 
  Shield, 
  Heart, 
  Check,
  Bell,
  Trash2,
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
  AlertCircle,
  Info,
  HelpCircle,
  MessageCircle,
  User,
  Users2,
  ArrowLeft
} from 'lucide-react';
import ISO9000Card from './ISO9000Card';
import NewCardModal from './NewCardModal';
import DocumentEditModal from './DocumentEditModal';
import UploadModal from './UploadModal';
import Toaster, { useToaster } from './Toaster';
import SearchBar from './SearchBar';
import UniversalDocumentsTable from './UniversalDocumentsTable';
import { isoCardDocumentsColumns, isoCardDocumentsColumnsWithSubject } from './tableConfigs';
import { mockDocuments } from '../data/mockData';
import { Document } from '../types';

interface ISO9000PageProps {
  onDocumentClick?: (document: Document) => void;
  sections?: ISO9000Section[];
  onUpdateSections?: (sections: ISO9000Section[]) => void;
}

export default function ISO9000Page({ onDocumentClick, sections: propSections, onUpdateSections }: ISO9000PageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<ISO9000Section | null>(null);
  const [showTableView, setShowTableView] = useState(false);
  const [tableViewType, setTableViewType] = useState<'section' | 'recent' | 'pending'>('section');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [recentlyViewedDocs, setRecentlyViewedDocs] = useState<Set<string>>(new Set());
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
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
      setLocalSections(sections as ISO9000Section[]);
    } else {
      setLocalSections(sections);
    }
  });

  const handleAddNewCard = (card: { title: string; color: string; icon: string }) => {
    // Import the icon component dynamically based on the icon name
    const getIconComponent = (iconName: string) => {
      const iconMap: { [key: string]: React.ComponentType<{ className?: string; size?: number }> } = {
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
    setIso9000Sections((prev: ISO9000Section[]) => [...prev, newSection]);
  };

  const handleDocumentClick = (document: ISO9000Document | Document) => {
    console.log('ISO9000Page: Document clicked:', document.title);
    // Track as recently viewed
    setRecentlyViewedDocs(prev => new Set([...prev, document.id]));
    // Navigate to document detail page
    if (onDocumentClick) {
      onDocumentClick(document as Document);
    }
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDocument(document);
    setEditModalOpen(true);
  };

  const handleView = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    // Track as recently viewed
    setRecentlyViewedDocs(prev => new Set([...prev, document.id]));
    // Navigate to document detail page
    if (onDocumentClick) {
      onDocumentClick(document);
    }
  };

  const handleDownload = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Downloading document:', document.title);
    alert(`Downloading "${document.title}"`);
    // Add download logic here
  };

  const handleShare = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Sharing document:', document.title);
    // Copy link to clipboard
    navigator.clipboard.writeText(window.location.href + `?doc=${document.id}`);
    showSuccess('Link Copied', `Link for "${document.title}" copied to clipboard!`, 3000);
  };

  const handleDelete = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
      console.log('Deleting document:', document.title);
      showSuccess('Document Deleted', `"${document.title}" has been deleted successfully.`, 3000);
      // Add delete logic here
    }
  };

  const handleReminder = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.approver) {
      console.log('Sending reminder to:', document.approver.name);
      showSuccess('Reminder Sent', `Reminder sent to ${document.approver.name} for "${document.title}"`, 3000);
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
    showSuccess('Documents Approved', `${count} document${count > 1 ? 's' : ''} approved successfully!`, 3000);
    setSelectedDocuments(new Set());
  };

  const handleBulkDelete = () => {
    const count = selectedDocuments.size;
    if (confirm(`Are you sure you want to delete ${count} selected document${count > 1 ? 's' : ''}?`)) {
      console.log('Bulk deleting documents:', Array.from(selectedDocuments));
      showSuccess('Documents Deleted', `${count} document${count > 1 ? 's' : ''} deleted successfully!`, 3000);
      setSelectedDocuments(new Set());
    }
  };

  const handleBulkReminder = () => {
    const count = selectedDocuments.size;
    console.log('Sending bulk reminders for documents:', Array.from(selectedDocuments));
    showSuccess('Reminders Sent', `Reminders sent for ${count} pending document${count > 1 ? 's' : ''}!`, 3000);
    setSelectedDocuments(new Set());
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
    setTableViewType('section');
  };

  // Show recently visited documents
  const handleShowRecentlyVisited = () => {
    // If we're already in table view with a section, switch to recent view for that section
    if (showTableView && selectedSection && tableViewType === 'section') {
      setTableViewType('recent');
    } else {
      // Otherwise show all recent documents
      setTableViewType('recent');
      setShowTableView(true);
      setSelectedSection(null);
    }
    setShowDropdown(false);
  };

  // Show pending documents
  const handleShowPendingApprovals = () => {
    // If we're already in table view with a section, switch to pending view for that section
    if (showTableView && selectedSection && tableViewType === 'section') {
      setTableViewType('pending');
    } else {
      // Otherwise show all pending documents
      setTableViewType('pending');
      setShowTableView(true);
      setSelectedSection(null);
    }
    setShowDropdown(false);
  };

  // Get all documents from all sections
  const getAllDocuments = () => {
    return iso9000Sections.flatMap(section => 
      section.documents.map(doc => ({
        ...doc,
        sectionTitle: section.title
      }))
    );
  };

  // Get recently viewed documents (last day)
  const getRecentlyViewedDocuments = useCallback(() => {
    // If viewing from a specific section, only show that section's recent docs
    if (selectedSection && tableViewType === 'section') {
      return selectedSection.documents.filter(doc => recentlyViewedDocs.has(doc.id));
    }
    // Otherwise show all recent docs
    const allDocs = getAllDocuments();
    return allDocs.filter(doc => recentlyViewedDocs.has(doc.id));
  }, [selectedSection, tableViewType, recentlyViewedDocs, iso9000Sections]);

  // Get pending documents
  const getPendingDocuments = useCallback(() => {
    // If viewing from a specific section, only show that section's pending docs
    if (selectedSection && tableViewType === 'section') {
      return selectedSection.documents.filter(doc => doc.approvalStatus === 'pending');
    }
    // Otherwise show all pending docs
    const allDocs = getAllDocuments();
    return allDocs.filter(doc => doc.approvalStatus === 'pending');
  }, [selectedSection, tableViewType, iso9000Sections]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort documents with memoization
  const sortedDocuments = useMemo(() => {
    let docsToSort: (ISO9000Document | Document)[] = [];
    
    // Determine which documents to show based on view type
    if (tableViewType === 'recent') {
      docsToSort = getRecentlyViewedDocuments();
    } else if (tableViewType === 'pending') {
      docsToSort = getPendingDocuments();
    } else if (selectedSection?.documents) {
      docsToSort = [...selectedSection.documents];
    }
    
    return docsToSort.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title': {
          comparison = a.title.localeCompare(b.title);
          break;
        }
        case 'uploadedAt': {
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        }
        case 'status': {
          comparison = a.approvalStatus.localeCompare(b.approvalStatus);
          break;
        }
        case 'securityLevel': {
          const securityOrder = { 'Public': 1, 'Restricted': 2, 'Confidential': 3, 'Top Secret': 4 };
          const aSecurity = a.securityLevel || 'Public';
          const bSecurity = b.securityLevel || 'Public';
          comparison = (securityOrder[aSecurity as keyof typeof securityOrder] || 1) - (securityOrder[bSecurity as keyof typeof securityOrder] || 1);
          break;
        }
        case 'uploadedBy': {
          comparison = a.uploadedBy.localeCompare(b.uploadedBy);
          break;
        }
        default: {
          comparison = 0;
        }
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedSection?.documents, sortBy, sortOrder, tableViewType, recentlyViewedDocs, iso9000Sections, getRecentlyViewedDocuments, getPendingDocuments]);

  const handleUploadComplete = (files: File[], subject: string) => {
    // Find the section that matches the subject
    const targetSection = iso9000Sections.find(section => section.title === subject);
    
    if (targetSection) {
      // Create new documents with COMPLETE structure
      const newDocuments: ISO9000Document[] = files.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        type: 'Manual',
        fileType: file.type.split('/')[1] || 'pdf',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        department: targetSection.title,
        uploadedBy: 'ISO Administrator',
        uploadedAt: new Date(),
        lastModified: new Date(),
        accessType: 'public',
        approvalStatus: 'pending',
        tags: ['ISO9000', targetSection.title, 'Uploaded'],
        description: `Uploaded file: ${file.name}`,
        url: URL.createObjectURL(file), // Create temporary URL for preview
        securityLevel: 'Public',
        assignedTo: '4', // Assign to ISO Administrator
        assignedDate: new Date(),
        approver: {
          id: '4',
          name: 'ISO Administrator',
          title: 'Quality Manager',
          email: 'admini_iso@edaratgroup.com',
          avatar: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
          approved: false
        }
      }));

      // Update the section with new documents
      const updatedSections = iso9000Sections.map((section: ISO9000Section) => 
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
      uploadedAt: new Date(),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      status: 'pending',
      tags: [],
      collaborators: [],
      fileExtension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      description: `Uploaded file: ${file.name}`,
      isLocked: false,
      isPublic: false,
      securityLevel: 'Public'
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


  const handleCardUpload = (sectionTitle: string) => {
    setUploadSubject(sectionTitle);
    setUploadModalOpen(true);
  };

  // Filter sections based on search query

  const filteredSections = iso9000Sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="px-4 py-8 mx-auto max-w-8xl lg:px-8">
      {/* Header Section - Always visible */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              ISO 9001
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 3 Dots Menu */}
            <div className="relative" ref={dropdownRef}>
             
              
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
                        onClick={handleShowRecentlyVisited}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span>Recently Visited{selectedSection && showTableView ? ` - ${selectedSection.title}` : ''}</span>
                        </div>
                        {getRecentlyViewedDocuments().length > 0 && (
                        <span className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full dark:bg-gray-900/30 dark:text-gray-400">
                            {getRecentlyViewedDocuments().length}
                        </span>
                        )}
                      </button>
                      <button
                        onClick={handleShowPendingApprovals}
                        className="flex justify-between items-center px-4 py-2 w-full text-sm text-gray-700 transition-colors dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending for Approval{selectedSection && showTableView ? ` - ${selectedSection.title}` : ''}</span>
                        </div>
                        {getPendingDocuments().length > 0 && (
                        <span className="px-2 py-1 text-xs font-bold text-gray-600 bg-gray-100 rounded-full dark:bg-red-900/30 dark:text-gray-400">
                            {getPendingDocuments().length}
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
            <div className="flex justify-between items-center mb-6">
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
                    {tableViewType === 'recent' ? `Recently Visited ${selectedSection ? `- ${selectedSection.title}` : ''}` : 
                     tableViewType === 'pending' ? `Pending for Approval ${selectedSection ? `- ${selectedSection.title}` : ''}` : 
                     selectedSection?.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {sortedDocuments.length} document{sortedDocuments.length !== 1 ? 's' : ''}{selectedSection && tableViewType !== 'section' ? ` from this section` : ''}
                  </p>
                </div>
              </div>
            </div>

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
                        {/* Check if any selected documents are pending */}
                        {(() => {
                          const selectedDocs = sortedDocuments.filter(doc => selectedDocuments.has(doc.id));
                          const hasPending = selectedDocs.some(doc => doc.approvalStatus === 'pending');
                          
                          return (
                            <>
                              {/* Bulk Approve - only if has pending docs */}
                              {hasPending && (
                                <motion.button
                                  onClick={handleBulkApprove}
                                  className="text-green-600 glass-button hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Approve</span>
                                </motion.button>
                              )}

                              {/* Bulk Reminder - only if has pending docs */}
                              {hasPending && (
                                <motion.button
                                  onClick={handleBulkReminder}
                                  className="text-orange-600 glass-button hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-200"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Bell className="w-4 h-4" />
                                  <span>Send Reminder</span>
                                </motion.button>
                              )}
                              
                              {/* Bulk Delete - always show for admins */}
                              <motion.button
                                onClick={handleBulkDelete}
                                className="text-red-600 glass-button hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </motion.button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Universal Table */}
            <UniversalDocumentsTable
              documents={sortedDocuments as Document[]}
              columns={selectedSection ? isoCardDocumentsColumns : isoCardDocumentsColumnsWithSubject}
              user={{
                id: '4',
                name: 'ISO Administrator',
                email: 'admini_iso@edaratgroup.com',
                role: 'admin',
                department: 'Quality Management'
              }}
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
              onDocumentClick={(doc) => handleDocumentClick(doc)}
              onView={handleView}
              onEdit={handleEdit}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
              onReminder={handleReminder}
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
        iso9000Sections={iso9000Sections}
      />

      <Toaster
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
    
  );
}
