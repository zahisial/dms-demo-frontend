import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockCESections, type CESection, type CEDocument, mockUsers } from '../data/mockData';
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  CheckCircle, 
  Upload, 
  Shield,
  Check,
  Bell,
  Trash2,
  Download,
  Share2,
  Edit3,
  Eye,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import NewCardModal from './NewSubjectModal';
import DocumentEditModal from './DocumentEditModal';
import UploadModal from './UploadModal';
import Toaster, { useToaster } from './Toaster';
import PermissionDeniedModal from './PermissionDeniedModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import SearchBar from './SearchBar';
import UniversalDocumentsTable from './UniversalDocumentsTable';
import { isoCardDocumentsColumns, isoCardDocumentsColumnsWithSubject } from './tableConfigs';
import { mockDocuments } from '../data/mockData';
import { Document } from '../types';
import ISO9000Card from './ISO9000Card';

interface CEPageProps {
  onNavigateToDocsDB?: (subjectTitle?: string) => void;
  onShowAllResults?: (query: string) => void;
  onDocumentClick?: (document: Document) => void;
  sections?: CESection[];
  onUpdateSections?: (sections: CESection[]) => void;
}

export default function CEPage({ onNavigateToDocsDB, onShowAllResults, onDocumentClick, sections: propSections, onUpdateSections }: CEPageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSubject, setUploadSubject] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<CESection | null>(null);
  const [showTableView, setShowTableView] = useState(false);
  const [tableViewType, setTableViewType] = useState<'section' | 'recent' | 'pending'>('section');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [recentlyViewedDocs, setRecentlyViewedDocs] = useState<Set<string>>(new Set());
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const { toasts, removeToast, showSuccess } = useToaster();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [permissionDeniedModalOpen, setPermissionDeniedModalOpen] = useState(false);
  const [permissionDeniedInfo, setPermissionDeniedInfo] = useState<{
    documentTitle: string;
    assignedTo?: string;
    action: 'edit' | 'delete' | 'mark-status';
  } | null>(null);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

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

  // Use centralized CE sections data from props or local state
  const [localSections, setLocalSections] = useState<CESection[]>(mockCESections);
  const ceSections = propSections || localSections;
  const setCESections = onUpdateSections || ((sections: CESection[] | ((prev: CESection[]) => CESection[])) => {
    if (typeof sections === 'function') {
      setLocalSections(sections);
    } else {
      setLocalSections(sections);
    }
  });

  const handleAddNewCard = (card: { title: string; color: string; icon: string }) => {
    const newSection: CESection = {
      id: Date.now().toString(),
      title: card.title,
      color: card.color,
      icon: Shield, // Default icon
      documents: []
    };
    setCESections((prev: CESection[]) => [...prev, newSection]);
  };

  const handleDocumentClick = (document: CEDocument | Document) => {
    console.log('CEPage: Document clicked:', document.title);
    // Track as recently viewed
    setRecentlyViewedDocs(prev => new Set([...prev, document.id]));
    // Navigate to document detail page
    if (onDocumentClick) {
      onDocumentClick(document as Document);
    }
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    // Check if admin can edit this document (only if assigned to them)
    const currentUser = {
      id: '1',
      name: 'Sarah Johnson',
      email: 'fms-admin@edaratgroup.com',
      role: 'admin' as const,
      department: 'Information Technology'
    };
    
    if (currentUser.role === 'admin' && document.assignedTo !== currentUser.id) {
      // Show permission denied for documents not assigned to this admin
      alert(`You don't have permission to edit this document. It's assigned to another user.`);
      return;
    }
    
    // Open the edit modal instead of navigating to detail page
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
    showSuccess('Download', `Downloading "${document.title}"` , 3000);
  };

  const handleShare = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Sharing document:', document.title);
    navigator.clipboard.writeText(window.location.href + `?doc=${document.id}`);
    showSuccess('Link Copied', `Link for "${document.title}" copied to clipboard!`, 3000);
  };

  const handleDelete = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(document);
    setDeleteConfirmationModalOpen(true);
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
    // Remove selected docs from state
    setCESections(prev => prev.map(section => ({
      ...section,
      documents: section.documents.filter((doc: any) => !selectedDocuments.has(doc.id))
    })) as any);

    console.log('Bulk deleting documents:', Array.from(selectedDocuments));
    showSuccess('Documents Deleted', `${count} document${count > 1 ? 's' : ''} deleted successfully!`, 3000);
    setSelectedDocuments(new Set());
  };

  const handleBulkReminder = () => {
    const count = selectedDocuments.size;
    console.log('Sending bulk reminders for documents:', Array.from(selectedDocuments));
    showSuccess('Reminders Sent', `Reminders sent for ${count} pending document${count > 1 ? 's' : ''}!`, 3000);
    setSelectedDocuments(new Set());
  };

  // Handle card click to show table view
  const handleCardClick = (section: CESection) => {
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
    if (showTableView && selectedSection && tableViewType === 'section') {
      setTableViewType('recent');
    } else {
      setTableViewType('recent');
      setShowTableView(true);
      setSelectedSection(null);
    }
    setShowDropdown(false);
  };

  // Show pending documents
  const handleShowPendingApprovals = () => {
    if (showTableView && selectedSection && tableViewType === 'section') {
      setTableViewType('pending');
    } else {
      setTableViewType('pending');
      setShowTableView(true);
      setSelectedSection(null);
    }
    setShowDropdown(false);
  };

  // Get all documents from all sections
  const getAllDocuments = () => {
    return ceSections.flatMap(section => 
      section.documents.map(doc => ({
        ...doc,
        sectionTitle: section.title
      }))
    );
  };

  // Get recently viewed documents
  const getRecentlyViewedDocuments = () => {
    if (selectedSection && tableViewType === 'section') {
      return selectedSection.documents.filter(doc => recentlyViewedDocs.has(doc.id));
    }
    const allDocs = getAllDocuments();
    return allDocs.filter(doc => recentlyViewedDocs.has(doc.id));
  };

  // Get pending documents
  const getPendingDocuments = () => {
    if (selectedSection && tableViewType === 'section') {
      return selectedSection.documents.filter(doc => doc.approvalStatus === 'pending');
    }
    const allDocs = getAllDocuments();
    return allDocs.filter(doc => doc.approvalStatus === 'pending');
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort documents with memoization
  const sortedDocuments = useMemo(() => {
    let docsToSort: any[] = [];
    
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
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'uploadedAt':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
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
        case 'uploadedBy':
          comparison = a.uploadedBy.localeCompare(b.uploadedBy);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [selectedSection?.documents, sortBy, sortOrder, tableViewType, recentlyViewedDocs, ceSections]);

  const handleCardUpload = (sectionTitle: string) => {
    setUploadSubject(sectionTitle);
    setUploadModalOpen(true);
  };

  // Filter sections based on search query
  const filteredSections = ceSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  console.log('CEPage - Total CE Sections:', ceSections.length);
  console.log('CEPage - Filtered Sections:', filteredSections.length);
  console.log('CEPage - Show Table View:', showTableView);

  const handleAcknowledge = (documentId: string) => {
    console.log('Document acknowledged:', documentId);
    alert(`Document "${selectedDocument?.title}" has been acknowledged`);
  };

  const handleApprove = (documentId: string) => {
    console.log('Document approved:', documentId);
    alert(`Document "${selectedDocument?.title}" has been approved`);
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      console.log('Deleting document:', documentToDelete.title);
      // Remove from CE sections state
      setCESections(prev => prev.map(section => ({
        ...section,
        documents: section.documents.filter((doc: any) => doc.id !== documentToDelete.id)
      })) as any);

      showSuccess('Document Deleted', `"${documentToDelete.title}" has been deleted successfully.`, 3000);
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
              CE (Cyber Security)
            </h1>
          </div>
          
          {/* Only show header buttons when sections exist */}
          {ceSections.length > 0 && (
            <div className="flex space-x-3 items-right">
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
              <div className="w-96">
             
              </div>
            </div>
          )}
          </div>

      </motion.div>

      {/* Conditional Rendering: Empty State, Cards View, or Table View */}
      {!showTableView ? (
        <>
          {/* Show Empty State if no sections */}
          {ceSections.length === 0 ? (
            <>
              {/* Empty State with World-Class UX */}
              <motion.div 
                className="flex flex-col justify-center items-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Shield Icon with Primary Accent */}
                <div className="relative mb-8">
                  <div className="flex justify-center items-center mb-4 w-24 h-24 bg-gradient-to-br rounded-full from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20">
                    <Shield className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                  </div>
                  {/* Floating accent dots */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full opacity-60 animate-pulse bg-primary-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full opacity-40 animate-pulse bg-primary-400" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Main Message */}
                <div className="mx-auto mb-8 max-w-2xl text-center">
                  <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
                    No Cyber Security Documents Yet
                  </h2>
                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">
                    Start building your cyber security knowledge base by uploading documents or creating new security topics.
                  </p>
                </div>

                {/* Action Cards */}
                <div className="gap-6 mb-8 w-full max-w-4xl">
                  {/* Upload Card */}
                 

                  {/* Create Subject Card */}
                  <motion.div
                    className="justify-center p-8 text-center rounded-2xl transition-all duration-300 cursor-pointer glass-panel hover:shadow-lg group"
                    whileHover={{ scale: 1.02, y: -4, justifyContent: 'center' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNewCardModalOpen(true)}
                  >
                    <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-br rounded-full transition-transform duration-300 from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20 group-hover:scale-110">
                      <Plus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
                      Create New Subject
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      Organize your security documents into structured topics
                    </p>
                    <div className="flex justify-center items-center transition-colors text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
                      <span className="text-sm font-medium">Create Subject</span>
                      <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* CE Cards Grid */}
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
                        section={section as any}
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
          )}
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
                        {(() => {
                          const selectedDocs = sortedDocuments.filter(doc => selectedDocuments.has(doc.id));
                          const hasPending = selectedDocs.some(doc => doc.approvalStatus === 'pending');
                          
                          return (
                            <>
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
                id: '1',
                name: 'Sarah Johnson',
                email: 'fms-admin@edaratgroup.com',
                role: 'admin',
                department: 'Information Technology'
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
        document={editingDocument as any}
        onSave={handleSaveDocument as any}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setUploadSubject('');
        }}
        onUploadComplete={(files, subject) => {
          const targetSection = ceSections.find(section => section.title === subject);
          
          if (targetSection) {
            const newDocuments: CEDocument[] = files.map((file, index) => ({
              id: `ce-uploaded-${Date.now()}-${index}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              type: 'Manual',
              fileType: file.type.split('/')[1] || 'pdf',
              fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
              department: targetSection.title,
              uploadedBy: 'Sarah Johnson',
              uploadedAt: new Date(),
              lastModified: new Date(),
              accessType: 'public',
              approvalStatus: 'pending',
              tags: ['CE', 'Cyber Security', targetSection.title],
              description: `Uploaded file: ${file.name}`,
              url: URL.createObjectURL(file),
              securityLevel: 'Public',
              assignedTo: '1',
              assignedDate: new Date(),
              approver: {
                id: '1',
                name: 'Sarah Johnson',
                title: 'IT Administrator',
                email: 'fms-admin@edaratgroup.com',
                avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1',
                approved: false
              }
            }));

            const updatedSections = ceSections.map(section => 
              section.id === targetSection.id 
                ? { ...section, documents: [...section.documents, ...newDocuments] }
                : section
            );

            setCESections(updatedSections);

            showSuccess(
              'Upload Successful', 
              `${files.length} file${files.length > 1 ? 's' : ''} uploaded to ${subject}. Documents are now visible in the card.`, 
              6000
            );
          }
        }}
        onEditDocument={(file) => {
          console.log('Edit uploaded file:', file.name);
        }}
        initialSubject={uploadSubject}
        ceSections={ceSections}
      />

      <Toaster
        toasts={toasts}
        removeToast={removeToast}
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
