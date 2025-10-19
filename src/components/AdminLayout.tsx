import React, { useState } from 'react';
import { Home, List, Grid, TreePine, Bell, LogOut, Globe, Server, Shield, Award, Moon, Sun, Menu, Settings, FileCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType } from '../types';
import { getUserNotifications, mockDocuments } from '../data/mockData';
import NotificationPanel from './NotificationPanel';
import ProfileSettings from './ProfileSettings';
import AvatarImage from './AvatarImage';
import { useTheme } from '../contexts/ThemeContext';
import Dashboard from './Dashboard';
import TreeExamples from './TreeExamples';
import SearchBar from './SearchBar';

interface AdminLayoutProps {
  user: UserType;
  children: React.ReactNode;
  onSearch: (query: string, filters: any) => void;
  onUploadClick: () => void;
  onLogout: () => void;
  viewMode: 'list' | 'grid' | 'tree';
  onViewModeChange: (mode: 'list' | 'grid' | 'tree') => void;
  onUpdateUser?: (updates: Partial<UserType>) => void;
  onNavigateToISO2?: () => void;
  onNavigateToEDC?: () => void;
  onNavigateToCE?: () => void;
  onNavigateToISO9000?: () => void;
  onNavigateToPendingApprovals?: () => void;
  currentPage?: 'main' | 'iso2' | 'edc' | 'ce' | 'iso9000' | 'pending-approvals' | 'docsdb' | 'document';
  onShowAllResults?: (query: string) => void;
  onDocumentClick?: (document: any) => void;
  totalPendingCount?: number;  // Total pending documents across all pages
}

type AdminView = 'dashboard' | 'iso' | 'edc' | 'ce' | 'iso9000' | 'docsdb' | 'tree-examples';

