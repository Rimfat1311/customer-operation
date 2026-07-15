import React from 'react';
import { Award, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

const RECENT_QUIZZES = [
  {
    id: 'QZ-309',
    title: 'Customer Data Protection & GDPR Compliance',
    date: 'Jul 14, 2026',
    score: 92,
    passingScore: 80,
    status: 'Passed',
    questionsCount: 25
  },
  {
    id: 'QZ-305',
    title: 'SAP Sold-To ID Hierarchy & Account Mapping',
    date: 'Jul 10, 2026',
    score: 84,
    passingScore: 80,
    status: 'Passed',
    questionsCount: 15
  },
  {
    id: 'QZ-298',
    title: 'Active Listening & Phone Communication Basics',
    date: 'Jul 05, 2026',
    score: 76,
    passingScore: 75,
    status: 'Passed',
    questionsCount: 20
  },
  {
    id: 'QZ-289',
    title: 'LAP Contact Center Call Routing Protocol',
    date: 'Jun 28, 2026',
    score: 68,
    passingScore: 75,
    status: 'Failed (Retake Required)',
    questionsCount: 30
  }
];

export default function QuizResultsPage() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">My Quiz Results</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Review your training progress, quiz performance scores, and cert history.</p>
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Quizzes Attempted</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-brand-primary font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +2
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">12</p>
          <p className="text-[10px] text-slate-400 mt-1">Last taken yesterday</p>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Correct Answers</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
              +24
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">188</p>
          <p className="text-[10px] text-slate-400 mt-1">84% accuracy rate</p>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Pending Retakes</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
              1 Alert
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">1</p>
          <p className="text-[10px] text-slate-400 mt-1">Routing Protocol quiz</p>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-brand shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 font-medium">Study Hours</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold">
              +4h
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">24h</p>
          <p className="text-[10px] text-slate-400 mt-1">8h online courseware</p>
        </div>

      </div>

      {/* Main stats layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: History of Quizzes */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 p-5 rounded-brand shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Quiz History</h3>
              <span className="text-xs text-slate-400">Total of 4 certifications</span>
            </div>
            
            <div className="space-y-4">
              {RECENT_QUIZZES.map((qz) => (
                <div key={qz.id} className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-brand transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                      qz.status.includes('Passed') ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {qz.status.includes('Passed') ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{qz.title}</h4>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-light">
                        <span className="font-mono">#{qz.id}</span>
                        <span>·</span>
                        <span>{qz.questionsCount} questions</span>
                        <span>·</span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-0.5" />
                          {qz.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 self-end sm:self-center flex-shrink-0">
                    <div className="text-right">
                      <span className="block font-bold text-sm text-slate-800">{qz.score}%</span>
                      <span className="block text-[10px] text-slate-400 font-light">Pass score: {qz.passingScore}%</span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      qz.status.includes('Passed') 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {qz.status.includes('Passed') ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Charts from original DashboardPage */}
        <div className="xl:col-span-4 space-y-6">
          {/* Circular Indicator */}
          <div className="bg-white border border-slate-100 rounded-brand p-5 flex flex-col items-center shadow-sm">
            <div className="flex justify-between items-center w-full mb-4">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Average Accuracy Score</h4>
              <span className="text-[10px] px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full font-bold">Overall</span>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  fill="transparent" 
                  stroke="#2563EB" 
                  strokeWidth="8" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="40.2" // 84% score
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-slate-800">84</span>
                <span className="text-sm font-semibold text-slate-500">%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-5 text-center text-[10px]">
              <div>
                <span className="w-2 h-2 rounded-full bg-brand-success inline-block mr-1" />
                <span className="block font-bold text-slate-700">92%</span>
                <span className="text-slate-400">GDPR</span>
              </div>
              <div>
                <span className="w-2 h-2 rounded-full bg-brand-primary inline-block mr-1" />
                <span className="block font-bold text-slate-700">84%</span>
                <span className="text-slate-400">SAP</span>
              </div>
              <div>
                <span className="w-2 h-2 rounded-full bg-brand-secondary inline-block mr-1" />
                <span className="block font-bold text-slate-700">76%</span>
                <span className="text-slate-400">Listening</span>
              </div>
            </div>
          </div>

          {/* Activity Bar Chart */}
          <div className="bg-white border border-slate-100 rounded-brand p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Study Time Log</h4>
              <span className="text-[10px] text-slate-400 font-light">Last 7 Days</span>
            </div>

            <div className="flex justify-between items-end h-28 pt-2">
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '40px' }} title="Monday: 2 hours" />
                <span className="text-[9px] font-semibold text-slate-400">M</span>
              </div>
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '70px' }} title="Tuesday: 4 hours" />
                <span className="text-[9px] font-semibold text-slate-400">T</span>
              </div>
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '55px' }} title="Wednesday: 3 hours" />
                <span className="text-[9px] font-semibold text-slate-400">W</span>
              </div>
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary hover:bg-blue-700 rounded-t transition-all cursor-pointer" style={{ height: '90px' }} title="Thursday: 5 hours" />
                <span className="text-[9px] font-semibold text-brand-primary font-bold">T</span>
              </div>
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary/20 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '65px' }} title="Friday: 3.5 hours" />
                <span className="text-[9px] font-semibold text-slate-400">F</span>
              </div>
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary/10 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '30px' }} title="Saturday: 1.5 hours" />
                <span className="text-[9px] font-semibold text-slate-400">S</span>
              </div>
              <div className="flex flex-col items-center space-y-1 w-full">
                <div className="w-2.5 bg-brand-primary/10 hover:bg-brand-primary rounded-t transition-all cursor-pointer" style={{ height: '20px' }} title="Sunday: 1 hour" />
                <span className="text-[9px] font-semibold text-slate-400">S</span>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-[10px] text-slate-500">
              <span>24 Study Hours This Week</span>
              <span className="text-brand-success font-semibold flex items-center">
                +15% vs last week
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
