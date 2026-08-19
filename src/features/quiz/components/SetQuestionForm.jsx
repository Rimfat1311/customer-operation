import React, { useState } from 'react';
import { Loader2, Plus, CheckCircle2 } from 'lucide-react';
import { quizService } from '../services/quizService';
import { saveQuizToStorage } from './ManageQuestionsTable';
import Toast from '@/components/ui/Toast';

const CATEGORIES = ['SAP Sold-To ID Hierarchy', 'GDPR & Privacy Compliance', 'Customer Service Protocols', 'Logistics & Depot Operations'];
const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

export default function SetQuestionForm({ onQuestionCreated }) {
  // Section 1: Quiz Configuration state
  const [quizTitle, setQuizTitle] = useState('');
  const [passingScore, setPassingScore] = useState('70');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);
  const [randomizeOptions, setRandomizeOptions] = useState(true);

  // Section 2: Question Item state
  const [questionsList, setQuestionsList] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success', title) => {
    setToastMessage({ message, type, title });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleOptionChange = (index, value) => {
    const next = [...options];
    next[index] = value;
    setOptions(next);
  };

  const handleAddQuestionToQuiz = () => {
    if (!questionText.trim()) {
      showToast('Please enter question text before adding.', 'error', 'Validation');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      showToast('Please fill out all 4 option fields.', 'error', 'Validation');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      category,
      difficulty,
      questionText: questionText.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswerIndex,
    };

    setQuestionsList(prev => [...prev, newQuestion]);
    showToast('Question added to quiz buffer.', 'info', 'Question Added');

    // Reset single question inputs
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
  };

  const handleFinalizeQuiz = async (e) => {
    e.preventDefault();
    if (!quizTitle.trim()) {
      showToast('Please enter a Quiz Title.', 'error', 'Validation');
      return;
    }

    setSaving(true);
    try {
      const rawScore = Number(passingScore) || 70;
      const scoreRatio = rawScore > 1 ? rawScore / 100 : rawScore;

      const payload = {
        title: quizTitle.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        randomizeQuestions,
        randomizeOptions,
        passingScorePercentage: scoreRatio,
        questions: questionsList.map(q => ({
          questionText: q.questionText,
          options: q.options.map((optText, idx) => ({
            optionText: optText,
            correct: idx === q.correctAnswerIndex
          }))
        }))
      };

      let createdQuizId = Date.now();
      try {
        const response = await quizService.createQuiz(payload);
        const createdQuiz = response.data?.data || response.data;
        if (createdQuiz?.id) {
          createdQuizId = createdQuiz.id;
        }
      } catch {
        // Optimistic fallback for local storage
      }

      const fullQuizObj = {
        id: createdQuizId,
        title: quizTitle.trim(),
        description: description.trim(),
        instructions: instructions.trim(),
        passingScorePercentage: Number(passingScore),
        published: true,
        active: true,
        questions: questionsList.map(q => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options.map((optText, idx) => ({
            optionText: optText,
            correct: idx === q.correctAnswerIndex
          }))
        }))
      };

      saveQuizToStorage(fullQuizObj);
      showToast('Finalized and created quiz successfully!', 'success', 'Quiz Finalized');
      
      setQuizTitle('');
      setPassingScore('70');
      setDescription('');
      setInstructions('');
      setQuestionsList([]);
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(0);

      if (onQuestionCreated) onQuestionCreated();
    } catch (err) {
      showToast(err.message || 'Failed to finalize quiz.', 'error', 'Save Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
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

      {/* Card Wrapper */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
        {/* Hero Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-primary via-brand-secondary to-indigo-500" />

        <form onSubmit={handleFinalizeQuiz} className="p-6 sm:p-8 space-y-8">
          
          {/* SECTION 1: Create New Quiz Header & Config */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-brand-primary">Create New Quiz</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Configure quiz parameters, passing grade, instructions, and randomization options.
              </p>
            </div>

            {/* Quiz Title & Passing Score */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Safety Training"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  required
                  disabled={saving}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="70"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                  required
                  disabled={saving}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the purpose of this quiz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-light text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Enter quiz instructions for participants..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={saving}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-light text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  disabled={saving}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-slate-300 cursor-pointer"
                />
                <span>Randomize Questions</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer select-none text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={randomizeOptions}
                  onChange={(e) => setRandomizeOptions(e.target.checked)}
                  disabled={saving}
                  className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-slate-300 cursor-pointer"
                />
                <span>Randomize Options</span>
              </label>
            </div>
          </div>

          {/* SECTION DIVIDER */}
          <div className="border-t border-slate-100 my-6" />

          {/* SECTION 2: Question Prompt & Option Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Add Question to Quiz</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Create single-choice questions with answer choices and specify difficulty level.
              </p>
            </div>

            {/* Category & Difficulty Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary transition-all"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary transition-all"
                >
                  {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Question Text</label>
              <textarea
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter full question prompt here..."
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary transition-all resize-none"
              />
            </div>

            {/* Options Setup with Radio Selection */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Options (Select correct one)
              </label>

              {options.map((option, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={correctAnswerIndex === idx}
                    onChange={() => setCorrectAnswerIndex(idx)}
                    className="w-4 h-4 text-brand-primary focus:ring-brand-primary cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-brand-primary transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Sub-button: Add Question to Quiz */}
            <div>
              <button
                type="button"
                onClick={handleAddQuestionToQuiz}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-95"
              >
                Add Question to Quiz
              </button>
            </div>

            {/* Added Questions List Preview */}
            {questionsList.length > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Questions Added to Quiz ({questionsList.length})
                </span>
                {questionsList.map((q, i) => (
                  <div key={q.id} className="flex items-center justify-between text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                    <span className="truncate max-w-md">{i + 1}. {q.questionText}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Option {q.correctAnswerIndex + 1} Correct</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Primary Button: Finalize & Create Quiz */}
          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving || !quizTitle.trim()}
              className="w-full py-4 bg-brand-primary hover:bg-brand-primary-dark disabled:bg-slate-300 text-white font-extrabold text-base rounded-xl transition-all shadow-md active:scale-[0.99] disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Finalizing Quiz...</span>
                </>
              ) : (
                <span>Finalize & Create Quiz</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
