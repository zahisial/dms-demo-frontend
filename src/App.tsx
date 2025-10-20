import React, { useState, useMemo } from 'react';
import { Plus, Upload, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import UserLogin from './components/UserLogin';
import AdminLayout from './components/AdminLayout';
import FolderView from './components/FolderView';
import ThemeToggle from './components/ThemeToggle';
import { SearchFilters } from './components/SearchBar';
import SearchResultsPage from './components/SearchResultsPage';
import DocumentDetailPage from './components/DocumentDetailPage';
import UploadModal from './components/UploadModal';
import FeedbackModal from './components/FeedbackModal';
import AddDepartmentModal from './components/AddDepartmentModal';
import DepartmentDetailPanel from './components/DepartmentDetailPanel';
import ISO2Page from './components/ISO2Page';
import EDCPage from './components/EDCPage';
import ISO9000Page from './components/ISO9000Page';
import CEPage from './components/CEPage';
import PendingApprovalsPage from './components/PendingApprovalsPage';
import DocsDBPage from './components/DocsDBPage';
import { Document, Department, User } from './types';
import { mockDocuments, mockDepartments, mockAuditLogs, mockISO9000Sections, mockISO2Sections, mockEDCSections, mockCESections, type ISO9000Section, type ISO2Section, type EDCSection, type CESection } from './data/mockData';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    department: 'All',
    type: 'All',
    fileType: 'All',
    dateRange: 'All',
  });
  const [adminViewMode, setAdminViewMode] = useState<'list' | 'grid' | 'tree'>('grid');
  const [sortBy] = useState<'department' | 'fileType' | 'date'>('date');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [currentView, setCurrentView] = useState<'main' | 'document' | 'search'>('main');
  const [searchResultsQuery, setSearchResultsQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [dragOverlay] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackDocument, setFeedbackDocument] = useState<Document | null>(null);
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [departmentDetailOpen, setDepartmentDetailOpen] = useState(false);
  const [selectedDepartmentDetail] = useState<Department | null>(null);
  const [currentPage, setCurrentPage] = useState<'main' | 'iso2' | 'edc' | 'ce' | 'iso9000' | 'pending-approvals' | 'docsdb' | 'document'>('main');
  const [selectedSubjectTitle, setSelectedSubjectTitle] = useState<string>('');
  
  // Centralized ISO sections state
  const [iso9000Sections, setIso9000Sections] = useState<ISO9000Section[]>(mockISO9000Sections);
  const [iso2Sections, setIso2Sections] = useState<ISO2Section[]>(mockISO2Sections);
  const [edcSections, setEdcSections] = useState<EDCSection[]>(mockEDCSections);
  const [ceSections, setCESections] = useState<CESection[]>(mockCESections);

  // Calculate total pending documents across all pages
  const totalPendingCount = useMemo(() => {
    let count = 0;
    
    // Count from ISO9000
    iso9000Sections.forEach(section => {
      count += section.documents.filter(doc => doc.approvalStatus === 'pending').length;
    });
    
    // Count from CE
    ceSections.forEach(section => {
      count += section.documents.filter(doc => doc.approvalStatus === 'pending').length;
    });
    
    // Count from EDC (if they have approvalStatus)
    edcSections.forEach(section => {
      count += section.documents.filter((doc: any) => doc.approvalStatus === 'pending').length;
    });
    
    // Count from ISO2 (if they have approvalStatus)
    iso2Sections.forEach(section => {
      count += section.documents.filter((doc: any) => doc.approvalStatus === 'pending').length;
    });
    
    return count;
  }, [iso9000Sections, ceSections, edcSections, iso2Sections]);

  // Only use currentUser, no fallback to defaultUser
  const user = currentUser;

  const handleLogin = (user: User) => {
    console.log('Login attempt for user:', user.name, 'Role:', user.role);
    setCurrentUser(user);
    // Set initial page based on user role
    if (user.role === 'admin') {
      console.log('Setting page to iso9000 for admin');
      setCurrentPage('iso9000');
    } else if (user.role === 'manager') {
      console.log('Setting page to iso9000 for manager');
      setCurrentPage('iso9000'); // Managers land on ISO 9000 page
    } else if (user.role === 'employee') {
      console.log('Setting page to iso9000 for employee');
      setCurrentPage('iso9000'); // Employees land on ISO 9000 page
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setCurrentUser(null);
    // Reset all state when logging out
    setSelectedDocument(null);
    setCurrentView('main');
    setCurrentPage('main');
    setSearchQuery('');
    setSearchFilters({
      department: 'All',
      type: 'All',
      fileType: 'All',
      dateRange: 'All',
    });
    setSelectedDocuments(new Set());
    setBulkMode(false);
    setUploadModalOpen(false);
    
    // Small delay to ensure state is properly reset before showing login
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 100);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      // In a real app, you would also update this in your backend/database
      console.log('User updated:', updatedUser);
    }
  };

  // Filter documents based on search query and filters
  const filteredDocuments = useMemo(() => {
    // Early return if user is not logged in
    if (!user) {
      return [];
    }
    
    let filtered = documents.filter(doc => {
      if (bulkMode && user.role === 'manager' && doc.approvalStatus !== 'pending') {
        return false;
      }
      
      const matchesQuery = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDepartment = searchFilters.department === 'All' || doc.department === searchFilters.department;
      const matchesType = searchFilters.type === 'All' || doc.type === searchFilters.type;
      const matchesFileType = searchFilters.fileType === 'All' || doc.fileType === searchFilters.fileType;
      const matchesDateRange = searchFilters.dateRange === 'All';
      
      return matchesQuery && matchesDepartment && matchesType && matchesFileType && matchesDateRange;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'fileType':
          comparison = a.fileType.localeCompare(b.fileType);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [searchQuery, searchFilters, documents, sortBy, sortOrder, bulkMode, user]);

  // Helper function to find department by path (including nested departments)
  const findDepartmentByPath = (path: string, allDepartments: Department[]): Department | null => {
    for (const dept of allDepartments) {
      if (dept.path === path) {
        return dept;
      }
      if (dept.children) {
        const found = findDepartmentByPath(path, dept.children);
        if (found) return found;
      }
    }
    return null;
  };

  const documentsByDepartment = useMemo(() => {
    const grouped = filteredDocuments.reduce((acc, doc) => {
      if (!acc[doc.department]) {
        acc[doc.department] = [];
      }
      acc[doc.department].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);

    return Object.entries(grouped).map(([path, docs]) => {
      // Try to find the department by full path first
      let dept = findDepartmentByPath(path, departments);
      
      // If not found, create a virtual department
      if (!dept) {
        const pathSegments = path.split('/');
        const departmentName = pathSegments[pathSegments.length - 1]; // Last segment
        dept = {
          id: path.replace(/\//g, '-').toLowerCase(),
          name: departmentName,
          color: '#6B7280',
          documentCount: docs.length,
          path: path,
          parentId: null
        };
      }
      
      return { department: dept, documents: docs };
    });
  }, [filteredDocuments, departments]);

  const handleDocumentClick = (document: Document) => {
    console.log('handleDocumentClick called with document:', document.title);
    console.log('Current user:', user?.name, 'Role:', user?.role);
    setSelectedDocument(document);
    setCurrentPage('document');
    console.log(`User ${user?.name} viewed document: ${document.title}`);
    console.log('Navigating to DocumentDetailPage');
  };

  const handleNavigateToISO2 = () => {
    // Only admins can access ISO2 page
    if (user?.role === 'admin') {
      setCurrentPage('iso2');
    }
  };

  const handleNavigateToEDC = () => {
    // Only admins can access EDC page
    if (user?.role === 'admin') {
      setCurrentPage('edc');
    }
  };

  const handleNavigateToCE = () => {
    // Only admins can access CE page
    if (user?.role === 'admin') {
      setCurrentPage('ce');
    }
  };

  const handleNavigateToISO9000 = () => {
    // Only admins can access ISO9000 page
    if (user?.role === 'admin') {
      setCurrentPage('iso9000');
    }
  };

  const handleNavigateToPendingApprovals = () => {
    // Only managers and admins can access pending approvals
    if (user?.role === 'manager' || user?.role === 'admin') {
      setCurrentPage('pending-approvals');
    }
  };

  const handleNavigateToDocsDB = (subjectTitle?: string) => {
    setSelectedSubjectTitle(subjectTitle || '');
    setCurrentPage('docsdb');
  };

  const handleBackToMain = () => {
    setCurrentPage('iso9000');
  };

  const handleApprove = () => {
    if (selectedDocument) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, approvalStatus: 'approved', approvedBy: user?.name || 'Unknown', approvedAt: new Date() }
            : doc
        )
      );
      setCurrentView('main');
    }
  };

  const handleReject = () => {
    console.log('🔴 handleReject called!');
    console.log('📄 Selected document:', selectedDocument?.title);
    console.log('📋 Current feedbackModalOpen state:', feedbackModalOpen);
    setFeedbackDocument(selectedDocument);
    setFeedbackModalOpen(true);
    console.log('✅ Modal state should now be true');
  };

  const handleFeedbackSubmit = (feedback: string) => {
    if (selectedDocument) {
      console.log(`Feedback submitted for document ${selectedDocument.title}:`, feedback);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === selectedDocument.id 
            ? { ...doc, approvalStatus: 'rejected' as const, approvedBy: user?.name || 'Unknown', approvedAt: new Date() }
            : doc
        )
      );
      setCurrentView('main');
      // Show success message
      alert(`Feedback sent successfully for "${selectedDocument.title}"`);
    }
  };

  const handleAcknowledge = (documentId: string) => {
    console.log('Document acknowledged:', documentId);
    if (selectedDocument) {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, approvalStatus: 'acknowledged' as const, approvedBy: user?.name || 'Unknown', approvedAt: new Date() }
            : doc
        )
      );
    }
  };

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  };



  // Enhanced document selection handler
  const handleDocumentSelect = (documentId: string, isSelected: boolean) => {
    if (!user) return;
    
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(documentId);
      } else {
        newSet.delete(documentId);
      }
      
      // Auto-enable bulk mode when documents are selected
      if (newSet.size > 0 && !bulkMode) {
        setBulkMode(true);
      } else if (newSet.size === 0 && bulkMode) {
        setBulkMode(false);
      }
      
      return newSet;
    });
  };

  // Select all documents in current view
  const handleSelectAll = (documents: Document[]) => {
    if (!user) return;
    
    const documentIds = documents.map(doc => doc.id);
    setSelectedDocuments(new Set(documentIds));
    
    if (documentIds.length > 0) {
      setBulkMode(true);
    }
  };

  // Deselect all documents
  const handleDeselectAll = () => {
    setSelectedDocuments(new Set());
    setBulkMode(false);
  };

  // Enhanced bulk actions
  const handleBulkAction = (action: 'delete' | 'approve' | 'publish' | 'notify', documentIds: string[]) => {
    if (!user) return;
    
    const selectedDocs = documents.filter(doc => documentIds.includes(doc.id));
    
    switch (action) {
      case 'approve':
        const docsToNotify = selectedDocs.filter(doc => doc.notifyAllAfterApproval);
        
        setDocuments(prev => 
          prev.map(doc => 
            documentIds.includes(doc.id) 
              ? { ...doc, approvalStatus: 'approved' as const, approvedBy: user.name, approvedAt: new Date() }
              : doc
          )
        );
        
        if (docsToNotify.length > 0) {
          console.log(`Sending notifications to all employees about ${docsToNotify.length} approved documents`);
          alert(`${selectedDocs.length} documents approved! Notifications sent to all employees about ${docsToNotify.length} documents.`);
        } else {
          alert(`${selectedDocs.length} documents approved successfully!`);
        }
        break;
        
      case 'publish':
        // Only publish approved documents
        const approvedDocs = selectedDocs.filter(doc => doc.approvalStatus === 'approved');
        
        if (approvedDocs.length === 0) {
          alert('Only approved documents can be published. Please approve documents first.');
          return;
        }
        
        setDocuments(prev => 
          prev.map(doc => 
            approvedDocs.some(approved => approved.id === doc.id)
              ? { ...doc, publishStatus: 'published' as const, publishedBy: user.name, publishedAt: new Date() }
              : doc
          )
        );
        
        alert(`${approvedDocs.length} documents published successfully!`);
        break;
        
      case 'notify':
        console.log(`Sending notifications about ${selectedDocs.length} documents to users`);
        alert(`Notifications sent to users about ${selectedDocs.length} documents.`);
        break;
        
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedDocs.length} documents? This action cannot be undone.`)) {
          setDocuments(prev => prev.filter(doc => !documentIds.includes(doc.id)));
          alert(`${selectedDocs.length} documents deleted successfully.`);
        } else {
          return; // Don't clear selection if user cancelled
        }
        break;
    }
    
    // Clear selection after action
    setSelectedDocuments(new Set());
    setBulkMode(false);
  };



  const handleDeleteDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${document.title}"? This action cannot be undone.`);
    if (confirmed) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      console.log(`Document deleted: ${documentId} by ${user?.name || 'Unknown'}`);
      alert(`Document "${document.title}" has been deleted successfully.`);
      
      // If we're currently viewing this document, go back to main view
      if (selectedDocument && selectedDocument.id === documentId) {
        setCurrentView('main');
        setSelectedDocument(null);
      }
      
      // Remove from bulk selection if selected
      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };



  const handleFeedbackFromPanel = (feedback: string) => {
    if (feedbackDocument) {
      console.log(`Feedback submitted for document ${feedbackDocument.title}:`, feedback);
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === feedbackDocument.id 
            ? { ...doc, approvalStatus: 'rejected', approvedBy: user?.name || 'Unknown', approvedAt: new Date() }
            : doc
        )
      );
      console.log(`Document rejected: ${feedbackDocument.id} by ${user?.name || 'Unknown'}`);
      
      // Remove from selection after rejection
      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(feedbackDocument.id);
        return newSet;
      });
    }
  };


  const handleAddDepartment = (newDept: { name: string; color: string }) => {
    const department: Department = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDept.name,
      color: newDept.color,
      documentCount: 0
    };
    
    setDepartments(prev => [...prev, department]);
    console.log(`New department added: ${newDept.name} by ${user?.name || 'Unknown'}`);
    alert(`Subject "${newDept.name}" added successfully!`);
  };



  const handleShowAllResults = (query: string) => {
    setSearchResultsQuery(query);
    setCurrentPage('search-results');
  };

  const handleBackFromSearch = () => {
    setCurrentPage('iso9000');
    setSearchResultsQuery('');
  };

  const handleNavigateToDocument = (document: Document) => {
    setSelectedDocument(document);
    setCurrentPage('document');
  };

  const handleBackFromDocument = () => {
    // Determine which page to go back to based on the current context
    if (currentPage === 'document') {
      // Go back to the previous page (could be iso9000, ce, edc, iso2, pending-approvals, docsdb, or search-results)
      // For now, default to iso9000, but this could be enhanced to remember the previous page
      setCurrentPage('iso9000');
      setSelectedDocument(null);
    }
  };

  const handleDocumentSelection = (documentId: string, selected: boolean) => {
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



  // Show UserLogin page if no user is logged in
  console.log('App render - currentUser:', currentUser, 'isLoggingOut:', isLoggingOut);
  if (!currentUser || isLoggingOut) {
    console.log('Showing UserLogin page');
    return <UserLogin onLogin={handleLogin} />;
  }

  // Use AdminLayout for all user roles
  const LayoutComponent = AdminLayout;
  const layoutProps = {
    user: user!,
    onSearch: handleSearch,
    onUploadClick: () => setUploadModalOpen(true),
    onLogout: handleLogout,
    viewMode: adminViewMode,
    onViewModeChange: setAdminViewMode,
    onUpdateUser: handleUpdateUser,
    onNavigateToISO2: handleNavigateToISO2,
    onNavigateToEDC: handleNavigateToEDC,
    onNavigateToCE: handleNavigateToCE,
    onNavigateToISO9000: handleNavigateToISO9000,
    onNavigateToPendingApprovals: handleNavigateToPendingApprovals,
    currentPage: currentPage,
    onShowAllResults: handleShowAllResults,
    onDocumentClick: (doc: any) => {
      setSelectedDocument(doc as unknown as Document);
      setDocumentPreviewOpen(true);
    },
    totalPendingCount: totalPendingCount
  };

  // Render ISO2 page (only for admins)
  if (currentPage === 'iso2') {
    // Check if user has permission to access ISO2 page
    if (!user || user.role !== 'admin') {
      // Redirect to document listing if user doesn't have permission
      setCurrentPage('docsdb');
      return null;
    }
    
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <ISO2Page 
            onNavigateToDocsDB={handleNavigateToDocsDB}
            onShowAllResults={handleShowAllResults}
            onDocumentClick={handleDocumentClick}
            sections={iso2Sections}
            onUpdateSections={setIso2Sections}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render EDC page (only for admins)
  if (currentPage === 'edc') {
    // Check if user has permission to access EDC page
    if (!user || user.role !== 'admin') {
      // Redirect to document listing if user doesn't have permission
      setCurrentPage('docsdb');
      return null;
    }
    
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <EDCPage 
            onNavigateToDocsDB={handleNavigateToDocsDB}
            onShowAllResults={handleShowAllResults}
            onDocumentClick={handleDocumentClick}
            sections={edcSections}
            onUpdateSections={setEdcSections}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render CE page (only for admins)
  if (currentPage === 'ce') {
    // Check if user has permission to access CE page
    if (!user || user.role !== 'admin') {
      // Redirect to document listing if user doesn't have permission
      setCurrentPage('docsdb');
      return null;
    }
    
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <CEPage 
            onNavigateToDocsDB={(subjectTitle) => {
              setCurrentPage('docsdb');
              setSelectedDocumentForPreview(null);
            }}
            onShowAllResults={(query) => {
              console.log('Show all search results for query:', query);
              setCurrentPage('search-results');
              setSearchResultsQuery(query);
            }}
            onDocumentClick={handleDocumentClick}
            sections={ceSections}
            onUpdateSections={setCESections}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render ISO9000 page (for all user roles)
  if (currentPage === 'iso9000') {
    console.log('Attempting to render ISO9000 page. User:', user?.name, 'Role:', user?.role);
    // Check if user is logged in
    if (!user) {
      console.log('No user found, redirecting to docsdb');
      // Redirect to document listing if user is not logged in
      setCurrentPage('docsdb');
      return null;
    }
    console.log('Rendering ISO9000 page for user:', user.name);
    
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <ISO9000Page 
            onNavigateToDocsDB={handleNavigateToDocsDB} 
            onNavigateToPendingApprovals={handleNavigateToPendingApprovals}
            onShowAllResults={handleShowAllResults}
            onDocumentClick={handleDocumentClick}
            sections={iso9000Sections}
            onUpdateSections={setIso9000Sections}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render Pending Approvals page (only for managers and admins)
  if (currentPage === 'pending-approvals') {
    // Check if user has permission to access pending approvals
    if (!user || (user.role !== 'manager' && user.role !== 'admin')) {
      // Redirect to document listing if user doesn't have permission
      setCurrentPage('docsdb');
      return null;
    }
    
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <PendingApprovalsPage 
            onBack={() => setCurrentPage('iso9000')} 
            onDocumentClick={handleDocumentClick}
            user={user}
            iso9000Sections={iso9000Sections}
            ceSections={ceSections}
            edcSections={edcSections}
            iso2Sections={iso2Sections}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render DocsDB page
  if (currentPage === 'docsdb') {
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <DocsDBPage 
            onBack={handleBackToMain} 
            user={user!}
            onShowAllResults={handleShowAllResults}
            onDocumentClick={handleDocumentClick}
            subjectTitle={selectedSubjectTitle}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render Search Results page
  if (currentPage === 'search-results') {
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <SearchResultsPage
            searchQuery={searchResultsQuery}
            allDocuments={documents}
            onDocumentClick={handleNavigateToDocument}
            onBack={handleBackFromSearch}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Render Document Detail page
  if (currentPage === 'document' && selectedDocument) {
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          <DocumentDetailPage
            document={selectedDocument}
            user={user}
            onBack={handleBackFromDocument}
            onEdit={(document) => {
              // Handle edit logic here
              console.log('Edit document:', document.title);
              // Could open DocumentEditDetail or navigate to edit page
            }}
            onDelete={(document) => {
              // Handle delete logic here
              console.log('Delete document:', document.title);
              // Could show confirmation and delete the document
            }}
            onDownload={(document) => {
              console.log('Download document:', document.title);
              // Handle download logic
            }}
            onShare={(document) => {
              console.log('Share document:', document.title);
              // Handle share logic
            }}
          />
        </LayoutComponent>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  const renderMainContent = () => {
    console.log('Rendering main content - currentPage:', currentPage, 'user:', user?.name);
    // All users now use the FolderView interface
    return (
      <FolderView
        departments={departments}
        documentsByDepartment={documentsByDepartment}
        viewMode={adminViewMode}
        onFolderClick={() => {
          // setSelectedDepartment(department.name);
          setDepartmentDetailOpen(true);
        }}
        onDocumentClick={handleDocumentClick}
        onViewModeChange={setAdminViewMode}
        onUploadClick={() => setUploadModalOpen(true)}
        userRole={user!.role}
        selectedDocuments={selectedDocuments}
        onDocumentSelect={handleDocumentSelect}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        bulkMode={bulkMode}
        onBulkAction={handleBulkAction}
      />
    );
  };


  // Only render main content if currentPage is 'main'
  if (currentPage === 'main') {
    return (
      <ThemeProvider>
        <LayoutComponent {...layoutProps}>
          {renderMainContent()}
        </LayoutComponent>

        {/* Modals and Panels */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadComplete={() => {}}
      />


      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setFeedbackDocument(null);
        }}
        onSubmit={feedbackDocument === selectedDocument ? handleFeedbackSubmit : handleFeedbackFromPanel}
        document={feedbackDocument}
      />

      <AddDepartmentModal
        isOpen={addDepartmentModalOpen}
        onClose={() => setAddDepartmentModalOpen(false)}
        onAdd={handleAddDepartment}
      />

      <DepartmentDetailPanel
        isOpen={departmentDetailOpen}
        onClose={() => setDepartmentDetailOpen(false)}
        department={selectedDepartmentDetail}
        documents={selectedDepartmentDetail ? documentsByDepartment.find(d => d.department.id === selectedDepartmentDetail.id)?.documents || [] : []}
        onDocumentClick={handleDocumentClick}
        showApprovalStatus={user?.role !== 'employee'}
        showDeleteButton={user?.role === 'admin'}
        onDeleteDocument={handleDeleteDocument}
        bulkMode={bulkMode}
        selectedDocuments={selectedDocuments}
        onDocumentSelect={handleDocumentSelection}
      />


      {/* Drag Overlay */}
      <AnimatePresence>
        {dragOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-gray-500/20 dark:bg-gray-500/30"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-8 mx-4 max-w-md text-center rounded-2xl glass-panel"
            >
              <Upload className="mx-auto mb-4 w-16 h-16 text-eteal-600 dark:text-eteal-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
                Drop files to upload
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Release to upload your files to the document management system
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
        <ThemeToggle />
      </ThemeProvider>
    );
  }

  // Fallback - should not reach here
  console.log('Fallback render - currentPage:', currentPage);
  return (
    <ThemeProvider>
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Current page: {currentPage}
          </p>
          <button
            onClick={() => setCurrentPage('main')}
            className="px-4 py-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            Go to Main Page
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
