import React, { useState } from 'react';
import {
  Calculator,
  Brain,
  Landmark,
  Atom,
  ChevronRight,
  Sparkles,
  BookOpen,
  Award,
  Search,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const ICON_MAP = {
  Calculator: Calculator,
  Brain: Brain,
  Landmark: Landmark,
  Atom: Atom,
};

export default function HomePage({ subjects = [], onSelectTopic, onSelectSubject, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all active topics for search
  const allActiveTopics = [];
  subjects.forEach((sub) => {
    sub.topics?.forEach((top) => {
      if (top.is_available) {
        allActiveTopics.push({
          ...top,
          subjectId: sub.id,
          subjectName: sub.name,
        });
      }
    });
  });

  const filteredTopics = searchTerm.trim()
    ? allActiveTopics.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={15} />
          <span>IndiaBIX-Inspired Practice Workflow • 100% Free & Open</span>
        </div>

        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.025em',
            marginBottom: '0.75rem',
          }}
        >
          Master Government Exams by Topic
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 1.75rem auto',
            lineHeight: 1.6,
          }}
        >
          Deliberate topic-wise MCQ practice for RRB NTPC, SSC CGL, RRB Group D, and State Exams.
          Instant answers, step-by-step mathematical shortcuts, and constitutional clarity without registration or paywalls.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '520px', margin: '0 auto 1.5rem auto', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.6rem 1rem',
              gap: '0.75rem',
            }}
          >
            <Search size={18} style={{ color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search topics (e.g. Percentages, Blood Relations, Rights)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick search popup results */}
          {searchTerm.trim() && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 20,
                maxHeight: '260px',
                overflowY: 'auto',
                textAlign: 'left',
              }}
            >
              {filteredTopics.length === 0 ? (
                <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No active starter topics matching "{searchTerm}".
                </div>
              ) : (
                filteredTopics.map((top) => (
                  <button
                    key={top.id}
                    onClick={() => onSelectTopic(top.subjectId, top.id)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-light)',
                      textAlign: 'left',
                    }}
                    className="hover-bg"
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {top.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {top.subjectName} • 20 MCQs
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--text-light)' }} />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Quick CTA Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectTopic('mathematics', 'percentages')}
            className="btn btn-primary btn-lg"
          >
            <span>Start Practice: Percentages</span>
            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => onNavigate('mock-tests')}
            className="btn btn-secondary btn-lg"
          >
            <Award size={18} />
            <span>Take a Mock Test</span>
          </button>
        </div>
      </div>

      {/* 4 Subjects Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Core Subject Areas
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Select a subject to explore active modules or upcoming syllabus topics
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {subjects.map((sub) => {
            const IconComponent = ICON_MAP[sub.icon] || BookOpen;
            const availableCount = sub.topics?.filter((t) => t.is_available).length || 0;
            const totalQuestions = sub.topics?.reduce((acc, t) => acc + (t.question_count || 0), 0) || 0;

            return (
              <div
                key={sub.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onClick={() => onSelectSubject(sub.id)}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent size={22} />
                    </div>

                    <span className="badge badge-active">
                      {totalQuestions} MCQs Available
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    {sub.name}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {sub.description}
                  </p>
                </div>

                <div>
                  {/* Topic list preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                    {sub.topics?.filter((t) => t.is_available).map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTopic(sub.id, t.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.45rem 0.65rem',
                          backgroundColor: 'var(--bg-primary)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: 'var(--text-main)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                          {t.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          20 MCQs
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSubject(sub.id);
                    }}
                  >
                    <span>Browse {sub.short_name} Topics</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Scope Banner */}
      <div
        className="card"
        style={{
          backgroundColor: '#ffffff',
          borderLeft: '4px solid var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Syllabus Coverage: Indian Competitive Examinations
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Designed to support RRB NTPC, RRB Group D, SSC CGL, SSC CHSL, and State Public Service Commissions.
            </p>
          </div>
          <button onClick={() => onNavigate('exams')} className="btn btn-outline btn-sm">
            View Marking Schemes
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-level-2">RRB NTPC (CBT-1 & CBT-2)</span>
          <span className="badge badge-level-3">SSC CGL (Tier-I)</span>
          <span className="badge badge-level-1">RRB Group D (Level-1)</span>
          <span className="badge badge-level-4">SSC CHSL (10+2)</span>
          <span className="badge badge-level-5">State PSC / Police Exams</span>
        </div>
      </div>
    </div>
  );
}
