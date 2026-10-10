import React, { useState, useEffect, useCallback } from 'react';
import DifficultyBadge from '../components/DifficultyBadge';
import {
  Clock,
  Flag,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export default function MockTestActivePage({ testData, onSubmitTest }) {
  if (!testData || !testData.questions || testData.questions.length === 0) {
    return <div>No active test data available.</div>;
  }

  const {
    test_id,
    title,
    time_limit_minutes,
    questions = [],
    negative_marking = 0.33,
    marks_per_question = 1.0,
  } = testData;

  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  // User state: questionId -> optionId
  const [answers, setAnswers] = useState({});
  // Flagged questions set
  const [flagged, setFlagged] = useState(new Set());

  // Timer state
  const totalSeconds = time_limit_minutes ? time_limit_minutes * 60 : null;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Time tracker
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const performSubmit = useCallback(() => {
    setIsSubmitting(true);
    onSubmitTest({
      test_id,
      time_spent_seconds: elapsedSeconds,
      answers,
      flagged: Array.from(flagged),
      marks_per_question,
      negative_marking,
    });
  }, [test_id, elapsedSeconds, answers, flagged, marks_per_question, negative_marking, onSubmitTest]);

  // Countdown timer effect
  useEffect(() => {
    if (totalSeconds === null) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          performSubmit();
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [totalSeconds, performSubmit]);

  // Format MM:SS
  const formatTime = (secs) => {
    if (secs === null) return 'Untimed';
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ.id] || null;
  const isCurrentFlagged = flagged.has(currentQ.id);

  const handleSelectOption = (optId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const handleClearResponse = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQ.id)) {
        next.delete(currentQ.id);
      } else {
        next.add(currentQ.id);
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        handleSelectOption(key);
      } else if (e.key === 'ArrowRight' && currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, totalQuestions, currentQ]);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  // Timer warning class
  let timerColor = 'var(--text-main)';
  if (secondsRemaining !== null) {
    if (secondsRemaining <= 120) timerColor = 'var(--danger)';
    else if (secondsRemaining <= 300) timerColor = 'var(--warning)';
  }

  return (
    <div>
      {/* Test Exam Header */}
      <div
        className="card"
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '2px solid var(--primary)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {title}
          </h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Marking: +{marks_per_question} / -{negative_marking}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {totalSeconds !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: timerColor,
                backgroundColor: 'var(--bg-primary)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
              }}
            >
              <Clock size={18} className={secondsRemaining <= 120 ? 'pulse-timer' : ''} />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          )}

          <button
            onClick={() => setShowConfirmModal(true)}
            className="btn btn-primary"
            id="submit-test-btn"
          >
            <Send size={15} />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main Examination Split Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 280px',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="mock-exam-layout"
      >
        {/* Left: Active Question */}
        <div>
          <div className="card" style={{ marginBottom: '1rem', padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  [{currentQ.id}]
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DifficultyBadge level={currentQ.difficulty} />
                {isCurrentFlagged && (
                  <span className="badge" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed', border: '1px solid #d8b4fe' }}>
                    Marked for Review
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}
            >
              {currentQ.question}
            </div>

            {/* Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              {currentQ.options.map((opt) => {
                const isSelected = currentAnswer === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`option-btn ${isSelected ? 'selected' : ''}`}
                    id={`mock-option-${opt.id}`}
                  >
                    <div className="option-letter">{opt.id}</div>
                    <div className="option-text">{opt.text}</div>
                  </button>
                );
              })}
            </div>

            {/* Middle Controls (Clear & Review Flag) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-light)',
              }}
            >
              <button
                onClick={handleToggleFlag}
                className={`btn btn-sm ${isCurrentFlagged ? 'btn-primary' : 'btn-outline'}`}
                style={isCurrentFlagged ? { backgroundColor: '#7c3aed' } : {}}
              >
                <Flag size={14} />
                <span>{isCurrentFlagged ? 'Unmark Review' : 'Mark for Review'}</span>
              </button>

              <button
                onClick={handleClearResponse}
                disabled={!currentAnswer}
                className="btn btn-outline btn-sm"
              >
                <RotateCcw size={14} />
                <span>Clear Response</span>
              </button>
            </div>
          </div>

          {/* Previous / Next buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="btn btn-secondary"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
              disabled={currentIndex === totalQuestions - 1}
              className="btn btn-secondary"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Test Question Palette */}
        <div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
              Question Palette
            </div>

            <div className="palette-grid" style={{ marginBottom: '1.25rem' }}>
              {questions.map((q, idx) => {
                const isAns = !!answers[q.id];
                const isFlg = flagged.has(q.id);
                const isCurr = idx === currentIndex;

                let btnClass = '';
                if (isFlg) btnClass = 'flagged';
                else if (isAns) btnClass = 'answered';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`palette-btn ${btnClass} ${isCurr ? 'current' : ''}`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Status Legend */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.8rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1d4ed8' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2563eb' }} />
                <span>Answered: {answeredCount}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7c3aed' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                <span>Marked for Review: {flagged.size}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--border-medium)' }} />
                <span>Not Answered: {unansweredCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '460px',
              width: '100%',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <AlertTriangle size={36} style={{ color: 'var(--warning)', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Confirm Test Submission
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              You have answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
              {unansweredCount > 0 && ` You have ${unansweredCount} unanswered questions.`}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Back to Test
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  performSubmit();
                }}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating...' : 'Yes, Submit Final'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
