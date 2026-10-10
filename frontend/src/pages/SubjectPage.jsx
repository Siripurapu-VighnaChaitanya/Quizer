import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { CheckCircle2, Clock, ArrowRight, Award } from 'lucide-react';

export default function SubjectPage({ subject, onSelectTopic, onNavigateMockTest, onBackToHome }) {
  if (!subject) return null;

  const availableTopics = subject.topics?.filter((t) => t.is_available) || [];
  const upcomingTopics = subject.topics?.filter((t) => !t.is_available) || [];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Subjects', onClick: onBackToHome },
          { label: subject.name },
        ]}
      />

      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          {subject.name}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          {subject.description}
        </p>
      </div>

      {/* Available Starter Topics */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Available Practice Modules ({availableTopics.length} Topics)
          </h2>
          <span className="badge badge-active">Ready for Practice</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {top.name}
                  </h3>
                  <span className="badge badge-active">{top.question_count} Questions</span>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {top.description}
                </p>

                {/* Difficulty distribution indicators */}
                <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-level-1">4 L1 Basic</span>
                  <span className="badge badge-level-2">4 L2 Easy</span>
                  <span className="badge badge-level-3">4 L3 Medium</span>
                  <span className="badge badge-level-4">4 L4 Hard</span>
                  <span className="badge badge-level-5">4 L5 Exam</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => onSelectTopic(subject.id, top.id)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <span>Start Practice</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => onNavigateMockTest('topic', top.id)}
                  className="btn btn-secondary"
                  title="Timed mock test for this topic"
                >
                  <Award size={16} />
                  <span>Mock</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planned Upcoming Topics */}
      {upcomingTopics.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Syllabus Roadmap ({upcomingTopics.length} Planned Topics)
            </h2>
            <span className="badge badge-upcoming">Upcoming Expansion</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {upcomingTopics.map((top) => (
              <div
                key={top.id}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: 0.75,
                }}
              >
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  {top.name}
                </span>
                <Clock size={14} style={{ color: 'var(--text-light)' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
