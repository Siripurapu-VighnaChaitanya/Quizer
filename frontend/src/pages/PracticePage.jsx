import React, { useState, useEffect, useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import QuestionCard from '../components/QuestionCard';
import QuestionPalette from '../components/QuestionPalette';
import {
  fetchQuestions,
  submitPracticeAnswer,
  revealPracticeAnswer,
} from '../services/api';
import {
  getTopicProgress,
  saveTopicProgress,
  resetTopicProgress,
  getPracticePreferences,
  savePracticePreferences,
} from '../services/storage';
import {
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';

export default function PracticePage({
  subjectId,
  topicId,
  subjectName = 'Subject',
  topicName = 'Topic',
  onBackToSubject,
  onBackToHome,
  onNavigateMockTest,
}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Mode controls
  const [selectedDifficulty, setSelectedDifficulty] = useState('all'); // 'all' | 1 | 2 | 3 | 4 | 5
  const [isProgressiveMode, setIsProgressiveMode] = useState(false);
  const [filterOnlyIncorrect, setFilterOnlyIncorrect] = useState(false);

  // Preferences
  const [instantFeedback, setInstantFeedback] = useState(() => {
    return getPracticePreferences().instantFeedback || false;
  });

  // Current session navigation state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Question state map: questionId -> { selectedOption, isChecked, isRevealed, isCorrect, correctOption, explanation }
  const [questionStates, setQuestionStates] = useState({});

  // Progressive streak tracking
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveIncorrect, setConsecutiveIncorrect] = useState(0);
  const [progressiveNotification, setProgressiveNotification] = useState(null);

  // Load questions from backend
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch all 20 questions for this topic
        const data = await fetchQuestions({ topic: topicId });
        setQuestions(data);

        // Restore local progress if exists
        const savedProgress = getTopicProgress(topicId);
        if (savedProgress && savedProgress.answered) {
          setQuestionStates(savedProgress.answered);
          if (
            savedProgress.lastQuestionIndex &&
            savedProgress.lastQuestionIndex < data.length
          ) {
            setCurrentIndex(savedProgress.lastQuestionIndex);
          }
        }
      } catch (err) {
        console.error('Failed to load topic questions:', err);
        setError(err.message || 'Failed to load questions. Please verify backend is running.');
      } finally {
        setLoading(false);
      }
    }

    if (topicId) {
      loadData();
    }
  }, [topicId]);

  // Persist progress to local storage
  useEffect(() => {
    if (topicId && Object.keys(questionStates).length > 0) {
      saveTopicProgress(topicId, {
        answered: questionStates,
        lastQuestionIndex: currentIndex,
      });
    }
  }, [questionStates, currentIndex, topicId]);

  // Filtered questions based on selected difficulty and retry-incorrect filter
  const displayedQuestions = useMemo(() => {
    let list = questions;

    if (filterOnlyIncorrect) {
      list = list.filter((q) => {
        const st = questionStates[q.id];
        return st && st.isChecked && !st.isCorrect;
      });
    } else if (selectedDifficulty !== 'all') {
      const diffNum = Number(selectedDifficulty);
      list = list.filter((q) => q.difficulty === diffNum);
    }

    return list;
  }, [questions, selectedDifficulty, filterOnlyIncorrect, questionStates]);

  // Ensure currentIndex stays within bounds when filter changes
  useEffect(() => {
    if (displayedQuestions.length > 0 && currentIndex >= displayedQuestions.length) {
      setCurrentIndex(0);
    }
  }, [displayedQuestions.length, currentIndex]);

  const currentQuestion = displayedQuestions[currentIndex] || null;
  const currentQState = currentQuestion ? questionStates[currentQuestion.id] || {} : {};

  // Handlers
  const handleSelectOption = (optId) => {
    if (!currentQuestion) return;
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: optId,
      },
    }));
  };

  const handleCheckAnswer = async (overrideOption = null) => {
    if (!currentQuestion) return;
    const optionToSubmit = overrideOption || currentQState.selectedOption;
    if (!optionToSubmit) return;

    try {
      const res = await submitPracticeAnswer({
        questionId: currentQuestion.id,
        selectedOption: optionToSubmit,
      });

      setQuestionStates((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          selectedOption: optionToSubmit,
          isChecked: true,
          isRevealed: false,
          isCorrect: res.is_correct,
          correctOption: res.correct_option,
          explanation: res.explanation,
        },
      }));

      // Progressive Mode Logic
      if (isProgressiveMode) {
        if (res.is_correct) {
          const newStreak = consecutiveCorrect + 1;
          setConsecutiveCorrect(newStreak);
          setConsecutiveIncorrect(0);

          if (newStreak >= 2 && currentQuestion.difficulty < 5) {
            const nextDiff = currentQuestion.difficulty + 1;
            setProgressiveNotification({
              type: 'up',
              message: `2 in a row correct! Moving to Level ${nextDiff}.`,
            });
            setSelectedDifficulty(nextDiff);
            setConsecutiveCorrect(0);
          }
        } else {
          const newWrongStreak = consecutiveIncorrect + 1;
          setConsecutiveIncorrect(newWrongStreak);
          setConsecutiveCorrect(0);

          if (newWrongStreak >= 2 && currentQuestion.difficulty > 1) {
            const prevDiff = currentQuestion.difficulty - 1;
            setProgressiveNotification({
              type: 'down',
              message: `Take your time! Shifting to Level ${prevDiff} for concept revision.`,
            });
            setSelectedDifficulty(prevDiff);
            setConsecutiveIncorrect(0);
          }
        }
      }
    } catch (err) {
      console.error('Error submitting practice answer:', err);
      alert('Could not verify answer. Please check your connection to the server.');
    }
  };

  const handleRevealAnswer = async () => {
    if (!currentQuestion) return;
    try {
      const res = await revealPracticeAnswer(currentQuestion.id);

      setQuestionStates((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          isChecked: false,
          isRevealed: true,
          isCorrect: false, // 0 points awarded
          correctOption: res.correct_option,
          explanation: res.explanation,
        },
      }));
    } catch (err) {
      console.error('Error revealing answer:', err);
    }
  };

  const handleRetryQuestion = () => {
    if (!currentQuestion) return;
    setQuestionStates((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  const handleRestartTopic = () => {
    if (window.confirm('Reset all saved answers and progress for this topic?')) {
      resetTopicProgress(topicId);
      setQuestionStates({});
      setCurrentIndex(0);
      setFilterOnlyIncorrect(false);
      setConsecutiveCorrect(0);
      setConsecutiveIncorrect(0);
      setProgressiveNotification(null);
    }
  };

  const handleToggleInstantFeedback = () => {
    const nextVal = !instantFeedback;
    setInstantFeedback(nextVal);
    savePracticePreferences({ ...getPracticePreferences(), instantFeedback: nextVal });
  };

  // Convert questionStates to index-based states for QuestionPalette
  const paletteStates = useMemo(() => {
    const states = {};
    displayedQuestions.forEach((q, idx) => {
      if (questionStates[q.id]) {
        states[idx] = questionStates[q.id];
      }
    });
    return states;
  }, [displayedQuestions, questionStates]);

  const incorrectCount = useMemo(() => {
    return questions.filter((q) => {
      const st = questionStates[q.id];
      return st && st.isChecked && !st.isCorrect;
    }).length;
  }, [questions, questionStates]);

  if (loading) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Loading Questions...
        </div>
        <p>Retrieving verified question bank from local JSON engine.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--danger)' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>Connection Error</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{error}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Subjects', onClick: onBackToHome },
          { label: subjectName, onClick: onBackToSubject },
          { label: topicName },
        ]}
      />

      {/* Topic Header & Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            {topicName} Practice
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {subjectName} • 20 Verified MCQs across 5 Difficulty Levels
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => onNavigateMockTest('topic', topicId)}
            className="btn btn-secondary btn-sm"
            title="Switch to timed exam mock test mode"
          >
            <Award size={15} />
            <span>Mock Test</span>
          </button>

          <button
            onClick={handleToggleInstantFeedback}
            className={`btn btn-sm ${instantFeedback ? 'btn-primary' : 'btn-outline'}`}
            title="Instant feedback evaluates on option click"
          >
            <span>{instantFeedback ? 'Instant Check: ON' : 'Check Button Mode'}</span>
          </button>

          <button
            onClick={handleRestartTopic}
            className="btn btn-outline btn-sm"
            title="Clear saved session answers"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Difficulty Filters & Progressive Mode Toggle */}
      <div
        className="card"
        style={{
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={14} />
            <span>Difficulty:</span>
          </span>

          {['all', 1, 2, 3, 4, 5].map((lvl) => {
            const isActive = selectedDifficulty === lvl && !filterOnlyIncorrect;
            const labels = {
              all: 'All Levels (20)',
              1: 'L1 Basic',
              2: 'L2 Easy',
              3: 'L3 Medium',
              4: 'L4 Hard',
              5: 'L5 Exam',
            };

            return (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedDifficulty(lvl);
                  setFilterOnlyIncorrect(false);
                }}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
              >
                {labels[lvl]}
              </button>
            );
          })}

          {incorrectCount > 0 && (
            <button
              onClick={() => setFilterOnlyIncorrect(!filterOnlyIncorrect)}
              className={`btn btn-sm ${filterOnlyIncorrect ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderColor: 'var(--danger-border)',
                color: filterOnlyIncorrect ? 'white' : 'var(--danger-text)',
                backgroundColor: filterOnlyIncorrect ? 'var(--danger)' : 'var(--danger-bg)',
                padding: '0.25rem 0.6rem',
                fontSize: '0.8rem',
              }}
            >
              <span>Retry Mistakes ({incorrectCount})</span>
            </button>
          )}
        </div>

        {/* Progressive practice toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => {
              setIsProgressiveMode(!isProgressiveMode);
              setProgressiveNotification(null);
            }}
            className={`badge ${isProgressiveMode ? 'badge-active' : 'badge-upcoming'}`}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            title="Progressive mode automatically steps difficulty based on your success streak"
          >
            <TrendingUp size={13} />
            <span>Progressive Mode: {isProgressiveMode ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Progressive notification message */}
      {progressiveNotification && (
        <div
          style={{
            backgroundColor: progressiveNotification.type === 'up' ? 'var(--success-bg)' : 'var(--warning-bg)',
            color: progressiveNotification.type === 'up' ? 'var(--success-text)' : 'var(--warning-text)',
            border: `1px solid ${progressiveNotification.type === 'up' ? 'var(--success-border)' : 'var(--warning-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '0.6rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Sparkles size={16} />
          <span>{progressiveNotification.message}</span>
        </div>
      )}

      {/* Main Practice Content: Left Question Card, Right Question Palette */}
      {displayedQuestions.length === 0 ? (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            No questions match the current filter selection.
          </p>
          <button
            onClick={() => {
              setSelectedDifficulty('all');
              setFilterOnlyIncorrect(false);
            }}
            className="btn btn-primary"
          >
            View All Questions
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: '1.5rem',
            alignItems: 'start',
          }}
          className="practice-layout"
        >
          <div>
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              totalQuestions={displayedQuestions.length}
              selectedOption={currentQState.selectedOption}
              isChecked={currentQState.isChecked}
              isRevealed={currentQState.isRevealed}
              isCorrect={currentQState.isCorrect}
              correctOption={currentQState.correctOption}
              explanation={currentQState.explanation}
              instantFeedback={instantFeedback}
              onSelectOption={handleSelectOption}
              onCheckAnswer={handleCheckAnswer}
              onRevealAnswer={handleRevealAnswer}
              onRetryQuestion={handleRetryQuestion}
              onNextQuestion={() => {
                if (currentIndex < displayedQuestions.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                }
              }}
              hasNext={currentIndex < displayedQuestions.length - 1}
            />

            {/* Bottom Nav Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
              }}
            >
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn btn-secondary"
                id="prev-question-btn"
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Use [A, B, C, D] or click options • Press [Enter] for Next
              </span>

              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(displayedQuestions.length - 1, prev + 1)
                  )
                }
                disabled={currentIndex >= displayedQuestions.length - 1}
                className="btn btn-secondary"
                id="nav-next-btn"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Navigator Column */}
          <div>
            <QuestionPalette
              totalQuestions={displayedQuestions.length}
              currentIndex={currentIndex}
              questionStates={paletteStates}
              onSelectIndex={(idx) => setCurrentIndex(idx)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
