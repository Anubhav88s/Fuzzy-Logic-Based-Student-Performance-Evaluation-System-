'use client';

import { useState } from 'react';
import Card from './Card';
import { RefreshCw, Sparkles, BookOpen, FileCheck, GraduationCap, Users } from 'lucide-react';

const getScoreColor = (value) => {
  if (value >= 80) return 'from-emerald-400 to-emerald-600';
  if (value >= 60) return 'from-blue-400 to-blue-600';
  if (value >= 40) return 'from-amber-400 to-amber-600';
  return 'from-red-400 to-red-600';
};

const getScoreBg = (value) => {
  if (value >= 80) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  if (value >= 60) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
  if (value >= 40) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return 'bg-red-500/10 text-red-600 dark:text-red-400';
};

const icons = {
  attendance: BookOpen,
  assignment: FileCheck,
  exam: GraduationCap,
  participation: Users,
};

const InputGroup = ({ label, name, value, onChange, icon: Icon }) => (
  <div className="mb-5 group">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${getScoreBg(value)}`}>
          <Icon className="w-4 h-4" />
        </div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      </div>
      <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${getScoreBg(value)}`}>
        {value}%
      </span>
    </div>
    <div className="relative">
      <div className="absolute inset-0 rounded-full overflow-hidden h-2 top-[5px]">
        <div
          className={`h-full bg-linear-to-r ${getScoreColor(value)} transition-all duration-300 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
      <input
        type="range"
        name={name}
        min={0}
        max={100}
        value={value}
        onChange={onChange}
        className="w-full relative z-10 bg-transparent cursor-pointer"
        style={{ background: 'transparent' }}
      />
    </div>
  </div>
);

const StudentForm = ({ onEvaluate, isEvaluating }) => {
  const [inputs, setInputs] = useState({
    attendance: 75,
    assignment: 60,
    exam: 65,
    participation: 70,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEvaluate(inputs);
  };

  const fields = [
    { label: 'Attendance', name: 'attendance', icon: icons.attendance },
    { label: 'Assignment Score', name: 'assignment', icon: icons.assignment },
    { label: 'Exam Score', name: 'exam', icon: icons.exam },
    { label: 'Class Participation', name: 'participation', icon: icons.participation },
  ];

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Student Metrics</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Adjust the parameters below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <InputGroup
            key={field.name}
            label={field.label}
            name={field.name}
            value={inputs[field.name]}
            onChange={handleChange}
            icon={field.icon}
          />
        ))}

        <button
          type="submit"
          disabled={isEvaluating}
          className="w-full mt-4 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isEvaluating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Evaluate Performance</span>
            </>
          )}
        </button>
      </form>
    </Card>
  );
};

export default StudentForm;
