'use client';

import { useState } from 'react';
import StudentForm from '@/components/StudentForm';
import ResultDisplay from '@/components/ResultDisplay';
import MembershipChart from '@/components/MembershipChart';
import RadarChart from '@/components/RadarChart';
import ThemeToggle from '@/components/ThemeToggle';
import HistoryComponent from '@/components/HistoryComponent';
import { evaluateStudent } from '@/lib/fuzzy';
import { Sparkles, Brain, Zap } from 'lucide-react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [studentInputs, setStudentInputs] = useState(null);

  const handleEvaluate = (inputs) => {
    setIsEvaluating(true);
    setTimeout(() => {
      const evaluation = evaluateStudent(inputs);
      const resultWithInputs = { ...evaluation, inputs };
      setResult(resultWithInputs);
      setStudentInputs(inputs);
      setIsEvaluating(false);
    }, 800);
  };

  const handleLoadHistory = (inputs) => {
    setStudentInputs(inputs);
    handleEvaluate(inputs);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors duration-500 relative overflow-hidden">
      {/* Ambient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/20 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />
      </div>
      {/* Header */}
      <header className="animated-gradient shadow-xl relative overflow-hidden">
        {/* Decorative background dots */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-10 w-20 h-20 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-2 right-20 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-2.5 bg-white/15 backdrop-blur-sm rounded-xl">
              <Brain className="text-white w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                NeuroEval
                <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider hidden sm:inline-block">
                  Fuzzy AI
                </span>
              </h1>
              <p className="text-white/60 text-[10px] md:text-xs hidden sm:block">Student Performance Evaluation System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="dashboard-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Input Form & Radar Chart */}
          <div className="lg:col-span-4 space-y-6">
            <StudentForm onEvaluate={handleEvaluate} isEvaluating={isEvaluating} />
            {studentInputs && (
              <div className="animate-slide-up">
                <RadarChart inputs={studentInputs} />
              </div>
            )}
          </div>

          {/* Right Column: Results & Visualizations */}
          <div className="lg:col-span-8 space-y-6">
            {result ? (
              <>
                <ResultDisplay result={result} />

                {/* Membership Charts Grid */}
                <div className="animate-slide-up">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Fuzzy Membership Functions
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MembershipChart variable="attendance" title="📋 Attendance" />
                    <MembershipChart variable="exam" title="📝 Exam Score" />
                    <MembershipChart variable="assignment" title="📄 Assignment" />
                    <MembershipChart variable="participation" title="🗣️ Participation" />
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-16 glass-card rounded-2xl min-h-[500px]">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl scale-150" />
                  <div className="relative p-5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Evaluate
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm leading-relaxed">
                  Enter the student&apos;s performance metrics on the left panel to generate a comprehensive
                  fuzzy logic evaluation with detailed visualizations.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {['Mamdani Inference', 'Centroid Method', '8 Fuzzy Rules', '4 Input Variables'].map((feat) => (
                    <span key={feat} className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* History FAB */}
      <HistoryComponent onLoadHistory={handleLoadHistory} currentResult={result} />

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            NeuroEval — Fuzzy Logic Based Student Performance Evaluation System • Built with Next.js &amp; Chart.js
          </p>
        </div>
      </footer>
    </main>
  );
}
