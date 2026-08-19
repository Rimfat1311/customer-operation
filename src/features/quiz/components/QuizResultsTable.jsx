import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Loader2, RefreshCw, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronDown, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import { quizService } from '../services/quizService';
import { useAuth } from '@/features/auth';

const RESULTS_LIST_KEY = 'app_user_quiz_results';

// ─── Kept for QuizRunner.jsx backward compatibility ────────────────────────
export function saveResultToStorage(resultObj) {
  const existing = getResultsFromStorage();
  const updated = [resultObj, ...existing];
  localStorage.setItem(RESULTS_LIST_KEY, JSON.stringify(updated));
}

export function getResultsFromStorage() {
  const stored = localStorage.getItem(RESULTS_LIST_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) || [];
  } catch {
    return [];
  }
}

export default function QuizResultsTable() {
  const { user } = useAuth();
  const isSupervisor = user?.role === 'CRM_SUPERVISOR' || user?.role === 'ADMIN';

  // Quiz list for selector
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Attempt results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // ─── Step 1: Fetch quiz list on mount ──────────────────────────────────────
  const fetchQuizzes = useCallback(async () => {
    setLoadingQuizzes(true);
    try {
      const raw = await quizService.getMyQuizzes();
      const list = Array.isArray(raw)
        ? raw
        : raw?.data && Array.isArray(raw.data)
          ? raw.data
          : raw?.content && Array.isArray(raw.content)
            ? raw.content
            : [];

      setQuizzes(list);

      // Auto-select first quiz
      if (list.length > 0 && !selectedQuizId) {
        setSelectedQuizId(list[0].id);
      }
    } catch (err) {
      showToast(err?.message || 'Failed to load quiz list.', 'error', 'Load Error');
      setQuizzes([]);
    } finally {
      setLoadingQuizzes(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // ─── Step 2: Fetch attempt reports when quiz or page changes ───────────────
  const fetchResults = useCallback(async () => {
    if (!selectedQuizId) return;

    setLoading(true);
    setError(null);
    try {
      const raw = await quizService.getAttemptReport(selectedQuizId, { page, size });

      // Defensive extraction — handles interceptor-unwrapped payloads
      // Possible shapes: raw = [...], raw = { data: [...] }, raw = { content: [...], totalPages, ... }, raw = { data: { content: [...] } }
      let items = [];
      let pages = 1;
      let total = 0;

      if (Array.isArray(raw)) {
        items = raw;
        total = raw.length;
      } else {
        const payload = raw?.data || raw;
        if (Array.isArray(payload)) {
          items = payload;
          total = payload.length;
        } else if (payload?.content && Array.isArray(payload.content)) {
          items = payload.content;
          pages = payload.totalPages || 1;
          total = payload.totalElements ?? items.length;
        } else if (Array.isArray(payload?.results)) {
          items = payload.results;
          total = payload.totalElements ?? items.length;
          pages = payload.totalPages || 1;
        }
      }

      setResults(items);
      setTotalPages(pages);
      setTotalElements(total);
    } catch (err) {
      const msg = err?.message || 'Failed to load quiz results.';
      setError(msg);
      setResults([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [selectedQuizId, page, size]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Reset to page 0 when quiz changes
  const handleQuizSelect = (quizId) => {
    setSelectedQuizId(quizId);
    setPage(0);
    setDropdownOpen(false);
  };

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

  // Get the currently selected quiz object for display
  const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);

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
          <h2 className="text-2xl font-bold text-brand-primary">Quiz Results</h2>
          {isSupervisor && (
            <p className="text-xs text-slate-400 mt-0.5">Viewing all participant attempts</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { fetchQuizzes(); fetchResults(); }}
            disabled={loading || loadingQuizzes}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${(loading || loadingQuizzes) ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-xs font-bold text-slate-400">
            Total Attempts: <span className="text-slate-700">{totalElements}</span>
          </div>
        </div>
      </div>

      {/* Quiz Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={loadingQuizzes}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 hover:border-brand-primary/40 focus:outline-none focus:border-brand-primary transition-all shadow-sm disabled:opacity-60"
        >
          <span className="flex items-center gap-2">
            {loadingQuizzes ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                <span className="text-slate-400">Loading quizzes...</span>
              </>
            ) : selectedQuiz ? (
              <>
                <span className="w-2 h-2 rounded-full bg-brand-primary flex-shrink-0" />
                <span className="font-bold text-slate-800 capitalize">{selectedQuiz.title}</span>
                <span className="text-slate-400 ml-1">ID: {selectedQuiz.id}</span>
              </>
            ) : (
              <span className="text-slate-400">No quizzes available</span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Options */}
        {dropdownOpen && quizzes.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto animate-fade-in">
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => handleQuizSelect(quiz.id)}
                className={`w-full text-left px-4 py-3 text-xs font-medium hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between ${
                  quiz.id === selectedQuizId
                    ? 'bg-brand-primary-light text-brand-primary font-bold'
                    : 'text-slate-700'
                }`}
              >
                <span className="capitalize">{quiz.title}</span>
                <span className="text-[10px] text-slate-400">ID: {quiz.id}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
      )}

      {/* Card Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {!selectedQuizId && !loadingQuizzes ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Users className="w-8 h-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-400">Select a quiz above to view attempt results.</p>
          </div>
        ) : loading ? (
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
        ) : results.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-400">No attempts found for this quiz yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold tracking-wider">
                  <tr>
                    {isSupervisor && <th className="py-3.5 px-6">Participant</th>}
                    <th className="py-3.5 px-6">Quiz & Module</th>
                    <th className="py-3.5 px-6">Completion Date</th>
                    <th className="py-3.5 px-6">Questions</th>
                    <th className="py-3.5 px-6">Score</th>
                    <th className="py-3.5 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {results.map((res, idx) => {
                    // Defensive field extraction — handles multiple API shapes
                    const participantName = res.participantName || res.staffName || res.userName || res.user?.name ||
                      (res.staffProfile ? `${res.staffProfile.firstName || ''} ${res.staffProfile.lastName || ''}`.trim() : '') ||
                      `Participant #${res.participantId || res.staffProfileId || res.userId || idx + 1}`;

                    const quizTitle = res.quizTitle || res.title || res.quiz?.title || selectedQuiz?.title || `Quiz #${selectedQuizId}`;
                    const quizId = res.quizId || res.quiz?.id || selectedQuizId;
                    const completionDate = res.completedAt || res.completionDate || res.date || res.submittedAt || res.endTime;
                    const totalQuestions = res.totalQuestions ?? res.questionCount ?? res.questions?.length ?? '—';

                    let rawScore = res.scorePercentage ?? res.score ?? res.percentage ?? '—';
                    if (typeof rawScore === 'number' && rawScore <= 1 && rawScore > 0) {
                      rawScore = Math.round(rawScore * 100);
                    }
                    const displayScore = rawScore;

                    const rawPassing = res.passingScorePercentage ?? 70;
                    const targetPassing = rawPassing <= 1 ? rawPassing * 100 : rawPassing;

                    const passed = res.passed ?? (res.status === 'PASSED') ?? (typeof displayScore === 'number' && displayScore >= targetPassing);
                    const status = res.status || (passed ? 'PASSED' : 'FAILED');

                    return (
                      <tr key={res.id || res.attemptId || idx} className="hover:bg-slate-50/60 transition-colors">
                        {isSupervisor && (
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="font-bold text-slate-800 block">{participantName}</span>
                            {(res.participantId || res.staffProfileId || res.userId) && (
                              <span className="text-[10px] text-slate-400">ID: {res.participantId || res.staffProfileId || res.userId}</span>
                            )}
                          </td>
                        )}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="font-bold text-slate-800 block capitalize">{quizTitle}</span>
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
                          {displayScore}{typeof displayScore === 'number' ? '%' : ''}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Page {page + 1} of {totalPages} · {totalElements} total
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
