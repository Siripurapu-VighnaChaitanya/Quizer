import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  CheckCircle2,
  ArrowRight,
  Award,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function SubjectPage({ subject, onSelectTopic, onNavigateMockTest, onBackToHome }) {
  if (!subject) return null;

  const availableTopics = subject.topics?.filter((t) => t.is_available) || [];
  const totalQuestions = availableTopics.reduce((acc, t) => acc + (t.question_count || 0), 0);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'All Subjects', onClick: onBackToHome },
          { label: subject.name },
        ]}
      />

      {/* Subject Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.75rem',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              <Sparkles size={14} />
              <span>Full Syllabus Module • 100% Available</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>
              {subject.name}
            </h1>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '720px', lineHeight: 1.6 }}>
              {subject.description}
            </p>
          </div>

          {/* Action to launch subject-wide mock test */}
          <button
            onClick={() => onNavigateMockTest('subject', subject.id)}
            className="btn btn-primary btn-lg"
            title="Generate a multi-topic timed mock test for this subject"
          >
            <Award size={18} />
            <span>Take {subject.short_name || 'Subject'} Mock Test</span>
          </button>
        </div>

        {/* Stats Pill Row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span className="badge badge-active" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            <CheckCircle2 size={14} />
            <span>{availableTopics.length} Active Topics</span>
          </span>

          <span className="badge badge-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            <Layers size={14} />
            <span>{totalQuestions} Total Questions</span>
          </span>

          <span className="badge badge-level-3" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            <Zap size={14} />
            <span>Instant Explanations & Shortcuts</span>
          </span>
        </div>
      </div>

      {/* Topics Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Practice Modules ({availableTopics.length} Topics)
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Select any topic below to practice untimed with immediate answer feedback or launch a timed mock test.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {availableTopics.map((top) => (
            <div
              key={top.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {top.name}
                  </h3>
                  <span className="badge badge-active">
                    {top.question_count || 20} Questions
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  {top.description}
                </p>

                {/* 5-Level difficulty badges */}
                <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-level-1">4 L1 Basic</span>
                  <span className="badge badge-level-2">4 L2 Easy</span>
                  <span className="badge badge-level-3">4 L3 Medium</span>
                  <span className="badge badge-level-4">4 L4 Hard</span>
                  <span className="badge badge-level-5">4 L5 Exam</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => onSelectTopic(subject.id, top.id)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <span>Practice 20 MCQs</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigateMockTest('topic', top.id)}
                  className="btn btn-secondary"
                  title="Timed mock test for this topic"
                >
                  <Award size={16} />
                  <span>Mock Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
