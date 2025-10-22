import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  FileText, 
  Tag,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Search
} from 'lucide-react';
import { Document } from '../types';
import { getAllDepartmentPaths, type ISO9000Section, type ISO2Section, type EDCSection, mockUsers } from '../data/mockData';

interface User {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
}


interface DocumentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSave: (updatedDocument: Document) => void;
  hideApproveActions?: boolean;
  // Page-specific sections for dropdown
  iso9000Sections?: ISO9000Section[];
  iso2Sections?: ISO2Section[];
  edcSections?: EDCSection[];
  ceSections?: any[];  // CE sections
}

const departments = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];
const securityLevels = ['Confidential', 'Public', 'Restricted', 'Top Secret'];
const documentTypes = ['Agreement', 'Analysis', 'Assessment', 'Calendar', 'Checklist', 'Configuration', 'Dashboard', 'Database', 'Documentation', 'Evaluation', 'Guideline', 'Manual', 'Material', 'Matrix', 'Metrics', 'Notes', 'Other', 'Plan', 'Policy', 'Process', 'Procedure', 'Program', 'Project', 'Record', 'Report', 'SLA', 'Schedule', 'Script', 'Setup', 'SOP', 'Study', 'Template'];

export default function DocumentEditModal({ 
  isOpen, 
  onClose, 
  document, 
  onSave, 
  hideApproveActions = false,
  iso9000Sections = [],
  iso2Sections = [],
  edcSections = [],
  ceSections = []
}: DocumentEditModalProps) {
  const [isInfoPanelVisible, setIsInfoPanelVisible] = useState(true);
  const [editedDocument, setEditedDocument] = useState<Document | null>(null);
  const [newTag, setNewTag] = useState('');
  const [approverSearch, setApproverSearch] = useState('');
  const [showApproverDropdown, setShowApproverDropdown] = useState(false);

  // Get available subjects based on which page is calling the modal
  const availableSubjects = React.useMemo(() => {
    // Priority: Use page-specific sections if provided
    if (iso9000Sections.length > 0) {
      return iso9000Sections.map(section => section.title);
    }
    if (iso2Sections.length > 0) {
      return iso2Sections.map(section => section.title);
    }
    if (edcSections.length > 0) {
      return edcSections.map(section => section.title);
    }
    if (ceSections.length > 0) {
      return ceSections.map(section => section.title);
    }
    
    // Fallback: Use department paths if no page-specific sections
    return getAllDepartmentPaths();
  }, [iso9000Sections, iso2Sections, edcSections, ceSections]);

  // Initialize edited document when modal opens
  React.useEffect(() => {
    if (document && isOpen) {
      setEditedDocument({ ...document });
    }
  }, [document, isOpen]);

  if (!document || !editedDocument) return null;

  const handleSave = () => {
    onSave(editedDocument);
    onClose();
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
    return mockUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.department.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="relative flex-1 flex flex-col bg-white dark:bg-gray-900"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
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
                  <button
                    onClick={onClose}
                    className="p-2 glass-button-icon hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex">
                {/* Document Preview */}
                <div className="flex-1 p-6 relative">

                  <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
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
                      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 75px)' }}>
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
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
