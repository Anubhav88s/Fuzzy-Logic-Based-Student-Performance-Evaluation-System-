'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white transition-all duration-300 hover:bg-white/30 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative w-5 h-5">
        {/* 
            User Preference: 
            - If Dark Mode -> Show Moon Icon
            - If Light Mode -> Show Sun Icon
        */}
        <Sun className={`w-5 h-5 absolute inset-0 transition-all duration-500 ${!darkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
        <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-500 ${!darkMode ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;
