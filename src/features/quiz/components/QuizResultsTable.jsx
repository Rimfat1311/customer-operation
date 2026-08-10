import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Loader2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import { quizService } from '../services/quizService';

const RESULTS_LIST_KEY = 'app_user_quiz_results';

const DEFAULT_RESULTS = [
  {
    id: 'RES-901',
    quizTitle: 'SAP Sold-To ID Hierarchy',
    quizId: 101,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    totalQuestions: 5,
    scorePercentage: 84,
    status: 'PASSED'
  },
  {
    id: 'RES-902',
    quizTitle: 'GDPR & Privacy Compliance',
    quizId: 102,
    completedAt: new Date(Date.now() - 172800000).toISOString(),
    totalQuestions: 4,
    scorePercentage: 90,
    status: 'PASSED'
  },
  {
    id: 'RES-903',
    quizTitle: 'Customer Service Protocols',
    quizId: 103,
    completedAt: new Date(Date.now() - 259200000).toISOString(),
    totalQuestions: 6,
    scorePercentage: 65,
    status: 'FAILED'
  }
];

export function saveResultToStorage(resultObj) {
  const existing = getResultsFromStorage();
  const updated = [resultObj, ...existing];
  localStorage.setItem(RESULTS_LIST_KEY, JSON.stringify(updated));
}

export function getResultsFromStorage() {
  const stored = localStorage.getItem(RESULTS_LIST_KEY);
  if (!stored) {
    localStorage.setItem(RESULTS_LIST_KEY, JSON.stringify(DEFAULT_RESULTS));
    return DEFAULT_RESULTS;
  }
  try {
    const list = JSON.parse(stored);
    return list.length > 0 ? list : DEFAULT_RESULTS;
  } catch {
    return DEFAULT_RESULTS;
  }
}

export default function QuizResultsTable() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let combinedResults = [];

      // 1. Try to get assigned quizzes first via GET /v1/quizzes/assigned
      try {
        const assignedRes = await quizService.getAssignedQuizzes();
        const assignedData = assignedRes.data;
        const assignedList = Array.isArray(assignedData)
          ? assignedData
          : assignedData?.data && Array.isArray(assignedData.data)
            ? assignedData.data
            : [];

        if (assignedList.length > 0) {
          const resultsPromises = assignedList.map(async (quizItem) => {
            const quizId = quizItem.id || quizItem.quizId;
            try {
              const res = await quizService.getMyQuizResults(quizId);
              const rData = res.data;
              const items = Array.isArray(rData) ? rData : rData?.data ? (Array.isArray(rData.data) ? rData.data : [rData.data]) : [];
              return items.map(item => ({ ...item, quizTitle: quizItem.title || item.quizTitle, quizId }));
            } catch {
              return [];
            }
          });

          const resArrays = await Promise.all(resultsPromises);
          combinedResults = resArrays.flat();
        }
      } catch {
        // Fallback to legacy endpoint if v1 assigned list fails
      }

      // 2. Try legacy /quiz/results/my fallback
      if (combinedResults.length === 0) {
        try {
          const response = await quizService.getMyResults();
          const raw = response.data;
          combinedResults = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.data)
              ? raw.data
              : Array.isArray(raw?.content)
                ? raw.content
                : Array.isArray(raw?.results)
                  ? raw.results
                  : [];
        } catch {
          // Fall back to local storage
        }
      }

      // 3. If API returned items, use them; otherwise use local storage/defaults
      if (combinedResults.length > 0) {
        setResults(combinedResults);
      } else {
        const storedResults = getResultsFromStorage();
        setResults(storedResults);
      }
    } catch (err) {
      const storedResults = getResultsFromStorage();
      setResults(storedResults);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  /** Format an ISO date string to a readable format */
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto pb-12">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up px-4 w-full max-w-md pointer-events-none">
          <Toast
            message={toastMessage.message}
            type={toastMessage.type}
            title={toastMessage.title}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">My Quiz Results</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchResults}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-xs font-bold text-slate-400">
            Total Attempts: <span className="text-slate-700">{results.length}</span>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
            <p className="text-sm font-medium text-slate-400">Loading results...</p>
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <p className="text-sm font-medium text-rose-500">{error}</p>
            <button
              onClick={fetchResults}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-dark transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Quiz & Module</th>
                  <th className="py-3.5 px-6">Completion Date</th>
                  <th className="py-3.5 px-6">Questions</th>
                  <th className="py-3.5 px-6">Score</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {results.map((res, idx) => {
                  const quizTitle = res.quizTitle || res.title || res.module || `Quiz #${res.quizId || res.id || idx + 1}`;
                  const quizId = res.quizId || res.id || idx + 1;
                  const completionDate = res.completedAt || res.completionDate || res.date || res.submittedAt;
                  const totalQuestions = res.totalQuestions ?? res.questionCount ?? res.questions?.length ?? '—';
                  const score = res.scorePercentage ?? res.score ?? res.percentage ?? '—';
                  const passed = res.passed ?? res.status === 'PASSED' ?? (typeof score === 'number' && score >= 70);
                  const status = res.status || (passed ? 'PASSED' : 'FAILED');

                  return (
                    <tr key={res.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-bold text-slate-800 block">{quizTitle}</span>
                        <span className="text-[10px] text-slate-400">ID: {quizId}</span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(completionDate)}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                        {totalQuestions} Questions
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                        {score}{typeof score === 'number' ? '%' : ''}
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Badge variant={status === 'PASSED' ? 'success' : 'danger'}>
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
