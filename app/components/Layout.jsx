// app/components/Layout.jsx - 共通レイアウトコンポーネント
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // ユーザーの好みや設定からダークモード設定を読み込む
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(localStorage.getItem('darkMode') === 'true' || prefersDark);
  }, []);
  
  useEffect(() => {
    // ダークモード設定を適用
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-amber-50 text-gray-800'
    }`}>
      <header className={`py-4 px-6 ${
        isDarkMode ? 'bg-gray-800 shadow-md' : 'bg-amber-100 shadow-sm border-b border-amber-200'
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <div className={`mr-3 p-2 rounded-md ${
              isDarkMode ? 'bg-gray-700' : 'bg-amber-200'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                isDarkMode ? 'text-amber-400' : 'text-amber-700'
              }`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className={`${
              isDarkMode 
                ? 'text-gray-100' 
                : 'text-amber-900'
            } font-semibold tracking-tight`}>
              お絵描き採点
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md ${
                isDarkMode 
                  ? 'bg-gray-700 text-amber-400' 
                  : 'bg-amber-200 text-amber-700'
              }`}
              aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className={`py-4 px-6 mt-8 ${
        isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-amber-100 border-t border-amber-200'
      }`}>
        <div className="container mx-auto text-center text-sm">
          <p className={isDarkMode ? 'text-gray-400' : 'text-amber-800'}>
            &copy; {new Date().getFullYear()} お絵描き採点サイト
          </p>
        </div>
      </footer>
    </div>
  );
}