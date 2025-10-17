import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Palette, 
  Globe, 
  Bell, 
  Save,
  X,
  Check,
  Moon,
  Sun,
  Clock
} from 'lucide-react';
import { User as UserType } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileSettingsProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onClose: () => void;
}

export default function ProfileSettings({ user, onUpdateUser, onClose }: ProfileSettingsProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    photo: user.avatar || '',
    language: 'English', // 'English' or 'Arabic'
    timezone: 'UTC+3 (Arab Standard Time)',
    emailNotifications: true
  });

  // Language toggle between English and Arabic
  const toggleLanguage = () => {
    setSettings(prev => ({ 
      ...prev, 
      language: prev.language === 'English' ? 'Arabic' : 'English' 
    }));
  };

  const timezones = [
    'UTC+3 (Arab Standard Time)',
    'UTC+0 (GMT)',
    'UTC-5 (EST)',
    'UTC-8 (PST)',
    'UTC+1 (CET)',
    'UTC+9 (JST)',
    'UTC+5:30 (IST)'
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user with new settings
      onUpdateUser({
        avatar: settings.photo,
        // Note: language, timezone, emailNotifications would typically be stored separately
        // as they're not part of the User type, but we'll handle them locally
        // Theme is handled by ThemeContext
      });
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your account preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Photo */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Camera className="w-4 h-4" />
              <span>Profile Photo</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                  {settings.photo ? (
                    <img 
                      src={settings.photo} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the camera icon to change your photo
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  JPG, PNG up to 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Theme</span>
            </label>
            <div className="flex space-x-3">
              <button
                onClick={toggleTheme}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                  !isDark
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                  isDark
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Language</span>
            </label>
            <div className="flex space-x-3">
              <button
                onClick={toggleLanguage}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                  settings.language === 'English'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-sm font-medium">English</span>
              </button>
              <button
                onClick={toggleLanguage}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                  settings.language === 'Arabic'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-sm font-medium">العربية</span>
              </button>
            </div>
          </div>

          {/* Timezone */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Timezone</span>
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* Email Notifications */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Email Notifications</span>
            </label>
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Receive email notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified about document updates and system alerts
                </p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-2 text-green-600 dark:text-green-400"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Settings saved!</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}