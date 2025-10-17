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

      {/* Advanced Filters Button */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
        <Popover.Root open={showFilters} onOpenChange={setShowFilters}>
          <Popover.Trigger asChild>
            <button
              className={`p-2 rounded-lg transition-all duration-200 ${
                hasActiveFilters
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </Popover.Trigger>
          
          <Popover.Portal>
            <Popover.Content
              className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 z-50"
              sideOffset={5}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => updateFilter('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Subjects</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Types</option>
                    <option value="Policy">Policy</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Manual">Manual</option>
                    <option value="Form">Form</option>
                    <option value="Report">Report</option>
                  </select>
                </div>

                {/* File Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File Type
                  </label>
                  <select
                    value={filters.fileType}
                    onChange={(e) => updateFilter('fileType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All File Types</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">DOC</option>
                    <option value="docx">DOCX</option>
                    <option value="xls">XLS</option>
                    <option value="xlsx">XLSX</option>
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => updateFilter('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Time</option>
                    <option value="Last 7 days">Last 7 days</option>
                    <option value="Last 30 days">Last 30 days</option>
                    <option value="Last 90 days">Last 90 days</option>
                    <option value="Last year">Last year</option>
                  </select>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="glass-button-primary"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}