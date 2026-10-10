import React, { useEffect, useCallback } from 'react';
import DifficultyBadge from './DifficultyBadge';
import ExplanationBox from './ExplanationBox';
import { Check, X, Eye, RotateCcw, ArrowRight } from 'lucide-react';

export default function QuestionCard({
  question,
  questionNumber = 1,
  totalQuestions = 20,
  selectedOption = null,
  isChecked = false,
  isRevealed = false,
  isCorrect = null,
  correctOption = null,
  explanation = null,
  instantFeedback = false,
  onSelectOption,
  onCheckAnswer,
  onRevealAnswer,
  onRetryQuestion,
  onNextQuestion,
  hasNext = true,
}) {
  if (!question) return null;

  // Keyboard shortcut handler (A, B, C, D to select, Enter to check)
  const handleKeyDown = useCallback(
    (e) => {
      // Don't trigger if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key) && !isChecked && !isRevealed) {
        onSelectOption(key);
      } else if (e.key === 'Enter') {
        if (!isChecked && !isRevealed && selectedOption) {
          onCheckAnswer();
        } else if ((isChecked || isRevealed) && hasNext) {
          onNextQuestion();
        }
      }
    },
    [isChecked, isRevealed, selectedOption, onSelectOption, onCheckAnswer, onNextQuestion, hasNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const showSolution = isChecked || isRevealed;

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      {/* Question Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-light)',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            [{question.id}]
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DifficultyBadge level={question.difficulty} />
          {isRevealed && (
            <span className="badge badge-upcoming" style={{ background: '#fef3c7', color: '#b45309' }}>
              Solution Revealed
            </span>
          )}
        </div>
      </div>

      {/* Question Statement */}
      <div
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'var(--text-main)',
          marginBottom: '1.5rem',
          lineHeight: 1.6,
        }}
      >
        {question.question}
      </div>

      {/* Options List */}
      <div style={{ marginBottom: '1.25rem' }}>
        {question.options.map((opt) => {
          const isUserSelected = selectedOption === opt.id;
          let optionClass = 'option-btn';

          if (showSolution) {
            if (opt.id === correctOption) {
              optionClass += ' correct';
            } else if (isUserSelected && !isCorrect) {
              optionClass += ' incorrect';
            }
          } else if (isUserSelected) {
            optionClass += ' selected';
          }

          return (
            <button
              key={opt.id}
              onClick={() => {
                if (!isChecked && !isRevealed) {
                  onSelectOption(opt.id);
                  if (instantFeedback) {
                    // In instant feedback mode, immediately trigger check
                    onCheckAnswer(opt.id);
                  }
                }
              }}
              disabled={isChecked || isRevealed}
              className={optionClass}
              id={`option-${opt.id}`}
            >
              <div className="option-letter">{opt.id}</div>
              <div className="option-text">{opt.text}</div>
              {showSolution && opt.id === correctOption && (
                <Check size={18} style={{ color: 'var(--success)', marginLeft: 'auto', alignSelf: 'center' }} />
              )}
              {showSolution && isUserSelected && !isCorrect && (
                <X size={18} style={{ color: 'var(--danger)', marginLeft: 'auto', alignSelf: 'center' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {!instantFeedback && !showSolution && (
            <button
              onClick={() => onCheckAnswer()}
              disabled={!selectedOption}
              className="btn btn-primary"
              id="check-answer-btn"
            >
              <Check size={16} />
              <span>Check Answer</span>
            </button>
          )}

          {!showSolution && (
            <button
              onClick={onRevealAnswer}
              className="btn btn-secondary"
              id="show-answer-btn"
              title="Reveal answer and explanation (no score awarded)"
            >
              <Eye size={16} />
              <span>Show Answer / Solution</span>
            </button>
          )}

          {showSolution && (
            <button
              onClick={onRetryQuestion}
              className="btn btn-secondary"
              id="retry-question-btn"
            >
              <RotateCcw size={15} />
              <span>Retry Question</span>
            </button>
          )}
        </div>

        {showSolution && hasNext && (
          <button
            onClick={onNextQuestion}
            className="btn btn-primary"
            id="next-question-btn"
          >
            <span>Next Question</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Explanation Box */}
      {showSolution && <ExplanationBox explanation={explanation} />}
    </div>
  );
}
