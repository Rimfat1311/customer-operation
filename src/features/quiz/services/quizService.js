import { apiClient } from '@/features/auth/services/authService';
import { ENDPOINTS } from '@/utils/endpoints';

export const quizService = {
  /**
   * List quizzes created by the authenticated user (creator/admin)
   */
  async getMyQuizzes() {
    return await apiClient.get(ENDPOINTS.QUIZ.GET_MY_QUIZZES);
  },

  /**
   * List quizzes assigned to the authenticated user (participant)
   */
  async getAssignedQuizzes() {
    return await apiClient.get(ENDPOINTS.QUIZ.GET_ASSIGNED);
  },

  /**
   * Create a new quiz with initial questions
   */
  async createQuiz(quizData) {
    return await apiClient.post(ENDPOINTS.QUIZ.CREATE_QUIZ, quizData);
  },

  /**
   * Get a single quiz detail by ID
   */
  async getQuizById(id) {
    return await apiClient.get(ENDPOINTS.QUIZ.GET_QUIZ_BY_ID(id));
  },

  /**
   * Update quiz metadata
   */
  async updateQuiz(id, quizData) {
    return await apiClient.put(ENDPOINTS.QUIZ.UPDATE_QUIZ(id), quizData);
  },

  /**
   * Delete (soft-delete) a quiz
   */
  async deleteQuiz(id) {
    return await apiClient.delete(ENDPOINTS.QUIZ.DELETE_QUIZ(id));
  },

  /**
   * Assign participants to a quiz
   */
  async assignQuiz(quizId, participantStaffProfileIds) {
    return await apiClient.post(ENDPOINTS.QUIZ.ASSIGN_QUIZ(quizId), { participantStaffProfileIds });
  },

  /**
   * Start a quiz attempt
   */
  async startAttempt(quizId) {
    return await apiClient.post(ENDPOINTS.QUIZ.START_ATTEMPT(quizId));
  },

  /**
   * Save or update an answer for an in-progress attempt
   */
  async saveAnswer(quizId, attemptId, questionId, chosenOptionId) {
    return await apiClient.post(ENDPOINTS.QUIZ.SAVE_ANSWER(quizId, attemptId), { questionId, chosenOptionId });
  },

  /**
   * Submit quiz attempt
   */
  async submitAttempt(quizId, attemptId) {
    return await apiClient.post(ENDPOINTS.QUIZ.SUBMIT_ATTEMPT(quizId, attemptId));
  },

  /**
   * Get results for a specific quiz for authenticated participant
   */
  async getMyQuizResults(quizId) {
    return await apiClient.get(ENDPOINTS.QUIZ.MY_RESULTS(quizId));
  },

  /**
   * Get leaderboard for a quiz
   */
  async getLeaderboard(quizId) {
    return await apiClient.get(ENDPOINTS.QUIZ.LEADERBOARD(quizId));
  },

  /**
   * Publish or unpublish a quiz
   */
  async publishQuiz(quizId, published = true) {
    return await apiClient.patch(ENDPOINTS.QUIZ.PUBLISH_QUIZ(quizId), { published });
  },

  /**
   * Legacy / general submit fallback
   */
  async submitQuiz(submissionData) {
    return await apiClient.post(ENDPOINTS.QUIZ.SUBMIT_QUIZ, submissionData);
  },

  /**
   * Legacy question bank fallback
   */
  async getQuestions(params = {}) {
    return await apiClient.get(ENDPOINTS.QUIZ.QUESTIONS, { params });
  },
};
