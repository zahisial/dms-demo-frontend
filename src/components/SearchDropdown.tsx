import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Document } from '../types';

interface SearchDropdownProps {
  documents: Document[];
  onShowAllResults: (query: string) => void;
  onDocumentClick: (document: Document) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchDropdown({ 
  onShowAllResults, 
  placeholder = "Search",
  className = ""
}: SearchDropdownProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        onShowAllResults(query);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border focus:border-primary-500 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );
}
