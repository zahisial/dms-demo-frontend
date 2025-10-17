import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

interface ISO9000Document {
  id: string;
  title: string;
  type: string;
  url: string;
  securityLevel: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret';
}

interface ISO9000Section {
  id: string;
  title: string;
  color: string;
  icon: React.ComponentType<any>;
  documents: ISO9000Document[];
}

interface ISO9000CardProps {
  section: ISO9000Section;
  onShowAll: () => void;
  onDocumentClick: (document: ISO9000Document) => void;
}

export default function ISO9000Card({ section, onShowAll, onDocumentClick }: ISO9000CardProps) {
  // Show all documents if 5 or fewer, otherwise show first 5
  const displayedDocuments = section.documents.length <= 5 
    ? section.documents 
    : section.documents.slice(0, 5);

  const handleDocumentClick = (document: ISO9000Document) => {
    console.log('ISO9000Card: Document clicked:', document.title);
    onDocumentClick(document);
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
      className="relative overflow-hidden h-80 flex flex-col rounded-2xl border border-primary-200/30 dark:border-primary-700/30 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
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
    >
      {/* Section Header */}
      <div className="relative z-10 flex items-center justify-between mb-4 p-6 pb-0">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ease-out shadow-sm"
            style={{ 
              backgroundColor: section.color,
              boxShadow: `0 0 8px ${section.color}40`
            }}
          >
            <section.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              {section.title}
            </h3>
            {/* <button
              onClick={onShowAll}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-1 transition-colors duration-200 cursor-pointer"
            >
              {section.documents.length} documents
            </button> */}
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="relative z-10 flex-1 flex flex-col justify-start px-6">
        {displayedDocuments.map((document, index) => (
          <motion.div 
            key={document.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => handleDocumentClick(document)}
          >
            <div className="p-2 rounded-lg hover:bg-white/30 dark:hover:bg-black/20 transition-all duration-200">
              <p className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-800 truncate group-hover:underline transition-all duration-200">
                {document.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show All Button - Only show if more than 5 documents */}
      {section.documents.length > 5 && (
        <div className="relative z-10 pt-3 mt-auto px-6 pb-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <motion.button
            onClick={onShowAll}
            className="text-white hover:text-primary-500 flex items-center justify-center w-auto rounded-full bg-primary-500 py-2 px-3 hover:bg-primary-100 transition-all duration-200 group"
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
