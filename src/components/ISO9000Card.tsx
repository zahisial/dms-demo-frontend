import { motion } from 'framer-motion';
import { Upload, Trash2 } from 'lucide-react';
import { ISO9000Section, ISO9000Document } from '../data/mockData';

interface ISO9000CardProps {
  section: ISO9000Section;
  onShowAll: () => void;
  onDocumentClick: (document: ISO9000Document) => void;
  onUpload?: (sectionTitle: string) => void;
  onCardClick?: (sectionTitle: string) => void;
}

export default function ISO9000Card({ section, onShowAll, onDocumentClick, onUpload, onCardClick }: ISO9000CardProps) {
  // Show all documents if 5 or fewer, otherwise show first 5
  const displayedDocuments = section.documents.length <= 5 
    ? section.documents 
    : section.documents.slice(0, 5);

  const handleDocumentClick = (document: ISO9000Document) => {
    console.log('ISO9000Card: Document clicked:', document.title);
    onDocumentClick(document);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(section.title);
    }
  };

  // Get background image based on section ID (alternate between the two images)
  const getBackgroundImage = (sectionId: string) => {
    const images = ['/bg_folder_01.png', '/bg_folder_04.png', '/bg_folder_03.png'];
    const index = sectionId.charCodeAt(0) % 2; // Use first character to determine image
    return images[index];
  };

  const backgroundImage = getBackgroundImage(section.id);
  const backgroundColor = '#d3edf5';

  return (
    <motion.div 
      className="flex overflow-hidden relative flex-col w-full h-96 rounded-2xl border shadow-lg transition-all duration-300 cursor-pointer group border-primary-200/30 dark:border-primary-700/30 hover:shadow-xl"
      style={{ 
        backgroundColor: backgroundColor,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: `0 4px 20px ${section.color}20`
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: `0 20px 40px ${section.color}30`
      }}
      whileTap={{ scale: 0.98 }}
      layout
      onClick={handleCardClick}
    >
      {/* Section Header */}
      <div className="flex relative z-10 justify-between items-center p-6 pb-0 mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="flex justify-center items-center w-10 h-10 rounded-lg shadow-sm transition-all duration-300 ease-out"
            style={{ 
              backgroundColor: section.color,
              boxShadow: `0 0 8px ${section.color}40`
            }}
          >
            <section.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {section.title}
            </h3>
            {/* <button
              onClick={onShowAll}
              className="mt-1 text-xs transition-colors duration-200 cursor-pointer text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {section.documents.length} documents
            </button> */}
          </div>
        </div>

        {/* Upload Button */}
        {onUpload && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onUpload(section.title);
            }}
            className="opacity-0 transition-opacity duration-200 glass-button-icon group-hover:opacity-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Upload to this subject"
          >
            <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Documents List */}
      <div className="flex relative z-10 flex-col flex-1 justify-start px-6 mb-2 min-h-52">
        {displayedDocuments.map((document, index) => (
          <motion.div 
            key={document.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="cursor-pointer group"
            onClick={(e) => {
              e.stopPropagation();
              handleDocumentClick(document);
            }}
          >
            <div className="p-2 mb-2 rounded-lg transition-all duration-200 hover:bg-white/60 dark:hover:bg-black/60">
              <p className="text-sm font-medium text-gray-800 truncate transition-all duration-200 hover:text-primary-600 dark:hover:text-primary-400 dark:text-white">
                {document.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show All Button - Only show if more than 5 documents */}
      {section.documents.length > 5 && (
        <div className="relative z-10 px-6 pt-3 pb-4 mt-auto" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onShowAll();
            }}
            className="flex justify-center items-center px-3 py-2 w-auto text-white rounded-full transition-all duration-200 hover:text-primary-500 bg-primary-500 hover:bg-primary-100 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center w-auto">
              {/* <FileText className="w-3 h-3 text-primary-600 dark:text-primary-400" /> */}
              <span className="text-xs font-medium">
                See More
              </span>
            </div>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
