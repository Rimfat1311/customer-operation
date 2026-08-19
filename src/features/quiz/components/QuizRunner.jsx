import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, ArrowRight, RotateCcw, Trophy, Loader2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import { quizService } from '../services/quizService';
import { saveResultToStorage } from './QuizResultsTable';
import { useAuth } from '@/features/auth';

export default function QuizRunner() {
  const { user } = useAuth();
  
  // Quiz data state
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attemptId, setAttemptId] = useState(null);

  // Quiz interaction state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let quizMeta = null;
      let questionsList = [];

      // 1. Fetch assigned quizzes for the participant (GET /v1/quizzes/assigned)
      const assignedRes = await quizService.getAssignedQuizzes();
      const assignedData = assignedRes.data || assignedRes;
      const assignedList = Array.isArray(assignedData)
        ? assignedData
        : assignedData?.data && Array.isArray(assignedData.data)
          ? assignedData.data
          : [];

      if (assignedList.length > 0) {
        const selectedQuiz = assignedList[0];
        quizMeta = selectedQuiz;

        // Start attempt to get questions (POST /v1/quizzes/{quizId}/attempts)
        try {
          const attemptRes = await quizService.startAttempt(selectedQuiz.id);
          const attemptData = attemptRes.data?.data || attemptRes.data || attemptRes;
          if (attemptData?.id) {
            setAttemptId(attemptData.id);
          }
          questionsList = attemptData?.questions || selectedQuiz.questions || [];
        } catch {
          questionsList = selectedQuiz.questions || [];
        }
      }

      setQuiz(quizMeta);
      setQuestions(questionsList);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load assigned quizzes.';
      setError(msg);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const currentQ = questions[currentIndex];

  /** Normalize options — backend may return objects or strings */
  const getOptions = (q) => {
    if (!q?.options) return [];
    return q.options.map((opt, idx) => ({
      index: idx,
      text: typeof opt === 'string' ? opt : (opt.optionText || opt.text || `Option ${idx + 1}`),
      id: typeof opt === 'object' ? opt.id : idx,
    }));
  };

  const handleSelectOption = async (optIndex) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));

    // If we have an active v1 attempt, save answer choice via API
    if (quiz?.id && attemptId && currentQ?.id) {
      const opts = getOptions(currentQ);
      const selectedOpt = opts[optIndex];
      try {
        await quizService.saveAnswer(quiz.id, attemptId, currentQ.id, selectedOpt?.id ?? optIndex);
      } catch {
        // Silently ignore save error on answer select
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      let serverScore = null;
      let serverPassed = null;

      // 1. Try v1 attempt submit if attemptId exists
      if (quiz?.id && attemptId) {
        try {
          const response = await quizService.submitAttempt(quiz.id, attemptId);
          const result = response.data?.data || response.data;
          serverScore = result?.scorePercentage ?? result?.score ?? result?.percentage;
          serverPassed = result?.passed ?? result?.status === 'PASSED';
        } catch {
          // Fall back to general submit
        }
      }

      // 2. Fallback to legacy submit Quiz if v1 attempt submit wasn't used or failed
      if (serverScore == null) {
        const answers = questions.map((q, idx) => {
          const selectedIdx = selectedAnswers[idx];
          const opts = getOptions(q);
          const selectedOpt = opts[selectedIdx];

          return {
            questionId: q.id,
            selectedOptionId: selectedOpt?.id ?? selectedIdx,
            selectedOptionIndex: selectedIdx,
          };
        });

        const payload = {
          quizId: quiz?.id,
          answers,
        };

        try {
          const response = await quizService.submitQuiz(payload);
          const result = response.data?.data || response.data;
          serverScore = result?.scorePercentage ?? result?.score ?? result?.percentage;
          serverPassed = result?.passed ?? result?.status === 'PASSED';
        } catch {
          // Local fallback below
        }
      }

      // 3. Local grading fallback if backend returns no score
      const finalCalculatedScore = serverScore ?? Math.round((questions.reduce((acc, q, idx) => {
        const selectedIdx = selectedAnswers[idx];
        const opts = q.options || [];
        const selectedOpt = opts[selectedIdx];
        if (typeof selectedOpt === 'object' && selectedOpt.correct) return acc + 1;
        if (q.correctAnswerIndex === selectedIdx) return acc + 1;
        return acc;
      }, 0) / questions.length) * 100);

      const rawPassingThreshold = quiz?.passingScorePercentage ?? 70;
      const passingThresholdPercentage = rawPassingThreshold <= 1 ? rawPassingThreshold * 100 : rawPassingThreshold;

      const isPassed = serverPassed ?? (finalCalculatedScore >= passingThresholdPercentage);

      setScore(finalCalculatedScore);
      setPassed(isPassed);

      saveResultToStorage({
        id: `RES-${Date.now()}`,
        quizTitle: quiz?.title || 'Agent Assessment',
        quizId: quiz?.id || Date.now(),
        completedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        scorePercentage: finalCalculatedScore,
        status: isPassed ? 'PASSED' : 'FAILED'
      });

      setSubmitted(true);
      showToast('Quiz submitted successfully!', 'success', 'Submitted');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to submit quiz.';
      showToast(msg, 'error', 'Submit Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
    setSubmitting(false);
    setScore(0);
    setPassed(false);
    setAttemptId(null);
    fetchQuiz();
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up max-w-3xl mx-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />
        <div className="p-12 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up max-w-3xl mx-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />
        <div className="p-12 flex flex-col items-center justify-center space-y-3">
          <p className="text-sm font-medium text-rose-500">{error}</p>
          <button
            onClick={fetchQuiz}
            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No questions available
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up max-w-3xl mx-auto">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />
        <div className="p-8 sm:p-12 text-center">
          <div className="border border-slate-200/80 bg-slate-50/50 rounded-2xl p-12 flex flex-col items-center justify-center space-y-3">
            <p className="text-sm font-medium text-slate-500">
              No quiz questions assigned to you yet. Check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const options = getOptions(currentQ);
  const quizTitle = quiz?.title || 'Agent Assessment';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up max-w-3xl mx-auto">
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

      {/* Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />

      <div className="p-6 sm:p-8 space-y-6">
        {!submitted ? (
          <>
            {/* Header Progress */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base mt-0.5">
                  {currentQ?.category || quizTitle}
                </h3>
              </div>
              <Badge variant="primary">{quizTitle}</Badge>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-brand-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="space-y-4 py-2">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ?.questionText || currentQ?.text || currentQ?.question}
              </h4>

              <div className="space-y-3 pt-2">
                {options.map((opt) => {
                  const isSelected = selectedAnswers[currentIndex] === opt.index;
                  return (
                    <button
                      key={opt.index}
                      type="button"
                      onClick={() => handleSelectOption(opt.index)}
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-sm font-semibold border transition-all text-left ${
                        isSelected
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm scale-[1.01]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + opt.index)}
                        </span>
                        {opt.text}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl disabled:opacity-40 transition-all hover:bg-slate-50"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentIndex] === undefined}
                  className="px-6 py-2.5 bg-brand-primary disabled:bg-slate-300 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all hover:bg-brand-primary-dark disabled:cursor-not-allowed"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < questions.length || submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Quiz Answers</span>
                  )}
                </button>
              )}
            </div>

            {/* Question Navigation Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-brand-primary scale-125'
                      : selectedAnswers[idx] !== undefined
                        ? 'bg-brand-primary/40'
                        : 'bg-slate-200'
                  }`}
                  title={`Question ${idx + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          /* Results View */
          <div className="text-center py-8 space-y-6 animate-fade-in">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner ${
              passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
            }`}>
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-slate-400 text-sm mt-1">Your assessment has been graded and recorded in your profile history.</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 max-w-sm mx-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Final Accuracy Score</span>
              <p className="text-4xl font-extrabold text-slate-800 mt-1">{score}%</p>
              <p className={`text-xs font-bold mt-2 ${passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {passed ? 'Passed — Certified Agent' : 'Needs Review — Please retake the quiz'}
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-bold text-sm rounded-xl shadow-sm hover:bg-brand-primary-dark transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Questions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
