import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, FileText, Calendar, HardDrive } from 'lucide-react';
import { Document } from '../types';

interface SearchDropdownProps {
  documents: Document[];
  onShowAllResults: (query: string) => void;
  onDocumentClick: (document: Document) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchDropdown({ 
  documents, 
  onShowAllResults, 
  onDocumentClick,
  placeholder = "Search",
  className = ""
}: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter documents based on search query
  const filteredDocuments = React.useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.description?.toLowerCase().includes(searchTerm) ||
      doc.department.toLowerCase().includes(searchTerm) ||
      doc.type.toLowerCase().includes(searchTerm) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Show max 5 results in dropdown
  }, [documents, query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredDocuments.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredDocuments.length) {
          onDocumentClick(filteredDocuments[highlightedIndex]);
          handleClose();
        } else if (query.trim()) {
          onShowAllResults(query);
          handleClose();
        }
        break;
      case 'Escape':
        handleClose();
        break;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    // Just open the dropdown if there's a query, don't navigate
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputClick = () => {
    // Open dropdown when clicking if there's a query
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.trim().length > 0);
    setHighlightedIndex(-1);
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border focus:border-primary-500 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          {!query.trim() ? (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Start typing to search documents...</p>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <>
              {/* Search Results */}
              {filteredDocuments.map((document, index) => (
                <div
                  key={document.id}
                  onClick={() => {
                    onDocumentClick(document);
                    handleClose();
                  }}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors duration-150 ${
                    index === highlightedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  } ${index === filteredDocuments.length - 1 ? 'border-b-0' : ''}`}
                >
                  {/* Title */}
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {highlightText(document.title, query)}
                  </h4>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                      <FileText className="w-3 h-3" />
                      {document.fileType.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                      <HardDrive className="w-3 h-3" />
                      {document.type}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                      <Calendar className="w-3 h-3" />
                      {formatDate(document.uploadedAt)}
                    </span>
                  </div>

                  {/* Description with highlighted keywords */}
                  {document.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {highlightText(document.description, query)}
                    </p>
                  )}
                </div>
              ))}

              {/* Show All Results Link */}
              <div
                onClick={() => {
                  onShowAllResults(query);
                  handleClose();
                }}
                className="p-4 bg-primary-50 dark:bg-primary-900/20 border-t border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-700 dark:text-primary-300">
                    Show all results for "{query}"
                  </span>
                  <Filter className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
