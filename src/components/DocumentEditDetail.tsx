import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  FileText, 
  Tag,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Document } from '../types';


interface DocumentEditDetailProps {
  document: Document | null;
  onSave: (updatedDocument: Document) => void;
  onBack: () => void;
  hideApproveActions?: boolean;
}

const departments = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];
const securityLevels = ['Confidential', 'Public', 'Restricted', 'Top Secret'];
const documentTypes = ['Agreement', 'Analysis', 'Assessment', 'Calendar', 'Checklist', 'Configuration', 'Dashboard', 'Database', 'Documentation', 'Evaluation', 'Guideline', 'Manual', 'Material', 'Matrix', 'Metrics', 'Notes', 'Other', 'Plan', 'Policy', 'Process', 'Procedure', 'Program', 'Project', 'Record', 'Report', 'SLA', 'Schedule', 'Script', 'Setup', 'SOP', 'Study', 'Template'];
const availableApprovers = [
  { id: '1', name: 'Sarah Johnson', initials: 'SJ', title: 'IT Director', email: 'fms-admin@edaratgroup.com', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '2', name: 'Ahmed Al-Rashid', initials: 'AA', title: 'HR Manager', email: 'fms-hr@edaratgroup.com', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '3', name: 'Mike Chen', initials: 'MC', title: 'Operations Director', email: 'mike.chen@edaratgroup.com', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '4', name: 'Emma Wilson', initials: 'EW', title: 'Quality Manager', email: 'emma.wilson@edaratgroup.com', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '5', name: 'Lisa Davis', initials: 'LD', title: 'Compliance Officer', email: 'lisa.davis@edaratgroup.com', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '6', name: 'David Wilson', initials: 'DW', title: 'Finance Director', email: 'david.wilson@edaratgroup.com', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '7', name: 'Alex Rodriguez', initials: 'AR', title: 'Engineering Lead', email: 'alex.rodriguez@edaratgroup.com', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' },
  { id: '8', name: 'John Smith', initials: 'JS', title: 'Legal Counsel', email: 'john.smith@edaratgroup.com', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=1' }
];

export default function DocumentEditDetail({ document, onSave, onBack, hideApproveActions = false }: DocumentEditDetailProps) {
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);
  const [editedDocument, setEditedDocument] = useState<Document | null>(null);
  const [newTag, setNewTag] = useState('');
  const [approverSearch, setApproverSearch] = useState('');
  const [showApproverDropdown, setShowApproverDropdown] = useState(false);

  // Initialize edited document when component mounts
  React.useEffect(() => {
    if (document) {
      setEditedDocument({ ...document });
    }
  }, [document]);

  if (!document || !editedDocument) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Document Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onBack}
            className="glass-button-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    onSave(editedDocument);
    onBack();
  };

  const handleInputChange = (field: keyof Document, value: string) => {
    setEditedDocument(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      const tagsToAdd = newTag.split(',').map(tag => tag.trim()).filter(tag => tag);
      const uniqueTags = tagsToAdd.filter(tag => !editedDocument.tags.includes(tag));
      
      if (uniqueTags.length > 0) {
        setEditedDocument(prev => prev ? {
          ...prev,
          tags: [...prev.tags, ...uniqueTags]
        } : null);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedDocument(prev => prev ? {
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    } : null);
  };

  // Filter available approvers based on search query
  const getFilteredApprovers = () => {
    const searchTerm = approverSearch.toLowerCase();
    return availableApprovers.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.title.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  };

  const handleApproverSearch = (value: string) => {
    setApproverSearch(value);
    setShowApproverDropdown(value.length > 0);
  };

  const handleSelectApprover = (userId: string) => {
    const user = availableApprovers.find(u => u.id === userId);
    if (user) {
      setEditedDocument(prev => prev ? {
        ...prev,
        approver: {
          id: user.id,
          name: user.name,
          title: user.title,
          email: user.email,
          avatar: user.avatar
        }
      } : null);
    }
    setApproverSearch('');
    setShowApproverDropdown(false);
  };

  const handleRemoveApprover = () => {
    setEditedDocument(prev => prev ? {
      ...prev,
      approver: undefined
    } : null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const filteredApprovers = getFilteredApprovers();
      if (filteredApprovers.length > 0) {
        handleSelectApprover(filteredApprovers[0].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-gray-500" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Document
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editedDocument.fileExtension} • {editedDocument.fileSize}
                </p>
              </div>
            </div>
            {editedDocument.isLocked && (
              <span className="text-gray-400 text-xs" title="Locked">
                LOCKED
              </span>
            )}
            {editedDocument.isPublic && (
              <span className="text-gray-400 text-xs" title="Public">
                PUBLIC
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleSave}
              className="glass-button-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Preview */}
          <div className="flex-1 p-6 relative">
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-24 h-24 stroke-1 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Document Preview
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Document content preview would be displayed here
                </p>
              </div>
            </div>
          </div>

          {/* Toggle Button - Centered between panels */}
          <div onClick={() => setIsInfoPanelVisible(!isInfoPanelVisible)} className="flex items-center justify-center border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <motion.button
              className="p-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isInfoPanelVisible ? "Hide Edit Panel" : "Show Edit Panel"}
            >
              {isInfoPanelVisible ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </motion.button>
          </div>

          {/* Edit Panel */}
          <AnimatePresence>
            {isInfoPanelVisible && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 400, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
              >
                <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                  <div className="space-y-4">
                    {/* Document Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Document Title
                      </label>
                      <input
                        type="text"
                        value={editedDocument.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="glass-input w-full"
                        placeholder="Enter document title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={editedDocument.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="glass-input w-full h-24 resize-none"
                        placeholder="Enter document description"
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                      </label>
                      <div className="space-y-3">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTag();
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value.includes(',')) {
                                const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                                tags.forEach(tag => {
                                  if (!editedDocument.tags.includes(tag)) {
                                    setEditedDocument(prev => prev ? {
                                      ...prev,
                                      tags: [...prev.tags, tag]
                                    } : null);
                                  }
                                });
                                setNewTag('');
                              }
                            }}
                            className="glass-input flex-1"
                            placeholder="Add tags (separate with comma)"
                          />
                          <motion.button
                            onClick={handleAddTag}
                            className="glass-button-icon"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editedDocument.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-gray-800 dark:bg-primary-900/30 dark:text-white"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                              <motion.button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-red-500 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </motion.button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject
                      </label>
                      <select
                        value={editedDocument.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="glass-select w-full"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Document Type
                      </label>
                      <select
                        value={editedDocument.documentType || ''}
                        onChange={(e) => handleInputChange('documentType', e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="">Select document type</option>
                        {documentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Security Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Security Level
                      </label>
                      <select
                        value={editedDocument.securityLevel || ''}
                        onChange={(e) => handleInputChange('securityLevel', e.target.value)}
                        className="glass-select w-full"
                      >
                        <option value="">Select security level</option>
                        {securityLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>

                    {/* Approver */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Approver
                      </label>
                      
                      {/* Approver Search Input */}
                      {!editedDocument.approver && (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            value={approverSearch}
                            onChange={(e) => handleApproverSearch(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setShowApproverDropdown(approverSearch.length > 0)}
                            className="glass-input pl-10 w-full"
                            placeholder="Search for approver by name, title, or email..."
                          />
                          
                          {/* Search Results Dropdown */}
                          <AnimatePresence>
                            {showApproverDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-1 glass-panel rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto"
                              >
                                {getFilteredApprovers().length > 0 ? (
                                  <div className="p-2">
                                    {getFilteredApprovers().map(user => (
                                      <button
                                        key={user.id}
                                        onClick={() => handleSelectApprover(user.id)}
                                        className="flex items-center space-x-3 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                      >
                                        <img
                                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=32`}
                                          alt={user.name}
                                          className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex-1 text-left">
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.title}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No approvers found
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      
                      {/* Current Approver */}
                      {editedDocument.approver && (
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <img
                              src={editedDocument.approver.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(editedDocument.approver.name)}&background=6366f1&color=fff&size=40`}
                              alt={editedDocument.approver.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {editedDocument.approver.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {editedDocument.approver.title || 'Approver'}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={handleRemoveApprover}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Document Status */}
                    {!hideApproveActions && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Status
                        </label>
                        <select
                          value={editedDocument.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="glass-select w-full"
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="revision">Revision</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}