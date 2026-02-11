'use client';

import { useState, useEffect } from 'react';
import { History, Trash2, X, Clock, ArrowRight } from 'lucide-react';

const HistoryComponent = ({ onLoadHistory, currentResult }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('evalHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (currentResult && currentResult.inputs) {
      setHistory(prev => {
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          inputs: currentResult.inputs,
          score: currentResult.score,
          category: currentResult.category,
        };

        if (prev.length > 0) {
          const last = prev[0];
          if (JSON.stringify(last.inputs) === JSON.stringify(newEntry.inputs)) {
            return prev;
          }
        }

        const updated = [newEntry, ...prev].slice(0, 50);
        localStorage.setItem('evalHistory', JSON.stringify(updated));
        return updated;
      });
    }
  }, [currentResult]);

  const clearHistory = () => {
    if (confirm('Clear all evaluation history?')) {
      setHistory([]);
      localStorage.removeItem('evalHistory');
    }
  };

  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'Excellent': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Good': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Average': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    }
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 animated-gradient text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all z-50 flex items-center gap-2 hover:scale-105 active:scale-95"
        aria-label="View History"
      >
        <History className="w-5 h-5" />
        {history.length > 0 && (
          <span className="bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        )}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full sm:max-w-sm glass-card h-full shadow-2xl overflow-y-auto animate-slide-up" style={{ borderLeft: '1px solid rgba(148,163,184,0.2)' }}>
            <div className="sticky top-0 z-10 glass-card p-5 border-b border-gray-200/20 dark:border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">History</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-5">
              {history.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No evaluations yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={clearHistory}
                      className="text-red-500 text-xs flex items-center gap-1 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                  </div>
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all bg-white/50 dark:bg-gray-800/50 cursor-pointer group hover:border-indigo-300 dark:hover:border-indigo-700"
                      onClick={() => {
                        onLoadHistory(entry.inputs);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-gray-400">{entry.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryStyle(entry.category)}`}>
                          {entry.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black text-gray-800 dark:text-white">
                          {entry.score.toFixed(1)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {Object.entries(entry.inputs).map(([key, val]) => (
                          <span key={key} className="text-[10px] bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
                            {key.slice(0, 3).toUpperCase()}: {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryComponent;
