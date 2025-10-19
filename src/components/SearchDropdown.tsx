import React, { useState, useRef, useEffect } from 'react';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document } from '../types';

interface SearchDropdownProps {
  documents: Document[];
  onShowAllResults: (query: string) => void;
  onDocumentClick: (document: Document) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchDropdown({ 
  documents = [],
  onShowAllResults, 
  onDocumentClick,
  placeholder = "Search",
  className = ""
}: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter documents based on query
  const filteredDocuments = query.trim() 
    ? documents.filter(doc =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.department.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)  // Show max 5 results
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onShowAllResults(query);
        setShowDropdown(false);
      }
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleDocumentClick = (doc: Document) => {
    onDocumentClick(doc);
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border focus:border-primary-500 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showDropdown && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-y-auto absolute right-0 left-0 top-full z-50 mt-2 max-h-96 bg-white rounded-xl border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700"
          >
            {filteredDocuments.length > 0 ? (
              <>
                <div className="p-2">
                  {filteredDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => handleDocumentClick(doc)}
                      className="px-3 py-2 w-full text-left rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{doc.department}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Show All Results Button */}
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      onShowAllResults(query);
                      setShowDropdown(false);
                    }}
                    className="flex justify-between items-center px-3 py-2 w-full text-sm rounded-lg transition-colors text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span>Show all results for "{query}"</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">
                No documents found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
</div>
  );
}
