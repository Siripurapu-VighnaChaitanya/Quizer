import React from 'react';
import { Check, X, Eye, HelpCircle } from 'lucide-react';

export default function QuestionPalette({
  totalQuestions = 20,
  currentIndex = 0,
  questionStates = {},
  onSelectIndex,
}) {
  let correctCount = 0;
  let incorrectCount = 0;
  let revealedCount = 0;

  Object.values(questionStates).forEach((st) => {
    if (st.isRevealed) revealedCount++;
    else if (st.isChecked && st.isCorrect) correctCount++;
    else if (st.isChecked && !st.isCorrect) incorrectCount++;
  });

  const attemptedCount = correctCount + incorrectCount + revealedCount;
  const remainingCount = totalQuestions - attemptedCount;

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
        Question Navigator
      </div>

      {/* Grid of question buttons */}
      <div className="palette-grid" style={{ marginBottom: '1.25rem' }}>
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const st = questionStates[idx] || {};
          let stateClass = '';

          if (st.isRevealed) stateClass = 'revealed';
          else if (st.isChecked && st.isCorrect) stateClass = 'correct';
          else if (st.isChecked && !st.isCorrect) stateClass = 'incorrect';

          const isCurrent = idx === currentIndex;

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`palette-btn ${stateClass} ${isCurrent ? 'current' : ''}`}
              title={`Jump to Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Stats Summary Legend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          fontSize: '0.8rem',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-text)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--success)' }} />
          <span>Correct: {correctCount}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-text)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
          <span>Incorrect: {incorrectCount}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning-text)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--warning)' }} />
          <span>Revealed: {revealedCount}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--border-medium)' }} />
          <span>Remaining: {remainingCount}</span>
        </div>
      </div>
    </div>
  );
}
