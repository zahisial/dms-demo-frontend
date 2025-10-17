import { motion } from 'framer-motion';
import { ChevronRight, FileText } from 'lucide-react';

interface EDCDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  securityLevel: 'Public' | 'Restricted' | 'Confidential' | 'Top Secret';
}

interface EDCSection {
  id: string;
  title: string;
  color: string;
  documents: EDCDocument[];
}

interface EDCCardProps {
  section: EDCSection;
  onShowAll: () => void;
  onDocumentClick: (document: EDCDocument) => void;
}

export default function EDCCard({ section, onShowAll, onDocumentClick }: EDCCardProps) {
  // Show all documents if 5 or fewer, otherwise show first 5
  const displayedDocuments = section.documents.length <= 5 
    ? section.documents 
    : section.documents.slice(0, 5);

  const handleDocumentClick = (document: EDCDocument) => {
    onDocumentClick(document);
  };

  return (
    <motion.div 
      className="edc-card relative overflow-hidden h-80 flex flex-col"
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: "0 20px 40px rgba(8, 190, 213, 0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Random Shaped Patterns with Primary Accent Branding */}
      <div className="absolute inset-0 pointer-events-none" style={{ filter: 'blur(30px)' }}>
        {/* Large Circle Pattern */}
        <div 
          className="absolute w-32 h-32 rounded-full"
          style={{ 
            backgroundColor: section.color,
            opacity: 0.08,
            top: '-20%',
            right: '-10%',
            transform: 'rotate(45deg)'
          }}
        />
        
        {/* Medium Triangle Pattern */}
        <div 
          className="absolute w-0 h-0"
          style={{ 
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: `35px solid ${section.color}`,
            opacity: 0.06,
            top: '60%',
            left: '-5%',
            transform: 'rotate(30deg)'
          }}
        />
        
        {/* Small Diamond Pattern */}
        <div 
          className="absolute w-16 h-16"
          style={{ 
            backgroundColor: section.color,
            opacity: 0.07,
            top: '20%',
            left: '70%',
            transform: 'rotate(45deg)'
          }}
        />
        
        {/* Organic Blob Pattern */}
        <div 
          className="absolute w-24 h-24"
          style={{ 
            backgroundColor: section.color,
            opacity: 0.05,
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            bottom: '10%',
            right: '20%',
            transform: 'rotate(-20deg)'
          }}
        />
        
        {/* Hexagon Pattern */}
        <div 
          className="absolute w-12 h-12"
          style={{ 
            backgroundColor: section.color,
            opacity: 0.09,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            top: '40%',
            left: '10%',
            transform: 'rotate(15deg)'
          }}
        />
        
        {/* Wave Pattern */}
        <div 
          className="absolute w-20 h-8"
          style={{ 
            backgroundColor: section.color,
            opacity: 0.08,
            borderRadius: '50%',
            top: '80%',
            left: '50%',
            transform: 'rotate(-45deg)'
          }}
        />
      </div>
      {/* Section Header with Primary Accent Branding */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ 
              position: 'relative', 
              top: -8, 
              backgroundColor: section.color,
              boxShadow: `0 0 8px ${section.color}40`
            }}
          >
          </div>
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">
              {section.title}
            </h3>
            <button
              onClick={onShowAll}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-1 transition-colors duration-200 cursor-pointer"
            >
              {section.documents.length} documents
            </button>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col justify-start">
        {displayedDocuments.map((document, index) => (
          <motion.div 
            key={document.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => handleDocumentClick(document)}
          >
            <div className="p-2 rounded-lg hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all duration-200">
              <p className="hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium text-gray-800 dark:text-white truncate group-hover:underline transition-all duration-200">
                {document.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Show All Button with Primary Accent Branding - Only show if more than 5 documents */}
      {section.documents.length > 5 && (
        <div className="relative z-10 pt-4 mt-auto">
          <motion.button
            onClick={onShowAll}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100/50 dark:hover:from-primary-900/30 dark:hover:to-primary-800/20 transition-all duration-200 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Show All Documents
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-primary-500 dark:text-primary-400 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
