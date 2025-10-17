import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { mockDocuments } from '../data/mockData';

interface ISO9000Document {
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

interface ISO9000Section {
  id: string;
  title: string;
  color: string;
  icon: React.ComponentType<any>;
  documents: ISO9000Document[];
}

interface ISO9000PageProps {
  onNavigateToDocsDB: () => void;
  onNavigateToPendingApprovals?: () => void;
  onShowAllResults?: (query: string) => void;
}

export default function ISO9000Page({ onNavigateToDocsDB, onNavigateToPendingApprovals, onShowAllResults }: ISO9000PageProps) {
  const [newCardModalOpen, setNewCardModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
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
  
  // State for ISO9000 sections with random document counts
  const [iso9000Sections, setIso9000Sections] = useState<ISO9000Section[]>([
    {
      id: '1',
      title: 'Quality Management System',
      color: '#08bed5', // Primary bright accent
      icon: Award,
      documents: [
        { id: '1', title: 'Quality Policy', type: 'Policy', url: '#', securityLevel: 'Public' },
        { id: '2', title: 'Quality Objectives', type: 'Document', url: '#', securityLevel: 'Restricted' },
        { id: '3', title: 'Management Review', type: 'Procedure', url: '#', securityLevel: 'Confidential' },
        { id: '4', title: 'Quality Manual', type: 'Manual', url: '#', securityLevel: 'Public' },
        { id: '5', title: 'Process Mapping', type: 'Diagram', url: '#', securityLevel: 'Restricted' },
        { id: '6', title: 'Risk Assessment', type: 'Assessment', url: '#', securityLevel: 'Confidential' },
        { id: '7', title: 'Corrective Actions', type: 'Procedure', url: '#', securityLevel: 'Public' }
      ]
    },
    {
      id: '2',
      title: 'Document Control',
      color: '#03778d', // Primary dark accent
      icon: FileText,
      documents: [
        { id: '8', title: 'Document Control Procedure', type: 'SOP', url: '#', securityLevel: 'Public' },
        { id: '9', title: 'Document Approval Matrix', type: 'Matrix', url: '#', securityLevel: 'Restricted' },
        { id: '10', title: 'Version Control', type: 'Guideline', url: '#', securityLevel: 'Public' },
        { id: '11', title: 'Document Retention', type: 'Policy', url: '#', securityLevel: 'Confidential' },
        { id: '12', title: 'Access Control', type: 'Procedure', url: '#', securityLevel: 'Top Secret' },
        { id: '13', title: 'Document Templates', type: 'Template', url: '#', securityLevel: 'Public' },
        { id: '14', title: 'Review Schedule', type: 'Calendar', url: '#', securityLevel: 'Restricted' },
        { id: '15', title: 'Distribution List', type: 'List', url: '#', securityLevel: 'Confidential' }
      ]
    },
    {
      id: '3',
      title: 'Internal Audits',
      color: '#08bed5', // Primary bright accent
      icon: Shield,
      documents: [
        { id: '16', title: 'Audit Program', type: 'Program', url: '#', securityLevel: 'Restricted' },
        { id: '17', title: 'Audit Checklist', type: 'Checklist', url: '#', securityLevel: 'Public' },
        { id: '18', title: 'Audit Schedule', type: 'Schedule', url: '#', securityLevel: 'Restricted' },
        { id: '19', title: 'Non-conformity Report', type: 'Report', url: '#', securityLevel: 'Confidential' }
      ]
    },
    {
      id: '4',
      title: 'Training & Competence',
      color: '#03778d', // Primary dark accent
      icon: Users,
      documents: [
        { id: '20', title: 'Training Matrix', type: 'Matrix', url: '#', securityLevel: 'Public' },
        { id: '21', title: 'Competence Assessment', type: 'Assessment', url: '#', securityLevel: 'Restricted' },
        { id: '22', title: 'Training Records', type: 'Record', url: '#', securityLevel: 'Confidential' },
        { id: '23', title: 'Training Materials', type: 'Material', url: '#', securityLevel: 'Public' },
        { id: '24', title: 'Certification Program', type: 'Program', url: '#', securityLevel: 'Restricted' },
        { id: '25', title: 'Skills Development', type: 'Plan', url: '#', securityLevel: 'Confidential' },
        { id: '26', title: 'Performance Evaluation', type: 'Evaluation', url: '#', securityLevel: 'Top Secret' },
        { id: '27', title: 'Training Effectiveness', type: 'Report', url: '#', securityLevel: 'Restricted' },
        { id: '28', title: 'Continuous Learning', type: 'Policy', url: '#', securityLevel: 'Public' }
      ]
    },
    {
      id: '5',
      title: 'Customer Satisfaction',
      color: '#08bed5', // Primary bright accent
      icon: Heart,
      documents: [
        { id: '29', title: 'Customer Feedback', type: 'Survey', url: '#', securityLevel: 'Public' },
        { id: '30', title: 'Complaint Handling', type: 'Procedure', url: '#', securityLevel: 'Restricted' },
        { id: '31', title: 'Service Level Agreement', type: 'SLA', url: '#', securityLevel: 'Confidential' }
      ]
    },
    {
      id: '6',
      title: 'Continuous Improvement',
      color: '#03778d', // Primary dark accent
      icon: TrendingUp,
      documents: [
        { id: '32', title: 'Improvement Projects', type: 'Project', url: '#', securityLevel: 'Public' },
        { id: '33', title: 'KPI Dashboard', type: 'Dashboard', url: '#', securityLevel: 'Restricted' },
        { id: '34', title: 'Performance Metrics', type: 'Metrics', url: '#', securityLevel: 'Confidential' },
        { id: '35', title: 'Benchmarking', type: 'Study', url: '#', securityLevel: 'Top Secret' },
        { id: '36', title: 'Innovation Process', type: 'Process', url: '#', securityLevel: 'Restricted' },
        { id: '37', title: 'Best Practices', type: 'Guide', url: '#', securityLevel: 'Public' }
      ]
    },
    {
      id: '7',
      title: 'Risk Management',
      color: '#08bed5', // Primary bright accent
      icon: Shield,
      documents: [
        { id: '38', title: 'Risk Assessment Matrix', type: 'Matrix', url: '#', securityLevel: 'Confidential' },
        { id: '39', title: 'Risk Mitigation Plan', type: 'Plan', url: '#', securityLevel: 'Restricted' },
        { id: '40', title: 'Business Continuity', type: 'Procedure', url: '#', securityLevel: 'Top Secret' },
        { id: '41', title: 'Emergency Response', type: 'Protocol', url: '#', securityLevel: 'Confidential' },
        { id: '42', title: 'Risk Register', type: 'Register', url: '#', securityLevel: 'Restricted' }
      ]
    },
    {
      id: '8',
      title: 'Process Management',
      color: '#03778d', // Primary dark accent
      icon: FileText,
      documents: [
        { id: '43', title: 'Process Documentation', type: 'SOP', url: '#', securityLevel: 'Public' },
        { id: '44', title: 'Process Flow Charts', type: 'Diagram', url: '#', securityLevel: 'Public' },
        { id: '45', title: 'Process Optimization', type: 'Report', url: '#', securityLevel: 'Restricted' },
        { id: '46', title: 'Process KPIs', type: 'Metrics', url: '#', securityLevel: 'Confidential' },
        { id: '47', title: 'Process Ownership', type: 'Matrix', url: '#', securityLevel: 'Restricted' },
        { id: '48', title: 'Process Review', type: 'Procedure', url: '#', securityLevel: 'Public' },
        { id: '49', title: 'Standard Operating Procedures', type: 'SOP', url: '#', securityLevel: 'Public' }
      ]
    }
  ]);

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

  const handleDocumentClick = (document: ISO9000Document) => {
    console.log('ISO9000Page: Document clicked:', document.title);
    // Convert ISO9000Document to Document format for view
    const viewDocument: Document = {
      id: document.id,
      title: document.title,
      type: document.type as any,
      fileType: 'pdf' as any,
      fileSize: '1.2 MB',
      department: 'ISO9000 Management',
      uploadedBy: 'System Admin',
      uploadedAt: new Date(),
      lastModified: new Date(),
      accessType: 'public',
      approvalStatus: 'approved',
      tags: ['ISO9000', 'Quality', 'Management'],
      description: `${document.title} - ISO9000 quality management document`,
      url: '#'
    };
    
    console.log('ISO9000Page: Opening DocumentPreviewModal for:', viewDocument.title);
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

  // Filter sections based on search query
  const filteredSections = iso9000Sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.documents.some(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="max-w-8xl mx-auto px-4 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white opacity-0">
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
                    className="absolute top-full right-0 mt-2 w-60 glass-panel rounded-lg shadow-lg z-50"
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4" />
                          <span>Recently Visited</span>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                          6
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          if (onNavigateToPendingApprovals) {
                            onNavigateToPendingApprovals();
                          }
                        }}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center text-left space-x-3">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pending for Approval</span>
                        </div>
                        <span className="text-xs font-bold  bg-gray-100 dark:bg-red-900/30 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                          2
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* ISO9000 Cards Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
