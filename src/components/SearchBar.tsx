import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';
import { Document } from '../types';
import SearchDropdown from './SearchDropdown';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onShowAllResults: (query: string) => void;
  onDocumentClick: (document: Document) => void;
  placeholder?: string;
  documents?: Document[];
  className?: string;
}

export interface SearchFilters {
  department: string;
  type: string;
  fileType: string;
  dateRange: string;
}

export default function SearchBar({ 
  onSearch, 
  onShowAllResults,
  onDocumentClick,
  placeholder = "Search", 
  documents = [],
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    department: 'All',
    type: 'All',
    fileType: 'All',
    dateRange: 'All',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      department: 'All',
      type: 'All',
      fileType: 'All',
      dateRange: 'All',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== 'All');

  return (
    <div className={`relative ${className}`}>
      {/* Search Input with Dropdown */}
      <SearchDropdown
        documents={documents}
        onShowAllResults={onShowAllResults}
        onDocumentClick={onDocumentClick}
        placeholder={placeholder}
        className="w-full"
      />

     
    </div>
  );
}