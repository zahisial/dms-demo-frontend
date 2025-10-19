import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Share, 
  FileText, 
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  MoreHorizontal,
  Info,
  Activity,
  GitBranch,
  File,
  Lock,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  Globe,
  UserCheck,
  Copy,
  Trash2
} from 'lucide-react';

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
  securityLevel?: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret';
  documentType?: string;
  description?: string;
  accessLevel?: string;
  lastModified?: string;
  approver?: {
    id: string;
    name: string;
    title: string;
    email: string;
    avatar?: string;
  };
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onEdit?: (document: Document) => void;
  user?: User | null;
  onAcknowledge?: (documentId: string) => void;
  onApprove?: (documentId: string) => void;
}

export default function DocumentPreviewModal({ isOpen, onClose, document, onEdit, user, onAcknowledge, onApprove }: DocumentPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'activity' | 'version'>('info');
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  if (!document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-white dark:text-white';
      case 'revision':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
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
        return <FileText className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleAcknowledge = () => {
    if (onAcknowledge && document) {
      onAcknowledge(document.id);
      setAcknowledged(true);
    }
  };

  const handleApprove = () => {
    if (onApprove && document) {
      onApprove(document.id);
    }
  };

  const handleCopyPath = async () => {
    if (document) {
      const path = `${document.department}/${document.title}`;
      try {
        await navigator.clipboard.writeText(path);
        setShowTooltip('copied');
        setTimeout(() => setShowTooltip(null), 2000);
      } catch (err) {
        console.error('Failed to copy path:', err);
      }
    }
  };

  const handleDelete = () => {
    if (document && window.confirm(`Are you sure you want to delete "${document.title}"? This action cannot be undone.`)) {
      // Here you would typically call a delete function
      console.log('Delete document:', document.id);
      onClose();
    }
  };

  // Simple Tooltip Component
  const Tooltip = ({ children, text, show }: { children: React.ReactNode; text: string; show: boolean }) => {
    if (!show) return <>{children}</>;
    
    return (
      <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 z-50 px-2 py-1 mb-2 text-xs text-white whitespace-nowrap bg-gray-900 rounded shadow-lg transform -translate-x-1/2">
          {text}
          <div className="absolute top-full left-1/2 border-4 border-transparent transform -translate-x-1/2 border-t-gray-900"></div>
        </div>
      </div>
    );
  };

  // Filter tabs based on user role - employees only see Info tab
  const allTabs = [
    { id: 'info', label: 'Info', icon: Info },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'version', label: 'Version', icon: GitBranch }
  ];
  
  const tabs = user?.role === 'employee' ? [allTabs[0]] : allTabs;
// Info Tab
  const renderInfoTab = () => (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Description</h4>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {document.description || "Security best practices for API development and integration."}
        </p>
      </div>

      {/* Tags */}
      <div>
        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {document.tags.map((tag, index) => (
            <motion.button
              key={index}
              onClick={() => console.log(`Clicked tag: ${tag}`)}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-gray-800 dark:bg-primary-900/30 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tag className="mr-1 w-3 h-3" />
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Document Details */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Details</h4>
          <span 
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}
            style={getStatusBackgroundColor(document.status)}
          >
            {getStatusIcon(document.status)}
            <span className="ml-1 capitalize">{document.status}</span>
          </span>
        </div>
        <div className="space-y-0">
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Manual</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">File Type:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{document.fileExtension}</span>
          </div>
          <div className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Subject:</span>
            <span className="text-sm font-medium text-right text-gray-900 dark:text-white">
              {document.department}
            </span>
          </div>
          {document.documentType && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Document Type:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{document.documentType}</span>
            </div>
          )}
          {document.securityLevel && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">Security Level:</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                document.securityLevel === 'Public' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                document.securityLevel === 'Restricted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                document.securityLevel === 'Confidential' ? 'bg-[#ffedec] text-[#d22927] dark:bg-[#d22927]/10 dark:text-[#d22927]' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {document.securityLevel} 
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Uploaded By:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{document.uploadedBy}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Upload Date:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(document.uploadedAt)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Modified:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(document.uploadedAt)}</span>
          </div>
        </div>
      </div>

      {/* Approver - Only visible to managers and admins */}
      {(user?.role === 'manager' || user?.role === 'admin') && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Approver</h4>
          {document.approver ? (
            <div className="flex items-center p-3 space-x-3 bg-white rounded-lg dark:bg-gray-700">
              <div className="relative">
                <img
                  src={document.approver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(document.approver.name)}&background=6366f1&color=fff&size=40`}
                  alt={document.approver.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="flex hidden justify-center items-center w-10 h-10 text-sm font-medium rounded-full border-2 border-white bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 dark:border-gray-800">
                  {document.approver.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {document.approver.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {document.approver.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {document.approver.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">No approver assigned</p>
            </div>
          )}
        </div>
      )}

      {/* Acknowledgment Section - Only for employees */}
      {user?.role === 'employee' && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="justify-between items-center">
            <div className='pb-4 w-full'>
              <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Document Acknowledgment</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please acknowledge that you have read and understood this document
              </p>
            </div>
            <motion.button
              onClick={handleAcknowledge}
              disabled={acknowledged}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                acknowledged
                  ? 'text-green-700 bg-green-100 cursor-not-allowed dark:bg-green-900/30 dark:text-green-400'
                  : 'text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg'
              }`}
              whileHover={!acknowledged ? { scale: 1.05 } : {}}
              whileTap={!acknowledged ? { scale: 0.95 } : {}}
            >
              {acknowledged ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Acknowledged</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Acknowledge</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
// Activity Tab
  const renderActivityTab = () => (
    <div className="space-y-4">
      <div className="py-8 text-center">
        <Activity className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Activity Feed</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Document activity and changes will be displayed here
        </p>
      </div>
      
      {/* Mock activity items */}
      <div className="space-y-3">
        <div className="flex items-start p-3 space-x-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-900/30">
            <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">Document approved</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">01-15-2024 12:30</p>
          </div>
        </div>
        
        <div className="flex items-start p-3 space-x-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-900/30">
            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">Document edited by {document.uploadedBy}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">01-14-2024 16:45</p>
          </div>
        </div>
        
        <div className="flex items-start p-3 space-x-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-900/30">
            <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white">Document uploaded</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(document.uploadedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
// Version Tab
  const renderVersionTab = () => (
    <div className="space-y-4">
      <div className="py-8 text-center">
        <GitBranch className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Version History</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Document versions and revision history
        </p>
      </div>
      
      {/* Mock version items */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 rounded-lg border bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Version 2.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current version</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(document.uploadedAt)}</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-600">
              <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Version 1.5</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Previous version</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">15-01-2024 14:30</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full dark:bg-gray-600">
              <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Version 1.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Initial version</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">20-12-2023 09:00</span>
        </div>
      </div>
    </div>
  );

  return (
    
    <AnimatePresence>
      {isOpen && (
        <div className="overflow-y-auto fixed inset-0 z-50">
          <div className="flex min-h-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-sm bg-black/50"
              onClick={onClose}
            />

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="flex relative flex-col flex-1 bg-white dark:bg-gray-900"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-gray-500" />
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {document.title}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {document.fileExtension} • {document.fileSize}
                      </p>
                    </div>
                  </div>
                  {document.isLocked && (
                    <span className="text-gray-400" title="Locked">
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                  {document.isPublic && (
                    <span className="text-gray-400" title="Public">
                      <Globe className="w-4 h-4" />
                    </span>
                  )}
                </div>
                
                        <div className="flex items-center space-x-2">
                          {/* Admin User Buttons with Tooltips */}
                          {user?.role === 'admin' && (
                            <>
                              {/* Download Button */}
                              <Tooltip text="Download Document" show={showTooltip === 'download'}>
                                <motion.button
                                  onMouseEnter={() => setShowTooltip('download')}
                                  onMouseLeave={() => setShowTooltip(null)}
                                  className="glass-button-icon"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Download className="w-4 h-4" />
                                </motion.button>
                              </Tooltip>
                              
                              {/* Copy Path Button */}
                              <Tooltip text="Copy Document Path" show={showTooltip === 'copy'}>
                                <motion.button
                                  onMouseEnter={() => setShowTooltip('copy')}
                                  onMouseLeave={() => setShowTooltip(null)}
                                  onClick={handleCopyPath}
                                  className="glass-button-icon"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Copy className="w-4 h-4" />
                                </motion.button>
                              </Tooltip>
                              
                              

                              {/* Edit Button */}
                              {onEdit && (
                                <Tooltip text="Edit Document" show={showTooltip === 'edit'}>
                                  <motion.button
                                    onMouseEnter={() => setShowTooltip('edit')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    onClick={() => onEdit(document)}
                                    className="glass-button-icon"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </motion.button>
                                </Tooltip>
                              )}
                            </>
                          )}

{/* Delete Button */}
<Tooltip text="Delete Document" show={showTooltip === 'delete'}>
                                <motion.button
                                  onMouseEnter={() => setShowTooltip('delete')}
                                  onMouseLeave={() => setShowTooltip(null)}
                                  onClick={handleDelete}
                                  className="text-red-600 glass-button-icon hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </Tooltip>
                          {/* Manager User Buttons */}
                          {user?.role === 'manager' && (
                            <>
                              {/* Edit Button */}
                              {onEdit && (
                                <Tooltip text="Edit Document" show={showTooltip === 'edit'}>
                                  <motion.button
                                    onMouseEnter={() => setShowTooltip('edit')}
                                    onMouseLeave={() => setShowTooltip(null)}
                                    onClick={() => onEdit(document)}
                                    className="glass-button-icon"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </motion.button>
                                </Tooltip>
                              )}

                              {/* Copy Link Button */}
                              <Tooltip text="Copy Document Link" show={showTooltip === 'share'}>
                                <motion.button
                                  onMouseEnter={() => setShowTooltip('share')}
                                  onMouseLeave={() => setShowTooltip(null)}
                                  className="glass-button-icon"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Share className="w-4 h-4" />
                                </motion.button>
                              </Tooltip>
                            </>
                          )}
                          
                          {/* Employee User Buttons */}
                          {user?.role === 'employee' && !acknowledged && (
                            <Tooltip text="Acknowledge Document" show={showTooltip === 'acknowledge'}>
                            <motion.button
                              onClick={handleAcknowledge}
                              className="glass-button-primary"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Acknowledge</span>
                            </motion.button>
                          </Tooltip>
                          )}
                          
                          {/* Acknowledged State - Only for employees */}
                          {user?.role === 'employee' && acknowledged && (
                            <Tooltip text="Acknowledged Document" show={showTooltip === 'acknowledged'}>
                            <motion.div
                              className="flex items-center px-3 py-2 space-x-2 text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Acknowledged</span>
                            </motion.div>
                            </Tooltip>
                          )}

                          <Tooltip text="More Actions" show={showTooltip === 'more'}>
                          <motion.button
                            className="glass-button-icon"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </motion.button>
                          </Tooltip>
                          <Tooltip text="Close Document Preview" show={showTooltip === 'close'}>
                          <motion.button
                            onClick={onClose}
                            className="p-2 rounded-lg transition-colors glass-button-icon hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X className="w-5 h-5 text-red-500 dark:text-red-400" />
                          </motion.button>
                          </Tooltip>
                        </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1">
                {/* Document Preview */}
                <div className="relative flex-1 p-6">

                  <div className="flex justify-center items-center h-full bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div className="text-center">
                      <FileText className="mx-auto mb-4 w-24 h-24 text-gray-400 stroke-1" />
                      <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        Document Preview
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Preview content would be displayed here
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toggle Button - Centered between panels */}
                <div className="flex justify-center items-center bg-gray-50 border-l border-gray-200 dark:border-gray-700 dark:bg-gray-800" onClick={() => setIsInfoPanelVisible(!isInfoPanelVisible)}>
                  <motion.button
                    
                    className="p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isInfoPanelVisible ? "Hide Info Panel" : "Show Info Panel"}
                  >
                    {isInfoPanelVisible ? (
                      <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </motion.button>
                </div>

                {/* Info Panel with Tabs */}
                <AnimatePresence>
                  {isInfoPanelVisible && (
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 384, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-gray-50 border-l border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    >
                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                              activeTab === tab.id
                                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-white dark:bg-gray-900'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === 'info' && renderInfoTab()}
                        {activeTab === 'activity' && renderActivityTab()}
                        {activeTab === 'version' && renderVersionTab()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}