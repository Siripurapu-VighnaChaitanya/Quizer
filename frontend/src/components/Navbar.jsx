import React from 'react';
import { BookOpen, Award, Layers, CheckCircle2, Search, Sparkles } from 'lucide-react';

export default function Navbar({ currentRoute, onNavigate, onSearchClick }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="nav-brand"
        >
          <div className="nav-logo-icon">
            <BookOpen size={20} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>ExamPrep Hub</span>
            <span className="nav-tagline">
              660 MCQs • 33 Topics
            </span>
          </div>
        </a>

        <nav className="nav-links">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-item ${currentRoute === 'home' || currentRoute === 'subject' || currentRoute === 'practice' ? 'active' : ''}`}
            title="Browse subjects and practice questions"
          >
            <Layers size={17} />
            <span>Practice</span>
          </button>

          <button
            onClick={() => onNavigate('mock-tests')}
            className={`nav-item ${currentRoute === 'mock-tests' || currentRoute === 'mock-test-active' || currentRoute === 'mock-test-result' ? 'active' : ''}`}
            title="Take timed or untimed mock tests"
          >
            <Award size={17} />
            <span>Mock Tests</span>
          </button>

          <button
            onClick={() => onNavigate('exams')}
            className={`nav-item ${currentRoute === 'exams' ? 'active' : ''}`}
            title="View examination syllabi and scopes"
          >
            <CheckCircle2 size={17} />
            <span>Exams</span>
          </button>

          <button
            onClick={onSearchClick}
            className="nav-item"
            style={{
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-full)',
              padding: '0.45rem 0.85rem',
            }}
            title="Quick search topics"
          >
            <Search size={15} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem' }}>Search</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
