import React, { useState } from 'react';
import FontAwesomeIcon from './FontAwesomeIcon';
import ModalSheet from './ModalSheet';
import SegmentedControl from './SegmentedControl';
import { useApp } from '../../context/AppContext';

export const AuthModal = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    user, 
    loginStudent, 
    loginAdmin, 
    logout 
  } = useApp();

  const [authMode, setAuthMode] = useState('student'); // 'student' | 'admin'
  const [studentName, setStudentName] = useState('');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const modeSegments = [
    { id: 'student', label: 'Student Portal', icon: 'fa-solid fa-user-graduate' },
    { id: 'admin', label: 'Admin Login', icon: 'fa-solid fa-shield-halved' }
  ];

  const sampleStudents = [
    'BILAAAAL',
    'NIHL KAREEM',
    'ARSHAD MASTER',
    'Sara Chen',
    'Bilal Ahmed'
  ];

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    loginStudent(studentName);
    setError('');
    setIsAuthModalOpen(false);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const result = loginAdmin(adminUsername.trim(), adminPassword.trim());
    if (result.success) {
      setError('');
      setIsAuthModalOpen(false);
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleQuickStudentSelect = (name) => {
    setStudentName(name);
    loginStudent(name);
    setError('');
    setIsAuthModalOpen(false);
  };

  return (
    <ModalSheet
      isOpen={isAuthModalOpen}
      onClose={() => {
        setIsAuthModalOpen(false);
        setError('');
      }}
      title="Campus Identity"
      subtitle="Sign in as Student or Administrator"
    >
      <div className="auth-modal-content">
        {/* Active Account Pill */}
        <div className="current-account-banner">
          <div className="account-avatar">
            <FontAwesomeIcon icon={user.role === 'admin' ? 'fa-solid fa-shield-halved' : 'fa-solid fa-user'} />
          </div>
          <div className="account-details">
            <div className="account-title-row">
              <span className="account-name">{user.name}</span>
              <span className={`account-role-tag ${user.role === 'admin' ? 'tag-admin' : 'tag-student'}`}>
                {user.role === 'admin' ? 'Admin / Proctor' : 'Student'}
              </span>
            </div>
            <span className="account-email">{user.email} · {user.studentId}</span>
          </div>
          <button 
            type="button" 
            className="account-logout-btn"
            onClick={logout}
            title="Sign Out"
          >
            <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />
          </button>
        </div>

        {/* Portal Segmented Switch */}
        <div className="auth-segmented-wrap">
          <SegmentedControl 
            options={modeSegments}
            value={authMode}
            onChange={(val) => {
              setAuthMode(val);
              setError('');
            }}
          />
        </div>

        {error && (
          <div className="auth-error-alert">
            <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" />
            <span>{error}</span>
          </div>
        )}

        {/* Student Mode (Matches legacy-php/login.php) */}
        {authMode === 'student' && (
          <form className="auth-form" onSubmit={handleStudentSubmit}>
            <p className="auth-hint-text">
              Enter your student name to manage reports and track lost items. No password needed.
            </p>

            <div className="auth-field-group">
              <label className="auth-label">Student Name</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon="fa-solid fa-id-badge" className="auth-field-icon" />
                <input 
                  type="text" 
                  className="auth-input"
                  placeholder="e.g. BILAAAAL, Nihal Kareem..."
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Students from Legacy DB */}
            <div className="quick-students-section">
              <span className="quick-label">Or select a recent campus poster:</span>
              <div className="quick-students-chips">
                {sampleStudents.map((name) => (
                  <button 
                    key={name}
                    type="button" 
                    className="quick-student-chip"
                    onClick={() => handleQuickStudentSelect(name)}
                  >
                    <FontAwesomeIcon icon="fa-regular fa-user" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="ios-button ios-button-primary">
              <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
              <span>Continue as Student</span>
            </button>
          </form>
        )}

        {/* Admin Mode (Matches legacy-php/admin/login.php) */}
        {authMode === 'admin' && (
          <form className="auth-form" onSubmit={handleAdminSubmit}>
            <p className="auth-hint-text">
              Login to access the Moderator Console, approve pending items, and maintain system integrity.
            </p>

            <div className="auth-field-group">
              <label className="auth-label">Admin Username</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon="fa-solid fa-user-shield" className="auth-field-icon" />
                <input 
                  type="text" 
                  className="auth-input"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <FontAwesomeIcon icon="fa-solid fa-lock" className="auth-field-icon" />
                <input 
                  type="password" 
                  className="auth-input"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Credentials callout box */}
            <div className="admin-credentials-box">
              <div className="credentials-header">
                <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                <span>Default Admin Credentials</span>
              </div>
              <div className="credentials-row">
                <span>User: <code>admin</code></span>
                <span>Pass: <code>admin123</code></span>
              </div>
            </div>

            <button type="submit" className="ios-button ios-button-primary">
              <FontAwesomeIcon icon="fa-solid fa-shield" />
              <span>Authenticate as Administrator</span>
            </button>
          </form>
        )}
      </div>
    </ModalSheet>
  );
};

export default AuthModal;
