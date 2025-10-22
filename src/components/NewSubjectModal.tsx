import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  Palette, 
  FileText, 
  Folder, 
  Users, 
  Settings, 
  Shield, 
  Database, 
  BarChart3, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Zap, 
  Target,
  Award,
  Briefcase,
  Home,
  Building,
  Globe,
  Lock,
  Key,
  Camera,
  Image,
  Music,
  Video,
  Download,
  Upload,
  Share2,
  Edit3,
  Trash2,
  Save,
  Search,
  Filter,
  Eye,
  EyeOff,
  Check,
  X as XIcon,
  AlertCircle,
  Info,
  HelpCircle,
  MessageCircle,
  Bell,
  BellOff,
  User,
  UserPlus,
  UserMinus,
  Users2,
  UserCheck,
  UserX
} from 'lucide-react';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: { title: string; color: string; icon: string }) => void;
}

const colorOptions = [
  '#0AACCC', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

const iconOptions = [
  { name: 'FileText', component: FileText, label: 'Document' },
  { name: 'Folder', component: Folder, label: 'Folder' },
  { name: 'Users', component: Users, label: 'Team' },
  { name: 'Settings', component: Settings, label: 'Settings' },
  { name: 'Shield', component: Shield, label: 'Security' },
  { name: 'Database', component: Database, label: 'Database' },
  { name: 'BarChart3', component: BarChart3, label: 'Analytics' },
  { name: 'Calendar', component: Calendar, label: 'Calendar' },
  { name: 'Mail', component: Mail, label: 'Email' },
  { name: 'Phone', component: Phone, label: 'Contact' },
  { name: 'MapPin', component: MapPin, label: 'Location' },
  { name: 'Clock', component: Clock, label: 'Time' },
  { name: 'Star', component: Star, label: 'Favorite' },
  { name: 'Heart', component: Heart, label: 'Love' },
  { name: 'Zap', component: Zap, label: 'Energy' },
  { name: 'Target', component: Target, label: 'Goal' },
  { name: 'Award', component: Award, label: 'Achievement' },
  { name: 'Briefcase', component: Briefcase, label: 'Work' },
  { name: 'Home', component: Home, label: 'Home' },
  { name: 'Building', component: Building, label: 'Office' },
  { name: 'Globe', component: Globe, label: 'World' },
  { name: 'Lock', component: Lock, label: 'Private' },
  { name: 'Key', component: Key, label: 'Access' },
  { name: 'Camera', component: Camera, label: 'Photo' },
  { name: 'Image', component: Image, label: 'Image' },
  { name: 'Music', component: Music, label: 'Audio' },
  { name: 'Video', component: Video, label: 'Video' },
  { name: 'Download', component: Download, label: 'Download' },
  { name: 'Upload', component: Upload, label: 'Upload' },
  { name: 'Share2', component: Share2, label: 'Share' },
  { name: 'Edit3', component: Edit3, label: 'Edit' },
  { name: 'Save', component: Save, label: 'Save' },
  { name: 'Search', component: Search, label: 'Search' },
  { name: 'Filter', component: Filter, label: 'Filter' },
  { name: 'Eye', component: Eye, label: 'View' },
  { name: 'Check', component: Check, label: 'Complete' },
  { name: 'AlertCircle', component: AlertCircle, label: 'Alert' },
  { name: 'Info', component: Info, label: 'Info' },
  { name: 'HelpCircle', component: HelpCircle, label: 'Help' },
  { name: 'MessageCircle', component: MessageCircle, label: 'Message' },
  { name: 'Bell', component: Bell, label: 'Notification' },
  { name: 'User', component: User, label: 'User' },
  { name: 'Users2', component: Users2, label: 'Users' },
];

export default function NewCardModal({ isOpen, onClose, onAdd }: NewCardModalProps) {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0AACCC');
  const [selectedIcon, setSelectedIcon] = useState('FileText');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim(), color: selectedColor, icon: selectedIcon });
      setTitle('');
      setSelectedColor('#0AACCC');
      setSelectedIcon('FileText');
      onClose();
    }
  };

  const handleClose = () => {
    setTitle('');
    setSelectedColor('#0AACCC');
    setSelectedIcon('FileText');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="overflow-y-auto fixed inset-0 z-50">
          <div className="flex justify-center items-center p-4 min-h-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-sm bg-black/50"
              onClick={handleClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative p-6 w-full max-w-2xl rounded-2xl glass-panel"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                    <Plus className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add New Subject
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg transition-colors glass-button-icon hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-red-500 dark:text-red-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject Title */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter subject title..."
                    className="w-full glass-input"
                    required
                    autoFocus
                  />
                </div>

                {/* Color Selection */}
                <div className=''>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4" />
                      <span>Label Color</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-gray-400 dark:border-gray-500 scale-110'
                            : 'border-gray-200 dark:border-gray-600 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Selected: {selectedColor}
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Subject Icon</span>
                    </div>
                  </label>
                  <div className="grid overflow-y-auto grid-cols-8 gap-2 p-3 max-h-48 bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-800">
                    {iconOptions.map((iconOption) => {
                      const IconComponent = iconOption.component;
                      return (
                        <button
                          key={iconOption.name}
                          type="button"
                          onClick={() => setSelectedIcon(iconOption.name)}
                          className={`p-2 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                            selectedIcon === iconOption.name
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title={iconOption.label}
                        >
                          <IconComponent className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          <span className="max-w-full text-xs text-gray-600 truncate dark:text-gray-400">
                            {iconOption.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Selected: {iconOptions.find(icon => icon.name === selectedIcon)?.label}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview
                  </label>
                  <div className="flex items-center p-3 space-x-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                    <div 
                      className="-mt-2 w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <div className="flex flex-1 items-center space-x-3">
                      {(() => {
                        const IconComponent = iconOptions.find(icon => icon.name === selectedIcon)?.component || FileText;
                        return <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
                      })()}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                          {title || 'Subject Title'}
                        </h4>
                        <p className="mt-1 text-xs text-gray-600 dark:text-white/60">
                          0 documents
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end items-center pt-4 space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="glass-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button-primary"
                    disabled={!title.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Subject</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
