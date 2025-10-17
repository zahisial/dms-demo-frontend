import { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Calendar, 
  ArrowLeft,
  Grid,
  List,
  Folder
} from 'lucide-react';
import { Document } from '../types';
import SearchBar from './SearchBar';

interface SearchResultsPageProps {
  searchQuery: string;
  allDocuments: Document[];
  onDocumentClick: (document: Document) => void;
  onBack: () => void;
}

interface FilterState {
  type: string;
  department: string;
  fileType: string;
  dateRange: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

export default function SearchResultsPage({ 
  searchQuery, 
  allDocuments, 
  onDocumentClick, 
  onBack 
}: SearchResultsPageProps) {
  const [query, setQuery] = useState(searchQuery);
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    department: 'All',
    fileType: 'All',
    dateRange: 'All',
    sortBy: 'relevance',
    sortOrder: 'desc',
    viewMode: 'list'
  });


  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    let results = allDocuments.filter(doc => {
      const searchTerm = query.toLowerCase();
      
      // If search query is empty, show all documents
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.description?.toLowerCase().includes(searchTerm) ||
        doc.department.toLowerCase().includes(searchTerm) ||
        doc.type.toLowerCase().includes(searchTerm) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;

      // Apply filters
      const matchesType = filters.type === 'All' || doc.type === filters.type;
      const matchesDepartment = filters.department === 'All' || doc.department === filters.department;
      const matchesFileType = filters.fileType === 'All' || doc.fileType.toLowerCase() === filters.fileType.toLowerCase();
      
      // Date range filter
      let matchesDateRange = true;
      if (filters.dateRange !== 'All') {
        const now = new Date();
        const docDate = new Date(doc.uploadedAt);
        const daysDiff = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'Today':
            matchesDateRange = daysDiff === 0;
            break;
          case 'This Week':
            matchesDateRange = daysDiff <= 7;
            break;
          case 'This Month':
            matchesDateRange = daysDiff <= 30;
            break;
          case 'This Year':
            matchesDateRange = daysDiff <= 365;
            break;
        }
      }

      return matchesType && matchesDepartment && matchesFileType && matchesDateRange;
    });

    // Sort results
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'relevance':
          // Simple relevance: prioritize title matches, then description
          const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
          const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
          if (aTitleMatch && !bTitleMatch) comparison = -1;
          else if (!aTitleMatch && bTitleMatch) comparison = 1;
          else comparison = 0;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
          break;
        case 'size':
          // Since fileSize doesn't exist, we'll skip this comparison
          comparison = 0;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return results;
  }, [allDocuments, query, filters]);

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
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const getUniqueValues = (key: keyof Document) => {
    const values = new Set(allDocuments.map(doc => {
      const value = doc[key];
      return typeof value === 'string' ? value : String(value);
    }));
    return Array.from(values).sort();
  };

  const clearFilters = () => {
    setFilters({
      type: 'All',
      department: 'All',
      fileType: 'All',
      dateRange: 'All',
      sortBy: 'relevance',
      sortOrder: 'desc',
      viewMode: 'list'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredDocuments.length} results for "{query}"
                </p>
              </div>
            </div>

            {/* Header Right: Inline Search + View Mode Toggle */}
            <div className="flex items-center space-x-3">
              <div className="w-72 sm:w-80 md:w-96">
                <SearchBar
                  onSearch={(q) => setQuery(q)}
                  onShowAllResults={() => {}}
                  onDocumentClick={onDocumentClick}
                  documents={allDocuments}
                  placeholder="Search"
                  className="w-full"
                />
              </div>
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  filters.viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  filters.viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="hidden text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Clear All
                </button>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Types</option>
                  {getUniqueValues('type').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Subjects</option>
                  {getUniqueValues('department').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* File Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Type
                </label>
                <select
                  value={filters.fileType}
                  onChange={(e) => setFilters(prev => ({ ...prev, fileType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All File Types</option>
                  {getUniqueValues('fileType').map(ext => (
                    <option key={ext} value={ext}>{ext.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </select>
              </div>

              {/* Sort Options */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance-desc">Most Relevant</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="size-desc">Largest First</option>
                  <option value="size-asc">Smallest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {filteredDocuments.length > 0 ? (
              <div className={`${filters.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    onClick={() => onDocumentClick(document)}
                    className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary-300 dark:hover:border-primary-600 ${
                      filters.viewMode === 'list' ? 'flex items-start space-x-4' : ''
                    }`}
                  >
                    {/* Document Icon */}
                    <div className={`${filters.viewMode === 'grid' ? 'mb-4' : 'flex-shrink-0'}`}>
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>

                    <div className={`${filters.viewMode === 'list' ? 'flex-1' : ''}`}>
                      {/* Title */}
                      <h3 className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:underline transition-colors duration-200 text-left mb-2 line-clamp-2">
                        {highlightText(document.title, query)}
                      </h3>

                      {/* Document Path */}
                      <div className="flex items-center gap-1 mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-xs text-primary-700 dark:text-primary-300 rounded-md font-medium">
                          <Folder className="w-3 h-3" />
                          {document.department}
                        </span>
                      </div>

                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {/* <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                          <FileText className="w-3 h-3" />
                          {document.fileType.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                          <HardDrive className="w-3 h-3" />
                          {document.type}
                        </span> */}
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                          <Calendar className="w-3 h-3" />
                          {formatDate(document.uploadedAt)}
                        </span>
                        {/* <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-md">
                          <User className="w-3 h-3" />
                          {document.uploadedBy}
                        </span> */}
                      </div>

                      {/* Description */}
                      {document.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                          {highlightText(document.description, query)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
