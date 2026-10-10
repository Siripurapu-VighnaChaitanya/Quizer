import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { Award, Clock, AlertTriangle, ArrowRight, Settings } from 'lucide-react';

export default function MockTestsPage({
  presets = [],
  availableSubjects = [],
  availableExams = [],
  onStartTest,
  onBackToHome,
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0]?.id || 'full-rrb-ntpc');

  // Custom configuration state
  const [customType, setCustomType] = useState('full_exam'); // 'topic' | 'subject' | 'full_exam'
  const [customTarget, setCustomTarget] = useState('rrb-ntpc');
  const [customCount, setCustomCount] = useState(15);
  const [customTimer, setCustomTimer] = useState(15); // minutes, 0 for untimed
  const [customNegMark, setCustomNegMark] = useState(0.33);

  const handleLaunchPreset = (preset) => {
    onStartTest({
      test_type: preset.type,
      target_id: preset.target_id,
      question_count: preset.questions_count,
      time_limit_minutes: preset.time_minutes,
      negative_marking: preset.negative_marking,
      marks_per_question: 1.0,
    });
  };

  const handleLaunchCustom = () => {
    onStartTest({
      test_type: customType,
      target_id: customTarget,
      question_count: Number(customCount),
      time_limit_minutes: Number(customTimer) === 0 ? null : Number(customTimer),
      negative_marking: Number(customNegMark),
      marks_per_question: 1.0,
    });
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', onClick: onBackToHome }, { label: 'Mock Tests' }]} />

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Exam-Style Mock Tests
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Experience realistic exam pressure. Zero answer leaks during test, authoritative grading, configurable negative marking, and full post-test explanations.
        </p>
      </div>

      {/* Preset Tests Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
          Standard Exam Presets
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {presets.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {p.title}
                  </h3>
                  <Award size={20} style={{ color: 'var(--primary)' }} />
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {p.description}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-level-2">
                    {p.questions_count} Questions
                  </span>
                  <span className="badge badge-level-3">
                    <Clock size={11} style={{ marginRight: 2 }} />
                    {p.time_minutes} Minutes
                  </span>
                  <span className="badge badge-level-5">
                    -{p.negative_marking} Negative Marking
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleLaunchPreset(p)}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span>Start {p.title.split(' ')[0]} Test</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Test Builder */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Settings size={20} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Custom Test Builder
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Test Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Test Scope
            </label>
            <select
              value={customType}
              onChange={(e) => {
                const val = e.target.value;
                setCustomType(val);
                if (val === 'full_exam') setCustomTarget('rrb-ntpc');
                else if (val === 'subject') setCustomTarget('mathematics');
                else if (val === 'topic') setCustomTarget('percentages');
              }}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
              }}
            >
              <option value="full_exam">Full Exam Simulation</option>
              <option value="subject">Subject Sectional</option>
              <option value="topic">Topic Focused</option>
            </select>
          </div>

          {/* Specific Target */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Target Subject / Exam / Topic
            </label>
            <select
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
              }}
            >
              {customType === 'full_exam' &&
                availableExams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}

              {customType === 'subject' &&
                availableSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}

              {customType === 'topic' &&
                availableSubjects.flatMap((sub) =>
                  sub.topics
                    .filter((t) => t.is_available)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {sub.short_name}: {t.name}
                      </option>
                    ))
                )}
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Questions Count
            </label>
            <select
              value={customCount}
              onChange={(e) => setCustomCount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
              }}
            >
              <option value={5}>5 Questions (Quick Check)</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions (Standard)</option>
            </select>
          </div>

          {/* Timer */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Time Limit
            </label>
            <select
              value={customTimer}
              onChange={(e) => setCustomTimer(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
              }}
            >
              <option value={0}>Untimed Practice</option>
              <option value={5}>5 Minutes</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
            </select>
          </div>

          {/* Negative Marking */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Negative Marking Rate
            </label>
            <select
              value={customNegMark}
              onChange={(e) => setCustomNegMark(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
              }}
            >
              <option value={0.0}>0.0 (No Negative Marking)</option>
              <option value={0.25}>-0.25 (1/4th Penalty)</option>
              <option value={0.33}>-0.33 (1/3rd Railway/NTPC Pattern)</option>
              <option value={0.50}>-0.50 (SSC CGL 2-mark Pattern)</option>
            </select>
          </div>
        </div>

        <button onClick={handleLaunchCustom} className="btn btn-primary btn-lg">
          <Award size={18} />
          <span>Launch Custom Mock Test</span>
        </button>
      </div>
    </div>
  );
}
