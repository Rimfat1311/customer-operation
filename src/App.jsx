import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '@/features/auth';

import LoginPage from '@/pages/LoginPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardLayout from '@/pages/DashboardLayout';

// Shared Routes
import SearchCustomersPage from '@/pages/SearchCustomersPage';
import QuizResultsPage from '@/pages/QuizResultsPage';
import ComposeNotificationPage from '@/pages/ComposeNotificationPage';

// Agent Routes
import TakeQuestionsPage from '@/pages/TakeQuestionsPage';

// Admin / Supervisor Routes
import UploadCustomersPage from '@/pages/UploadCustomersPage';
import UpdateDriversPage from '@/pages/UpdateDriversPage';
import SetQuestionsPage from '@/pages/SetQuestionsPage';
import ManageQuestionsPage from '@/pages/ManageQuestionsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected Dashboard Layout Routing */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/search-customers" replace />} />
            
            {/* Main Routes */}
            <Route path="search-customers" element={
              <ProtectedRoute allowedRoles={['AGENT', 'ADMIN', 'CRM_SUPERVISOR']}>
                <SearchCustomersPage />
              </ProtectedRoute>
            } />
            <Route path="quiz-results" element={
              <ProtectedRoute allowedRoles={['AGENT', 'ADMIN', 'CRM_SUPERVISOR']}>
                <QuizResultsPage />
              </ProtectedRoute>
            } />
            <Route path="compose-notification" element={
              <ProtectedRoute allowedRoles={['AGENT', 'ADMIN', 'CRM_SUPERVISOR']}>
                <ComposeNotificationPage />
              </ProtectedRoute>
            } />
            
            {/* Agent Route */}
            <Route path="take-questions" element={
              <ProtectedRoute allowedRoles={['AGENT', 'ADMIN', 'CRM_SUPERVISOR']}>
                <TakeQuestionsPage />
              </ProtectedRoute>
            } />

            {/* Admin / Supervisor Operations */}
            <Route path="admin/upload-customers" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CRM_SUPERVISOR']}>
                <UploadCustomersPage />
              </ProtectedRoute>
            } />
            <Route path="admin/update-drivers" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CRM_SUPERVISOR']}>
                <UpdateDriversPage />
              </ProtectedRoute>
            } />
            <Route path="admin/set-questions" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CRM_SUPERVISOR']}>
                <SetQuestionsPage />
              </ProtectedRoute>
            } />
            <Route path="admin/manage-questions" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'CRM_SUPERVISOR']}>
                <ManageQuestionsPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Redirect any other unknown routes to login page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
