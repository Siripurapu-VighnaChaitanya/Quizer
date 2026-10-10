import React from 'react';
import { BookOpen, Award, Layers, CheckCircle2, Search } from 'lucide-react';

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
            <BookOpen size={18} />
          </div>
          <span>ExamPrep Hub</span>
        </a>

        <nav className="nav-links">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}
            title="Browse subjects and practice questions"
          >
            <Layers size={16} />
            <span>Practice</span>
          </button>

          <button
            onClick={() => onNavigate('mock-tests')}
            className={`nav-item ${currentRoute === 'mock-tests' ? 'active' : ''}`}
            title="Take timed or untimed mock tests"
          >
            <Award size={16} />
            <span>Mock Tests</span>
          </button>

          <button
            onClick={() => onNavigate('exams')}
            className={`nav-item ${currentRoute === 'exams' ? 'active' : ''}`}
            title="View examination syllabi and scopes"
          >
            <CheckCircle2 size={16} />
            <span>Exams</span>
          </button>

          <button
            onClick={onSearchClick}
            className="nav-item"
            style={{ border: '1px solid var(--border-medium)' }}
            title="Quick search topics"
          >
            <Search size={15} />
            <span style={{ fontSize: '0.85rem' }}>Search</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
