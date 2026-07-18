import React from 'react';
import { CheckCircle, Award, Calendar } from 'lucide-react';
import Badge from '../atoms/Badge';

/**
 * A single quiz result row with pass/fail icon, title, metadata, score, and status badge.
 * @param {object} quiz - Quiz data object { id, title, date, score, passingScore, status, questionsCount }
 */
export default function QuizHistoryCard({ quiz }) {
  const passed = quiz.status.includes('Passed');

  return (
    <div className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-brand transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div className="flex items-start space-x-3.5 min-w-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
          passed ? 'bg-emerald-500' : 'bg-rose-500'
        }`}>
          {passed ? <CheckCircle className="w-5 h-5" /> : <Award className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{quiz.title}</h4>
          <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-light">
            <span className="font-mono">#{quiz.id}</span>
            <span>·</span>
            <span>{quiz.questionsCount} questions</span>
            <span>·</span>
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-0.5" />
              {quiz.date}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3.5 self-end sm:self-center flex-shrink-0">
        <div className="text-right">
          <span className="block font-bold text-sm text-slate-800">{quiz.score}%</span>
          <span className="block text-[10px] text-slate-400 font-light">Pass score: {quiz.passingScore}%</span>
        </div>
        <Badge variant={passed ? 'emerald' : 'rose'}>
          {passed ? 'Passed' : 'Failed'}
        </Badge>
      </div>
    </div>
  );
}
