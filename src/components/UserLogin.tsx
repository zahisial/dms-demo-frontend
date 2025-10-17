import { useState } from 'react';
import { User } from '../types';
import { ThemeProvider } from '../contexts/ThemeContext';
import { mockUsers } from '../data/mockData';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface UserLoginProps {
  onLogin: (user: User) => void;
}

export default function UserLogin({ onLogin }: UserLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleQuickLogin = (user: User) => {
    onLogin(user);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find ISO Administrator user (id: '4') for demo
    const isoAdminUser = mockUsers.find(u => u.id === '4');
    
    if (isoAdminUser) {
      onLogin(isoAdminUser);
    } else {
      // Fallback to first admin user if ISO admin not found
      const adminUser = mockUsers.find(u => u.role === 'admin');
      if (adminUser) {
        onLogin(adminUser);
      } else {
        setError('Unable to log in. Please try again.');
      }
    }

    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: 'url(/bg_login_dms.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <img 
                src="/logo_app_login.png" 
                alt="Edarat DMS" 
                className="h-20 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            </div>
          </div>

          {/* Login Card */}
          <div className="p-8">

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 bg-white/75 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 bg-white/75 focus:bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-56 py-3.5 px-6 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold rounded-lg text-sm transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-sm"
                >
                  <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or try demo accounts</span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="space-y-3 ">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center mb-4">
                Quick Demo Access
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    const u = mockUsers.find(u => u.role === 'admin');
                    if (u) handleQuickLogin(u);
                  }}
                  className="py-3 px-4 text-center rounded-lg border-2  hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                >
                  Admin
                </button>
                <button
                  onClick={() => {
                    const u = mockUsers.find(u => u.role === 'manager');
                    console.log('Manager login clicked, found user:', u);
                    if (u) handleQuickLogin(u);
                  }}
                  className="py-3 px-4 text-center rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                >
                  Manager
                </button>
                <button
                  onClick={() => {
                    const u = mockUsers.find(u => u.role === 'employee');
                    console.log('Employee login clicked, found user:', u);
                    if (u) handleQuickLogin(u);
                  }}
                  className="py-3 px-4 text-center rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-sm text-gray-700 dark:text-gray-300 font-medium transition-all duration-200"
                >
                  Employee
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-2 text-center text-xs text-white/80 space-y-1 drop-shadow">
            <div>© 2025 Edarat Group. All rights reserved.</div>
            <div>Edarat DMS Version 1.0</div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}