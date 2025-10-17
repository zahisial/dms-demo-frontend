import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDocuments } from '../data/mockData';
import { 
  ArrowLeft, 
  Filter, 
  Eye, 
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle,
  File,
  FileSpreadsheet,
  Trash2,
  Edit,
  Shield,
  Check,
  Download,
  Copy,
  Share,
  Flag,
  MessageCircle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import DocumentPreviewModal from './DocumentPreviewModal';
import DocumentEditModal from './DocumentEditModal';
import SearchBar from './SearchBar';
import DropdownMenu from './DropdownMenu';
import FeedbackModal from './FeedbackModal';
import { Document, User as UserType } from '../types';

interface DocsDBPageProps {
  onBack: () => void;
  user?: UserType | null;
  onShowAllResults?: (query: string) => void;
  onDocumentClick?: (document: Document) => void;
  subjectTitle?: string; // Add subject title prop
}

export default function DocsDBPage({ onBack, user, onShowAllResults, onDocumentClick, subjectTitle }: DocsDBPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSecurity, setSelectedSecurity] = useState('All');
  const [selectedFileExtension, setSelectedFileExtension] = useState('All');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedFilters, setExpandedFilters] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackDocument, setFeedbackDocument] = useState<Document | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject' | 'delete' | 'security' | null>(null);

  // Use centralized mock data
  const documents: Document[] = mockDocuments;



  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === 'All' || doc.type === selectedType;
      const matchesDepartment = selectedDepartment === 'All' || doc.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'All' || doc.approvalStatus === selectedStatus;
      const matchesSecurity = selectedSecurity === 'All' || doc.securityLevel === selectedSecurity || (selectedSecurity === 'internal' && !doc.securityLevel);
      const matchesFileExtension = selectedFileExtension === 'All' || doc.fileType.toLowerCase() === selectedFileExtension.toLowerCase();

      return matchesSearch && matchesType && matchesDepartment && matchesStatus && matchesSecurity && matchesFileExtension;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
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
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchQuery, selectedType, selectedDepartment, selectedStatus, selectedSecurity, selectedFileExtension, sortBy, sortOrder]);

  const handleDocumentClick = (document: Document) => {
    if (onDocumentClick) {
      onDocumentClick(document);
    } else {
      setSelectedDocument(document);
      setPreviewModalOpen(true);
    }
  };


  const handleView = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDocument(document);
    setPreviewModalOpen(true);
  };

  const handleAcknowledge = (documentId: string) => {
    console.log('Document acknowledged:', documentId);
    alert(`Document "${selectedDocument?.title}" has been acknowledged`);
  };

  const handleSendFeedback = (document: Document) => {
    setFeedbackDocument(document);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = (feedback: string) => {
    console.log('Feedback submitted for document:', feedbackDocument?.title, 'Feedback:', feedback);
    alert(`Feedback sent for "${feedbackDocument?.title}": ${feedback}`);
    setFeedbackModalOpen(false);
    setFeedbackDocument(null);
  };

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

  // Get sort icon for header
  const getSortIcon = (field: string) => {
    if (sortBy === field) {
      return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
    }
    return <ArrowUpDown className="w-3 h-3 opacity-50" />;
  };

  const handleFeedbackClose = () => {
    setFeedbackModalOpen(false);
    setFeedbackDocument(null);
  };

  // Generate dropdown items based on user role
  const getDropdownItems = (document: Document) => {
    const baseItems: any[] = [
      {
        id: 'view',
        label: 'View Details',
        icon: Eye,
        onClick: () => handleView(document, {} as React.MouseEvent)
      }
    ];

    // Add role-specific items
    if (user?.role === 'manager' || user?.role === 'admin') {
      baseItems.push({
        id: 'edit',
        label: 'Edit Document',
        icon: Edit,
        onClick: () => handleEdit(document, {} as React.MouseEvent)
      });
    }

    // Download - Only for admin users
    if (user?.role === 'admin') {
      baseItems.push({
        id: 'download',
        label: 'Download',
        icon: Download,
        onClick: () => {
          console.log('Downloading document:', document.title);
          alert(`Downloading "${document.title}"`);
        }
      });
    }

    // Copy Link - Available for all users
    baseItems.push({
      id: 'copy',
      label: 'Copy Link',
      icon: Copy,
      onClick: () => {
        console.log('Copying link for document:', document.title);
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    });

    // Share - Only for admin users
    if (user?.role === 'admin') {
      baseItems.push({
        id: 'share',
        label: 'Share',
        icon: Share,
        onClick: () => {
          console.log('Sharing document:', document.title);
          alert(`Sharing "${document.title}"`);
        }
      });
    }

    // Status marking - Only for managers and admins
    if (user?.role === 'manager' || user?.role === 'admin') {
      baseItems.push(
        { id: 'divider1', label: '', divider: true },
        {
          id: 'status',
          label: 'Mark Status',
          icon: Flag,
          submenu: [
            {
              id: 'approved',
              label: 'Mark as Approved',
              icon: CheckCircle,
              onClick: () => {
                console.log('Marking document as approved:', document.title);
                alert(`"${document.title}" marked as approved`);
              }
            },
            {
              id: 'pending',
              label: 'Mark as Pending',
              icon: Clock,
              onClick: () => {
                console.log('Marking document as pending:', document.title);
                alert(`"${document.title}" marked as pending`);
              }
            }
          ]
        }
      );
    }

    // Send Feedback - Only for managers
    if (user?.role === 'manager') {
      baseItems.push({
        id: 'feedback',
        label: 'Send Feedback',
        icon: MessageCircle,
        onClick: () => handleSendFeedback(document)
      });
    }


    // Delete - Only for admin users
    if (user?.role === 'admin') {
      baseItems.push(
        { id: 'divider1', label: '', divider: true },
        {
          id: 'delete',
          label: 'Delete',
          icon: Trash2,
          destructive: true,
          onClick: () => {
            console.log('Deleting document:', document.title);
            if (confirm(`Are you sure you want to delete "${document.title}"?`)) {
              alert(`"${document.title}" deleted`);
            }
          }
        }
      );
    }

    return baseItems;
  };

  const handleApprove = (documentId: string) => {
    console.log('Document approved:', documentId);
    alert(`Document "${selectedDocument?.title}" has been approved`);
  };

  const handleEdit = (document: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDocument(document);
    setEditModalOpen(true);
  };

  const handleSaveDocument = (updatedDocument: Document) => {
    console.log('Document updated:', updatedDocument);
    // Here you would typically update the document in your backend/database
    // For now, we'll just log the changes
    setEditModalOpen(false);
    setEditingDocument(null);
  };

  const handleDocumentSelect = (documentId: string, selected: boolean) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(documentId);
      } else {
        newSet.delete(documentId);
      }
      setShowBulkActions(newSet.size > 0);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredDocuments.map(doc => doc.id));
    setSelectedDocuments(allIds);
    setShowBulkActions(allIds.size > 0);
  };

  const handleDeselectAll = () => {
    setSelectedDocuments(new Set());
    setShowBulkActions(false);
    setBulkActionType(null);
  };

  const handleBulkAction = (actionType: 'approve' | 'reject' | 'delete' | 'security') => {
    setBulkActionType(actionType);
    console.log(`Bulk ${actionType} action on documents:`, Array.from(selectedDocuments));
    
    // Here you would implement the actual bulk operation
    // For now, we'll just show a confirmation
    const actionMessages = {
      approve: 'Approve selected documents',
      reject: 'Reject selected documents', 
      delete: 'Delete selected documents',
      security: 'Update security level of selected documents'
    };
    
    alert(`${actionMessages[actionType]} (${selectedDocuments.size} documents)`);
    
    // Reset after action
    setTimeout(() => {
      setBulkActionType(null);
    }, 1000);
  };

  const getSecurityLevelColor = (level?: string) => {
    switch (level) {
      case 'Public':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'Restricted':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Confidential':
        return 'text-white dark:text-white';
      case 'Top Secret':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-4 h-4 text-gray-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'image':
      case 'pptx':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'markdown':
      case 'md':
        return <FileText className="w-4 h-4 text-gray-500" />;
      case 'sql':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-white dark:text-white';
      case 'revision':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { backgroundColor: 'rgba(16, 185, 129, 0.1)' };
      case 'pending':
        return { backgroundColor: '#ffeefb', color: '#b64198' };
      case 'revision':
        return {};
      default:
        return {};
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'revision':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <File className="w-3 h-3" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="max-w-8çxl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Back button - Only for admin users */}
            {user?.role === 'admin' && (
              <motion.button
                onClick={onBack}
                className="glass-button-icon"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {subjectTitle ? `${subjectTitle} ` : 'All Documents'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredDocuments.length} documents found
              </p>
            </div>
          </div>
          
          {/* Search on the right */}
          <div className="w-96">
            <SearchBar
              onSearch={(query) => {
                setSearchQuery(query);
              }}
              onShowAllResults={onShowAllResults || (() => {})}
              onDocumentClick={(doc) => handleDocumentClick(doc)}
              documents={documents}
              placeholder="Search"
              className="w-full"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 hidden">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setExpandedFilters(!expandedFilters)}
              className="flex items-center space-x-2 glass-button-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
              {expandedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </motion.button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {expandedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-panel rounded-lg p-6"
              >
                <div className="space-y-6">
                  {/* Filter Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Document Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Types</option>
                        <option value="Financial Report">Financial Report</option>
                        <option value="Budget Analysis">Budget Analysis</option>
                        <option value="Template">Template</option>
                        <option value="Project Proposal">Project Proposal</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Database Schema">Database Schema</option>
                        <option value="Employee Handbook">Employee Handbook</option>
                        <option value="Brand Guidelines">Brand Guidelines</option>
                        <option value="Meeting Notes">Meeting Notes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Subjects</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="revision">Revision</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Security Level
                      </label>
                      <select
                        value={selectedSecurity}
                        onChange={(e) => setSelectedSecurity(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All Security Levels</option>
                        <option value="public">Public</option>
                        <option value="internal">Internal</option>
                        <option value="confidential">Confidential</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File Type
                      </label>
                      <select
                        value={selectedFileExtension}
                        onChange={(e) => setSelectedFileExtension(e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="All">All File Types</option>
                        <option value="PDF">PDF</option>
                        <option value="Excel">Excel</option>
                        <option value="Word">Word</option>
                        <option value="PowerPoint">PowerPoint</option>
                        <option value="Markdown">Markdown</option>
                        <option value="SQL">SQL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                          const [field, order] = e.target.value.split('-');
                          setSortBy(field);
                          setSortOrder(order as 'asc' | 'desc');
                        }}
                        className="glass-select w-full"
                      >
                        <option value="uploadedAt-desc">Newest First</option>
                        <option value="uploadedAt-asc">Oldest First</option>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                        <option value="type-asc">Type A-Z</option>
                        <option value="type-desc">Type Z-A</option>
                        <option value="department-asc">Subject A-Z</option>
                        <option value="department-desc">Subject Z-A</option>
                        <option value="fileSize-asc">Size Small to Large</option>
                        <option value="fileSize-desc">Size Large to Small</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {filteredDocuments.length} of {documents.length} documents match your filters
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedType('All');
                          setSelectedDepartment('All');
                          setSelectedStatus('All');
                          setSelectedSecurity('All');
                          setSelectedFileExtension('All');
                          setSearchQuery('');
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <div className="glass-panel rounded-lg p-4">
              <div className="flex items-center justify-between">
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
                    onClick={() => handleBulkAction('approve')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'approve'}
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve</span>
                  </motion.button>
                  <motion.button
                    onClick={() => handleBulkAction('security')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'security'}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleBulkAction('delete')}
                    className="glass-button text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={bulkActionType === 'delete'}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="glass-panel rounded-lg">
          <div className="overflow-x-auto lg:overflow-x-visible">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAll();
                        } else {
                          handleDeselectAll();
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <span>Title</span>
                      {getSortIcon('title')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <span>Type</span>
                      {getSortIcon('type')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('uploadedAt')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <span>Date</span>
                      {getSortIcon('uploadedAt')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      <span>Status</span>
                      {getSortIcon('status')}
                    </button>
                  </th>
                  {/* Security column - Only visible to managers and admins */}
                  {(user?.role === 'manager' || user?.role === 'admin') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('securityLevel')}
                        className="flex items-center space-x-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        <span>Security</span>
                        {getSortIcon('securityLevel')}
                      </button>
                    </th>
                  )}
                  {/* Approver column - Only visible to managers and admins */}
                  {(user?.role === 'manager' || user?.role === 'admin') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <span>Approver</span>
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <motion.tr
                    key={document.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    onMouseEnter={() => setHoveredRow(document.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.has(document.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleDocumentSelect(document.id, e.target.checked);
                        }}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
                        onClick={() => handleDocumentClick(document)}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200 text-left">
                            {document.title}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {document.fileSize}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(document.fileType)}
                          <span className="text-sm text-gray-900 dark:text-white">
                            {document.fileType.toUpperCase()}
                          </span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDateTime(document.uploadedAt.toISOString())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.approvalStatus)}`}
                        style={getStatusBackgroundColor(document.approvalStatus)}
                      >
                        {getStatusIcon(document.approvalStatus)}
                        <span className="ml-1">{document.approvalStatus}</span>
                      </span>
                    </td>
                    {/* Security column - Only visible to managers and admins */}
                    {(user?.role === 'manager' || user?.role === 'admin') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSecurityLevelColor(document.securityLevel)}`}
                          style={document.securityLevel === 'Confidential' ? { backgroundColor: '#ffedec', color: '#d22927' } : {}}
                        >
                          <Shield className="w-3 h-3 mr-1" />
                          <span className="capitalize">{document.securityLevel || 'Public'}</span>
                        </span>
                      </td>
                    )}
                    {/* Approver column - Only visible to managers and admins */}
                    {(user?.role === 'manager' || user?.role === 'admin') && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {document.approver ? (
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={document.approver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(document.approver.name)}&background=6366f1&color=fff&size=32`}
                                alt={document.approver.name}
                                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-medium text-primary-600 dark:text-primary-400 border-2 border-white dark:border-gray-800 hidden">
                                {document.approver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {document.approver.name}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {document.approver.title}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500">No approver assigned</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {hoveredRow === document.id && (
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={(e) => handleView(document, e)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          {/* Edit button - Only for managers and admins */}
                          {(user?.role === 'manager' || user?.role === 'admin') && (
                            <motion.button
                              onClick={(e) => handleEdit(document, e)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                          )}
                          <div className="relative">
                            <DropdownMenu
                              position="top-right"
                              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                              buttonClassName="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                              items={getDropdownItems(document)}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {filteredDocuments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No documents found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </motion.div>
      )}

      {/* Document Preview Modal */}
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

      {/* Document Edit Modal */}
      <DocumentEditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingDocument(null);
        }}
        document={editingDocument as any}
        onSave={handleSaveDocument}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
        document={feedbackDocument as any}
      />

    </div>
  );
}
