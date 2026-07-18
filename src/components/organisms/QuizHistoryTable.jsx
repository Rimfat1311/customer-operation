import React from 'react';
import QuizHistoryCard from '../molecules/QuizHistoryCard';

/**
 * Quiz history list with QuizHistoryCard items.
 * @param {Array} quizzes - Array of quiz data objects
 */
export default function QuizHistoryTable({ quizzes }) {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-brand shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">Quiz History</h3>
        <span className="text-xs text-slate-400">Total of {quizzes.length} certifications</span>
      </div>
      
      <div className="space-y-4">
        {quizzes.map((qz) => (
          <QuizHistoryCard key={qz.id} quiz={qz} />
        ))}
      </div>
    </div>
  );
}
