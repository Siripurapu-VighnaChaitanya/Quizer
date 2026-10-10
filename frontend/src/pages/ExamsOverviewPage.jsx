import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { CheckCircle2, ShieldCheck, Clock, Award } from 'lucide-react';

export default function ExamsOverviewPage({ exams = [], onBackToHome, onNavigateMockTest }) {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', onClick: onBackToHome }, { label: 'Exam Syllabi & Scope' }]} />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
          Examination Scope & Marking Schemes
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          ExamPrep Hub is architected for India's major competitive examinations. Practice with true exam patterns, negative marking penalties, and topic distributions.
        </p>
      </div>

      {/* Exams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {exams.map((ex) => (
          <div key={ex.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {ex.name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {ex.organization} • {ex.stage}
                </div>
              </div>
              <Award size={22} style={{ color: 'var(--primary)' }} />
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              {ex.description}
            </p>

            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                EXAMINATION MARKING SCHEME
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--success)' }}>Correct: +{ex.marking_scheme?.correct}</span>
                <span style={{ color: 'var(--danger)' }}>Negative: -{ex.marking_scheme?.negative}</span>
                <span style={{ color: 'var(--text-main)' }}>Target: ~{ex.marking_scheme?.time_per_q_seconds}s / Q</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                INCLUDED SUBJECT DOMAINS
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {ex.subjects_included.map((s) => (
                  <span key={s} className="badge badge-level-2" style={{ textTransform: 'capitalize' }}>
                    {s.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigateMockTest('full_exam', ex.id)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Take {ex.id.toUpperCase()} Mock Test
            </button>
          </div>
        ))}
      </div>

      {/* Honest Scope Clarification Callout */}
      <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} style={{ color: 'var(--primary)' }} />
          <span>Curriculum Scope & Content Integrity</span>
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          ExamPrep Hub does not publish placeholder questions or unverified counts. All 200 initial MCQs are original, independently verified problems testing actual syllabus concepts across Quantitative Aptitude, General Intelligence, Indian Constitution, and General Science. Additional topics from the official syllabi will be released in planned expansion phases.
        </p>
      </div>
    </div>
  );
}
