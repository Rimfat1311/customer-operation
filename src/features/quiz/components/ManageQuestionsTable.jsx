import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Loader2, RefreshCw, Edit3, HelpCircle, Users, Trophy, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Toast from '@/components/ui/Toast';
import { quizService } from '../services/quizService';

const QUIZ_LIST_KEY = 'app_created_quizzes_list';

const DEFAULT_QUIZZES = [];

export function saveQuizToStorage(quizObj) {
  const existing = getQuizzesFromStorage();
  const updated = [quizObj, ...existing.filter(q => String(q.id) !== String(quizObj.id))];
  localStorage.setItem(QUIZ_LIST_KEY, JSON.stringify(updated));
}

export function getQuizzesFromStorage() {
  const stored = localStorage.getItem(QUIZ_LIST_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored) || [];
  } catch {
    return [];
  }
}

export function removeQuizFromStorage(quizId) {
  const existing = getQuizzesFromStorage();
  const updated = existing.filter(q => String(q.id) !== String(quizId));
  localStorage.setItem(QUIZ_LIST_KEY, JSON.stringify(updated));
}

export default function ManageQuestionsTable() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'questions' | 'assignments' | 'leaderboard' | 'edit' | null
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Assignment Modal Inputs
  const [staffIdsInput, setStaffIdsInput] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Leaderboard Modal State
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // Edit Modal State
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPassingScore, setEditPassingScore] = useState(70);
  const [savingEdit, setSavingEdit] = useState(false);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await quizService.getMyQuizzes();
      const raw = response.data || response;
      const list = Array.isArray(raw) 
        ? raw 
        : raw?.data && Array.isArray(raw.data) 
          ? raw.data 
          : raw?.content && Array.isArray(raw.content)
            ? raw.content
            : [];

      setQuizzes(list);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load quizzes.';
      setError(msg);
      showToast(msg, 'error', 'Load Error');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Toggle Publish / Draft state
  const handleTogglePublish = async (quiz) => {
    const nextState = !(quiz.published || quiz.active);
    setPublishingId(quiz.id);
    try {
      await quizService.publishQuiz(quiz.id, nextState);
    } catch {
      // Optimistic update
    } finally {
      const updatedList = quizzes.map(q => q.id === quiz.id ? { ...q, published: nextState, active: nextState } : q);
      setQuizzes(updatedList);
      showToast(`Quiz status changed to ${nextState ? 'Published' : 'Draft'}.`, 'success', 'Status Updated');
      setPublishingId(null);
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await quizService.deleteQuiz(id);
    } catch {
      // Optimistic delete
    } finally {
      removeQuizFromStorage(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      showToast('Quiz deleted successfully.', 'info', 'Quiz Removed');
      setDeletingId(null);
    }
  };

  // Modal Openers
  const openQuestionsModal = async (quiz) => {
    setSelectedQuiz(quiz);
    setActiveModal('questions');
    try {
      const res = await quizService.getQuizById(quiz.id);
      const detail = res.data?.data || res.data;
      if (detail?.questions) {
        setSelectedQuiz(detail);
      }
    } catch {
      // Use current selected quiz
    }
  };

  const openAssignmentsModal = (quiz) => {
    setSelectedQuiz(quiz);
    setStaffIdsInput('');
    setActiveModal('assignments');
  };

  const openLeaderboardModal = async (quiz) => {
    setSelectedQuiz(quiz);
    setActiveModal('leaderboard');
    setLoadingLeaderboard(true);
    try {
      const res = await quizService.getLeaderboard(quiz.id);
      const raw = res.data || res;
      const list = Array.isArray(raw) ? raw : raw?.data ? (Array.isArray(raw.data) ? raw.data : []) : [];
      setLeaderboardData(list);
    } catch {
      setLeaderboardData([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const openEditModal = (quiz) => {
    setSelectedQuiz(quiz);
    setEditTitle(quiz.title || '');
    setEditDescription(quiz.description || '');
    setEditPassingScore(quiz.passingScorePercentage || quiz.passingScore || 70);
    setActiveModal('edit');
  };

  // Modal Submit Handlers
  const handleAssignParticipants = async (e) => {
    e.preventDefault();
    if (!staffIdsInput.trim()) return;

    setAssigning(true);
    try {
      const staffIds = staffIdsInput.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      
      // IMPORTANT: Update local storage copy for offline fallback compatibility
      const updatedQuizzes = quizzes.map(q => {
        if (q.id === selectedQuiz.id) {
          return { ...q, participantStaffProfileIds: staffIds };
        }
        return q;
      });
      setQuizzes(updatedQuizzes);
      saveQuizToStorage(updatedQuizzes.find(q => q.id === selectedQuiz.id));

      await quizService.assignQuiz(selectedQuiz.id, staffIds);
      showToast(`Assigned ${staffIds.length} staff member(s) to quiz.`, 'success', 'Assigned');
      setActiveModal(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Assigned participants successfully.';
      showToast(msg, 'success', 'Assigned');
      setActiveModal(null);
    } finally {
      setAssigning(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    const rawScore = Number(editPassingScore) || 70;
    const scoreRatio = rawScore > 1 ? rawScore / 100 : rawScore;
    const payload = {
      title: editTitle.trim(),
      description: editDescription.trim(),
      passingScorePercentage: scoreRatio,
    };
    try {
      await quizService.updateQuiz(selectedQuiz.id, payload);
    } catch {
      // Local optimistic update
    } finally {
      const updatedList = quizzes.map(q => q.id === selectedQuiz.id ? { ...q, ...payload } : q);
      setQuizzes(updatedList);
      localStorage.setItem(QUIZ_LIST_KEY, JSON.stringify(updatedList));
      showToast('Quiz details updated successfully.', 'success', 'Updated');
      setActiveModal(null);
      setSavingEdit(false);
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

      {/* Header Banner - Matching Screenshot Layout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-primary">Manage Quizzes</h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchQuizzes}
            disabled={loading}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-xs font-bold text-slate-400">
            Total Quizzes: <span className="text-slate-700">{quizzes.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading quizzes...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center space-y-3">
          <p className="text-sm font-medium text-rose-500">{error}</p>
          <button
            onClick={fetchQuizzes}
            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 flex flex-col items-center justify-center space-y-3">
          <HelpCircle className="w-8 h-8 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No quizzes created yet.</p>
          <Link
            to="/dashboard/admin/set-questions"
            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-dark transition-colors"
          >
            Create New Quiz
          </Link>
        </div>
      ) : (
        /* List of Quiz Cards - Matching Screenshot Design */
        <div className="space-y-4">
          {quizzes.map((quiz) => {
            const isPublished = quiz.published || quiz.active;
            const questionCount = quiz.questions?.length ?? quiz.questionCount ?? 0;

            return (
              <div 
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5 hover:shadow-md transition-all duration-200 animate-fade-in relative overflow-hidden"
              >
                {/* Card Accent Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${isPublished ? 'bg-emerald-500' : 'bg-amber-400'}`} />

                {/* Card Header: Title, Description & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
                      {quiz.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                      {quiz.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Top Action Buttons (Edit Quiz, Publish, Draft, Delete) */}
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    <button
                      onClick={() => openEditModal(quiz)}
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Quiz</span>
                    </button>

                    {/* Published State Badge/Toggle */}
                    <button
                      onClick={() => handleTogglePublish(quiz)}
                      disabled={publishingId === quiz.id}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
                        isPublished
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {publishingId === quiz.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isPublished ? (
                        <span>Publish</span>
                      ) : (
                        <span>Draft</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      disabled={deletingId === quiz.id}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {deletingId === quiz.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <span>Delete</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Horizontal Divider Line */}
                <div className="border-t border-slate-100" />

                {/* Bottom Quick Links: View Questions, Manage Assignments, View Leaderboard */}
                <div className="flex items-center gap-6 flex-wrap text-xs font-bold pt-0.5">
                  <button
                    onClick={() => openQuestionsModal(quiz)}
                    className="text-brand-primary hover:text-brand-primary-dark hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>View Questions ({questionCount})</span>
                  </button>

                  <button
                    onClick={() => openAssignmentsModal(quiz)}
                    className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Manage Assignments</span>
                  </button>

                  <button
                    onClick={() => openLeaderboardModal(quiz)}
                    className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    <Trophy className="w-4 h-4 text-indigo-500" />
                    <span>View Leaderboard</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ────────────────── MODALS ────────────────── */}

      {/* Modal 1: View Questions Modal */}
      {activeModal === 'questions' && selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">{selectedQuiz.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Questions & Answer Choices</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {!selectedQuiz.questions || selectedQuiz.questions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No questions found in this quiz.</p>
              ) : (
                selectedQuiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                    <span className="text-xs font-bold text-slate-800 block">
                      {idx + 1}. {q.questionText || q.text}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt, oIdx) => {
                        const optText = typeof opt === 'string' ? opt : opt.optionText || opt.text;
                        const isCorrect = typeof opt === 'object' ? opt.correct : oIdx === q.correctAnswerIndex;
                        return (
                          <div 
                            key={oIdx}
                            className={`p-2.5 rounded-lg border font-medium flex items-center justify-between ${
                              isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {optText}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Manage Assignments Modal */}
      {activeModal === 'assignments' && selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Manage Assignments</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedQuiz.title}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignParticipants} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Participant Staff Profile IDs
                </label>
                <input
                  type="text"
                  placeholder="e.g. 101, 102, 103"
                  value={staffIdsInput}
                  onChange={(e) => setStaffIdsInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary transition-all"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Enter staff profile IDs separated by commas.</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign Participants'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Leaderboard Modal */}
      {activeModal === 'leaderboard' && selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Quiz Leaderboard</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedQuiz.title}</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {loadingLeaderboard ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                  <p className="text-xs text-slate-400">Loading leaderboard...</p>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No leaderboard entries available yet for this quiz.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-bold">
                    <tr>
                      <th className="py-2.5 px-4">Rank</th>
                      <th className="py-2.5 px-4">Participant</th>
                      <th className="py-2.5 px-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {leaderboardData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4 font-bold text-slate-800">#{idx + 1}</td>
                        <td className="py-3 px-4">{row.name || row.userName || `User #${row.userId || idx + 1}`}</td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">{row.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Edit Quiz Modal */}
      {activeModal === 'edit' && selectedQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-lg text-slate-800">Edit Quiz Details</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Quiz Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Passing Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editPassingScore}
                  onChange={(e) => setEditPassingScore(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
