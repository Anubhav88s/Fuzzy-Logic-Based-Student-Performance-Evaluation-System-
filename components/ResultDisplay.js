'use client';

import Card from './Card';
import DefuzzificationChart from './DefuzzificationChart';
import { Download, Award, TrendingUp, BarChart3 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResultDisplay = ({ result }) => {
  if (!result) return null;

  const { score, category, aggregated } = result;

  const getCategoryConfig = (cat) => {
    switch (cat.toLowerCase()) {
      case 'excellent': return {
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        gradient: 'from-emerald-400 to-teal-500',
        stroke: '#10b981',
        emoji: '🏆',
      };
      case 'good': return {
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        gradient: 'from-blue-400 to-cyan-500',
        stroke: '#3b82f6',
        emoji: '⭐',
      };
      case 'average': return {
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        gradient: 'from-amber-400 to-orange-500',
        stroke: '#f59e0b',
        emoji: '📊',
      };
      case 'poor': return {
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30',
        gradient: 'from-red-400 to-rose-500',
        stroke: '#ef4444',
        emoji: '⚠️',
      };
      default: return {
        color: 'text-gray-500',
        bg: 'bg-gray-500/10',
        border: 'border-gray-500/30',
        gradient: 'from-gray-400 to-gray-500',
        stroke: '#6b7280',
        emoji: '📋',
      };
    }
  };

  const config = getCategoryConfig(category);
  const circumference = 2 * Math.PI * 70;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    // Visual feedback
    const btn = document.getElementById('download-btn');
    if(btn) {
       btn.innerText = 'Generating...';
       btn.disabled = true;
    }

    try {
      // Small delay to ensure any animations are finished
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: true,
        backgroundColor: null, // Transparent to let onclone set it
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('dashboard-content');
            if (clonedElement) {
                // 1. Force main background
                const isDark = document.documentElement.classList.contains('dark');
                clonedElement.style.backgroundColor = isDark ? '#0f172a' : '#f0f4f8';
                clonedElement.style.color = isDark ? '#e2e8f0' : '#1a202c';
                
                // 2. Aggressively clean ALL elements
                const allElements = clonedElement.querySelectorAll('*');
                allElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    
                    // Fix text color
                    if (style.color && (style.color.includes('lab') || style.color.includes('oklch'))) {
                        el.style.color = isDark ? '#e2e8f0' : '#1a202c';
                    }
                    
                    // Fix background color
                    if (style.backgroundColor && (style.backgroundColor.includes('lab') || style.backgroundColor.includes('oklch'))) {
                         // Heuristic: try to guess if it's a card or general bg
                         el.style.backgroundColor = isDark ? '#1e293b' : '#ffffff';
                    }
                    
                    // Fix borders
                    if (style.borderColor && (style.borderColor.includes('lab') || style.borderColor.includes('oklch'))) {
                        el.style.borderColor = isDark ? '#334155' : '#e2e8f0';
                    }

                    // Remove backdrop filters as they often cause issues
                    el.style.backdropFilter = 'none';
                    el.style.webkitBackdropFilter = 'none';
                    
                    // Remove gradients that might use lab colors
                    if (style.backgroundImage && (style.backgroundImage.includes('lab') || style.backgroundImage.includes('oklch'))) {
                        el.style.backgroundImage = 'none';
                        el.style.backgroundColor = isDark ? '#4f46e5' : '#6366f1'; // Fallback to a nice purple/blue
                    }
                });
            }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Multi-page support if content is long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`neuroeval-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("PDF Export failed", err);
      // Silently fall back to standard print dialog
      window.print();
    } finally {
      if(btn) {
        btn.innerText = 'Export as PDF';
        btn.disabled = false;
      }
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Score Card */}
      <Card glow>
        <div className="text-center relative">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Award className={`w-6 h-6 ${config.color}`} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Evaluation Result</h2>
          </div>

          {/* Circular Score */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 mb-6">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80" cy="80" r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-gray-200 dark:text-gray-700"
                />
                {/* Score circle */}
                <circle
                  cx="80" cy="80" r="70"
                  fill="none"
                  stroke={config.stroke}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * score) / 100}
                  className="score-circle"
                  style={{ filter: `drop-shadow(0 0 6px ${config.stroke}40)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black animate-count ${config.color}`}>
                  {score.toFixed(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mt-1">Performance</span>
              </div>
            </div>

            {/* Category Badge */}
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-base border ${config.bg} ${config.color} ${config.border}`}>
              <span className="text-lg">{config.emoji}</span>
              {category} Performance
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {Object.entries(aggregated).map(([key, value]) => (
              <div key={key} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">{key}</p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">{value.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Download Button */}
          <div className="flex justify-center mt-6">
            <button
              id="download-btn"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-gray-800 to-gray-900 dark:from-gray-600 dark:to-gray-700 text-white rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export as PDF
            </button>
          </div>
        </div>
      </Card>

      {/* Defuzzification Chart */}
      <DefuzzificationChart aggregated={aggregated} score={score} />
    </div>
  );
};

export default ResultDisplay;
