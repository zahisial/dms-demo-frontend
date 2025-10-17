import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllDepartmentPaths, type ISO9000Section, type ISO2Section, type EDCSection } from '../data/mockData';
import { 
  X, 
  Upload, 
  File, 
  Image, 
  FileText, 
  FileSpreadsheet, 
  Video,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus,
  Edit
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: File[], subject: string) => void;
  onEditDocument?: (file: File) => void;
  initialSubject?: string;
  // Page-specific sections for dropdown
  iso9000Sections?: ISO9000Section[];
  iso2Sections?: ISO2Section[];
  edcSections?: EDCSection[];
}

export default function UploadModal({ 
  isOpen, 
  onClose, 
  onUploadComplete, 
  onEditDocument, 
  initialSubject,
  iso9000Sections = [],
  iso2Sections = [],
  edcSections = []
}: UploadModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial subject when modal opens
  React.useEffect(() => {
    if (isOpen && initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [isOpen, initialSubject]);

  // Get available subjects based on which page is calling the modal
  const availableSubjects = useMemo(() => {
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
    
    // Fallback: Use department paths if no page-specific sections
    return getAllDepartmentPaths();
  }, [iso9000Sections, iso2Sections, edcSections]);

  const acceptedFileTypes = {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'],
    documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
    spreadsheets: ['.xls', '.xlsx', '.csv'],
    videos: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
  };

  const allAcceptedExtensions = [
    ...acceptedFileTypes.images,
    ...acceptedFileTypes.documents,
    ...acceptedFileTypes.spreadsheets,
    ...acceptedFileTypes.videos
  ];

  const getFileIcon = (fileName: string, status?: string) => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    // Keep original colors - don't change based on status
    if (acceptedFileTypes.images.includes(extension)) {
      return <Image className="w-5 h-5 text-blue-500" />;
    } else if (acceptedFileTypes.documents.includes(extension)) {
      return <FileText className="w-5 h-5 text-gray-900" />;
    } else if (acceptedFileTypes.spreadsheets.includes(extension)) {
      return <FileSpreadsheet className="w-5 h-5 text-orange-500" />;
    } else if (acceptedFileTypes.videos.includes(extension)) {
      return <Video className="w-5 h-5 text-purple-500" />;
    } else {
      return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const simulateUpload = async (file: UploadedFile): Promise<void> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            
            if (newProgress >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setUploadedFiles(prevFiles => prevFiles.map(pf => 
                  pf.id === file.id 
                    ? { ...pf, progress: 100, status: 'completed' }
                    : pf
                ));
                resolve();
              }, 500);
            }
            
            return { ...f, progress: newProgress, status: 'uploading' };
          }
          return f;
        }));
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0 || !selectedSubject) return;

    setIsUploading(true);
    
    // Simulate upload for each file
    const uploadPromises = uploadedFiles
      .filter(file => file.status === 'pending')
      .map(file => simulateUpload(file));

    try {
      await Promise.all(uploadPromises);
      
      // Set upload completion state
      setUploadCompleted(true);
      
      // Notify parent component of successful upload with selected subject
      const completedFiles = uploadedFiles.map(f => f.file);
      onUploadComplete(completedFiles, selectedSubject);
      
      // Auto-close modal after a delay if no edit action is taken
      setTimeout(() => {
        if (uploadCompleted) {
          setUploadedFiles([]);
          setIsUploading(false);
          setUploadCompleted(false);
          setSelectedSubject('');
          onClose();
        }
      }, 8000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading || uploadCompleted) {
      setUploadedFiles([]);
      setUploadCompleted(false);
      setIsUploading(false);
      onClose();
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
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => {
                if (!isUploading || uploadCompleted) {
                  handleClose();
                }
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative mx-auto my-8 w-full max-w-4xl glass-panel rounded-lg shadow-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Upload Documents
                </h2>
                <motion.button
                  onClick={handleClose}
                  disabled={isUploading && !uploadCompleted}
                  className="glass-button-icon disabled:opacity-50"
                  whileHover={{ scale: (isUploading && !uploadCompleted) ? 1 : 1.05 }}
                  whileTap={{ scale: (isUploading && !uploadCompleted) ? 1 : 0.95 }}
                >
                  <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Subject Selection */}
                <div className="mb-6">
                  <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Subject (Required) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject-select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a subject...</option>
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {!selectedSubject && uploadedFiles.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">Please select a subject before uploading files.</p>
                  )}
                </div>

                {/* Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop files here or click to browse
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Support for images, documents, PDFs, spreadsheets, and videos
                  </p>
                  <motion.button
                    onClick={() => fileInputRef.current?.click()}
                    className="glass-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Select Files
                  </motion.button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={allAcceptedExtensions.join(',')}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Upload Completion Message */}
                {uploadCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                          Upload Completed Successfully!
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          Click the edit icon next to any file to modify document details, or close this dialog to continue.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* File List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Selected Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {uploadedFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-3 p-3 glass-panel rounded-lg"
                        >
                          {getFileIcon(file.file.name, file.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {file.file.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(file.file.size)}
                            </p>
                          </div>
                          
                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <div className="flex-1 max-w-32">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {Math.round(file.progress)}%
                              </p>
                            </div>
                          )}
                          
                          {/* Status Icon */}
                          {file.status === 'completed' && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              {onEditDocument && (
                                <motion.button
                                  onClick={() => onEditDocument(file.file)}
                                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Edit document details"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                              )}
                            </div>
                          )}
                          
                          {file.status === 'error' && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          
                          {/* Remove Button */}
                          {file.status === 'pending' && (
                            <motion.button
                              onClick={() => removeFile(file.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  onClick={handleClose}
                  disabled={isUploading && !uploadCompleted}
                  className={`${uploadCompleted ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'glass-button-secondary'} disabled:opacity-50 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors`}
                  whileHover={{ scale: (isUploading && !uploadCompleted) ? 1 : 1.05 }}
                  whileTap={{ scale: (isUploading && !uploadCompleted) ? 1 : 0.95 }}
                >
                  {uploadCompleted && <CheckCircle className="w-4 h-4" />}
                  <span>{uploadCompleted ? 'Done' : 'Cancel'}</span>
                </motion.button>
                {!uploadCompleted && (
                  <motion.button
                    onClick={handleUpload}
                    disabled={uploadedFiles.length === 0 || isUploading || !selectedSubject}
                    className="glass-button disabled:opacity-50"
                    whileHover={{ scale: (uploadedFiles.length === 0 || isUploading || !selectedSubject) ? 1 : 1.05 }}
                    whileTap={{ scale: (uploadedFiles.length === 0 || isUploading || !selectedSubject) ? 1 : 0.95 }}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}