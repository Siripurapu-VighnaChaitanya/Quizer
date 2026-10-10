import React, { useState, useEffect } from 'react';
import DifficultyBadge from '../components/DifficultyBadge';
import ExplanationBox from '../components/ExplanationBox';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Filter,
} from 'lucide-react';

export default function MockTestResultPage({
  resultData,
  onTakeAnotherTest,
  onBackToHome,
}) {
  if (!resultData) return null;

  const {
    total_questions,
    attempted,
    correct,
    incorrect,
    skipped,
    total_marks,
    score,
    percentage,
    accuracy,
    time_spent_seconds = 0,
    questions_review = [],
  } = resultData;

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'incorrect' | 'skipped' | 'correct'

  // Trigger celebration confetti if score >= 60%
  useEffect(() => {
    if (percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas-confetti is not loaded
      }
    }
  }, [percentage]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}m ${rem}s`;
  };

  const filteredReviews = questions_review.filter((q) => {
    if (activeFilter === 'incorrect') return q.status === 'incorrect';
    if (activeFilter === 'skipped') return q.status === 'skipped';
    if (activeFilter === 'correct') return q.status === 'correct';
    return true;
  });

  return (
    <div>
      {/* Performance Summary Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '4px solid var(--primary)',
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}
        >
          <Award size={28} />
        </div>

        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Test Results & Performance Analysis
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
          Authoritative scoring evaluation with complete post-test answer verification.
        </p>

        {/* Big Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            maxWidth: '750px',
            margin: '0 auto 1.75rem auto',
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SCORE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: score >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
              {score} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {total_marks}</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PERCENTAGE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: percentage >= 50 ? 'var(--success)' : 'var(--warning)' }}>
              {percentage}%
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACCURACY</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: accuracy >= 70 ? 'var(--success)' : 'var(--text-main)' }}>
              {accuracy}%
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIME SPENT</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', height: '100%', maxHeight: '42px' }}>
              <Clock size={16} style={{ color: 'var(--text-light)' }} />
              <span>{formatTime(time_spent_seconds)}</span>
            </div>
          </div>
        </div>

        {/* Status Pill Counts */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--success-border)' }}>
            <CheckCircle2 size={16} />
            <span>Correct: {correct}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--danger-border)' }}>
            <XCircle size={16} />
            <span>Incorrect: {incorrect}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)', padding: '0.4rem 0.8rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--border-medium)' }}>
            <HelpCircle size={16} />
            <span>Skipped: {skipped}</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={onTakeAnotherTest} className="btn btn-primary">
            <RotateCcw size={16} />
            <span>Take Another Mock Test</span>
          </button>

          <button onClick={onBackToHome} className="btn btn-secondary">
            <BookOpen size={16} />
            <span>Back to Topic Practice</span>
          </button>
        </div>
      </div>

      {/* Question-by-Question Solution Review Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Comprehensive Question Review ({questions_review.length} Questions)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Review verified solutions, alternative solving methods, and exam shortcuts.
            </p>
          </div>

          {/* Review Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All ({questions_review.length})
            </button>
            <button
              onClick={() => setActiveFilter('incorrect')}
              className={`btn btn-sm ${activeFilter === 'incorrect' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Incorrect ({incorrect})
            </button>
            <button
              onClick={() => setActiveFilter('skipped')}
              className={`btn btn-sm ${activeFilter === 'skipped' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Skipped ({skipped})
            </button>
            <button
              onClick={() => setActiveFilter('correct')}
              className={`btn btn-sm ${activeFilter === 'correct' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Correct ({correct})
            </button>
          </div>
        </div>

        {/* Review Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredReviews.map((item, idx) => {
            let statusBadge = null;
            if (item.status === 'correct') {
              statusBadge = (
                <span className="badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success-text)', border: '1px solid var(--success-border)' }}>
                  Correct ({item.marks_awarded > 0 ? `+${item.marks_awarded}` : item.marks_awarded})
                </span>
              );
            } else if (item.status === 'incorrect') {
              statusBadge = (
                <span className="badge" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)' }}>
                  Incorrect ({item.marks_awarded})
                </span>
              );
            } else {
              statusBadge = (
                <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}>
                  Skipped (0.0)
                </span>
              );
            }

            return (
              <div key={item.question_id} className="card">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border-light)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      Question #{idx + 1}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      [{item.question_id}]
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DifficultyBadge level={item.difficulty} />
                    {statusBadge}
                  </div>
                </div>

                {/* Question Statement */}
                <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                  {item.question}
                </div>

                {/* Option Breakdown */}
                <div style={{ marginBottom: '1.25rem' }}>
                  {item.options.map((opt) => {
                    const isCorrect = opt.id === item.correct_option;
                    const isUserPick = opt.id === item.selected_option;

                    let optClass = 'option-btn';
                    if (isCorrect) optClass += ' correct';
                    else if (isUserPick) optClass += ' incorrect';

                    return (
                      <div key={opt.id} className={optClass} style={{ cursor: 'default' }}>
                        <div className="option-letter">{opt.id}</div>
                        <div className="option-text">{opt.text}</div>
                        {isCorrect && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginLeft: 'auto', alignSelf: 'center' }}>
                            ✓ Verified Correct Answer
                          </span>
                        )}
                        {isUserPick && !isCorrect && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', marginLeft: 'auto', alignSelf: 'center' }}>
                            ✗ Your Selection
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Full Explanation */}
                <ExplanationBox explanation={item.explanation} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
