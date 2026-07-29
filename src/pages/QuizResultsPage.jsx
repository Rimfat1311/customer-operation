import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function QuizResultsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] animate-slide-up text-center px-4">
      <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary/5 animate-ping opacity-50 rounded-full"></div>
        <Clock className="w-10 h-10 text-brand-primary relative z-10" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
        Quizzes & Certifications
      </h2>
      
      <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-8">
        We are currently building a comprehensive quiz and certification system to help you track your progress and knowledge. This feature will be available very soon.
      </p>
      
      <div className="bg-amber-50 text-amber-700 border border-amber-200/50 rounded-2xl p-4 flex items-start sm:items-center gap-3 max-w-sm w-full mx-auto shadow-sm transition-transform hover:scale-[1.02]">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
        <span className="text-xs font-semibold text-left">
          Check back later for updates on your training progress and exam results!
        </span>
      </div>
    </div>
  );
}