export default function AdminLayout({ 
  user, 
  children, 
  onSearch, 
  onUploadClick, 
  onLogout, 
  viewMode, 
  onViewModeChange,
  onUpdateUser,
  onNavigateToISO2,
  onNavigateToEDC,
  onNavigateToCE,
  onNavigateToISO9000,
  onNavigateToPendingApprovals,
  currentPage = 'main',
  onShowAllResults,
  onDocumentClick,
  totalPendingCount = 0
}: AdminLayoutProps) {
  const [activeView, setActiveView] = useState<AdminView>('iso9000');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(() => getUserNotifications(user.role));

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Filter sidebar items based on user role
  const allSidebarItems = [
    { id: 'docsdb' as AdminView, label: 'Documents', icon: 'icon_db.png', roles: ['admin', 'manager', 'employee'] },
    { id: 'iso9000' as AdminView, label: 'ISO9001', icon: 'icon_iso.png', roles: ['admin', 'manager', 'employee'] },
    { id: 'ce' as AdminView, label: 'CE', icon: 'icon_cs.png', roles: ['admin', 'manager', 'employee'] },
  ];
  
  const sidebarItems = allSidebarItems.filter(item => item.roles.includes(user.role));

  const handleSidebarItemClick = (itemId: AdminView) => {
    if (itemId === 'docsdb') {
      // Navigate to documents page
      window.location.href = '/docsdb';
    } else if (itemId === 'iso9000' && onNavigateToISO9000) {
      onNavigateToISO9000();
    } else if (itemId === 'ce' && onNavigateToCE) {
      onNavigateToCE();
    } else {
      setActiveView(itemId);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Compact Sidebar - Only for admin users */}
      <AnimatePresence>
        {user.role === 'admin' && showSidebar && (
          <motion.div 
            className="flex flex-col w-16 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            initial={{ x: -64 }}
            animate={{ x: 0 }}
            exit={{ x: -64 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
          {/* Menu Toggle */}
          <div className="flex justify-center items-center h-16 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowSidebar(false)}
              className="flex justify-center items-center w-12 h-12 text-gray-500 rounded-lg transition-colors duration-200 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
              title="Hide Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className="px-2 space-y-2">
            {sidebarItems.map((item) => {
              // Map currentPage to sidebar item IDs
              const isActive = (() => {
                switch (currentPage) {
                  case 'docsdb':
                    return item.id === 'iso9000'; // Make ISO active on document pages
                  case 'iso9000':
                    return item.id === 'iso9000';
                  case 'ce':
                    return item.id === 'ce';
                  default:
                    return false;
                }
              })();
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarItemClick(item.id)}
                  className={`w-12 h-12 flex items-center justify-center transition-colors duration-200 relative group ${
                    isActive 
                      ? 'relative w-20 bg-gray-200 rounded-r-full rounded-l-lg dark:bg-primary-50' 
                      : 'rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={item.label}
                >
                  <img 
                    src={`/${item.icon}`}
                    alt={item.label}
                    className={`w-12 h-12 object-contain ${
                      isActive 
                        ? 'opacity-100' 
                        : 'opacity-100 hover:opacity-100'
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-6 h-6 bg-gray-400 rounded"></div>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full z-50 px-2 py-1 ml-2 text-xs text-white whitespace-nowrap bg-gray-900 rounded opacity-0 transition-opacity duration-200 pointer-events-none dark:bg-gray-700 group-hover:opacity-100">
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Invisible TreeExamples Access - Cmd+Click */}
        <div 
          className="w-full h-8 cursor-default" 
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey) {
              setActiveView('tree-examples');
            }
          }}
          title=""
        />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Header */}
        <header className="flex items-center px-6 h-16 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {/* Left side - Menu Toggle + App Logo and Name */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Menu - Show only for admin users when sidebar is hidden */}
            {user.role === 'admin' && !showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="flex justify-center items-center w-10 h-10 text-gray-500 rounded-lg transition-colors duration-200 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                title="Show Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="flex justify-center items-center">
              <img 
                src="/logo_header_dms.png" 
                alt="Edarat DMS"
                className="object-contain w-auto h-10 rounded-sm"
                style={{ maxHeight: '48px' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-sm font-bold text-primary-500">E</span>
            </div>
            
          </div>

          <div className="flex flex-1 justify-end items-right">
            {/* middle section */}
            <div className="w-96">
              <SearchBar
                onSearch={(query, filters) => {
                  setSearchQuery(query);
                }}
                onShowAllResults={onShowAllResults || (() => {})}
                onDocumentClick={(doc) => handleDocumentClick(doc as any)}
                documents={mockDocuments}
                placeholder="Search"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 rounded-md transition-colors duration-200 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-500 rounded-md transition-colors duration-200 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 text-white text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Pending Approvals - Only for managers and admins */}
            {(user.role === 'manager' || user.role === 'admin') && (
              <button
                onClick={onNavigateToPendingApprovals}
                className="relative p-2 text-gray-500 rounded-md transition-colors duration-200 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                title="Pending Approvals"
              >
                <FileCheck className="w-4 h-4" />
                {totalPendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {totalPendingCount}
                  </span>
                )}
              </button>
            )}

            {/* User Avatar and Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center p-2 space-x-2 rounded-md transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <AvatarImage 
                  src={user.avatar || ''} 
                  alt={user.name}
                  className="object-cover w-7 h-7 rounded-full"
                  fallbackClassName="w-7 h-7 rounded-full flex items-center justify-center"
                />
                <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
                  {user.name}
                </span>
              </button>

              {/* User Menu Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 top-full z-50 py-1 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileSettings(true);
                        setShowUserMenu(false);
                      }}
                      className="flex items-center px-3 py-2 space-x-2 w-full text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="flex items-center px-3 py-2 space-x-2 w-full text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="overflow-auto flex-1" style={{ height: 'calc(100vh - 4rem)' }}>
          {currentPage === 'main' ? (
            <Dashboard user={user} />
          ) : activeView === 'tree-examples' ? (
            <TreeExamples onBack={() => setActiveView('dashboard')} />
          ) : (
            <div className="p-6 h-full">
              {children}
            </div>
          )}
        </main>
      </div>

      {/* Removed bottom-left floating button */}

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Profile Settings Modal */}
      {showProfileSettings && onUpdateUser && (
        <ProfileSettings
          user={user}
          onUpdateUser={onUpdateUser}
          onClose={() => setShowProfileSettings(false)}
        />
      )}
    </div>
  );
}
