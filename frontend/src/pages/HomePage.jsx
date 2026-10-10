import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Brain,
  Landmark,
  Atom,
  BookOpen,
  Laptop,
  ChevronRight,
  Sparkles,
  Award,
  Search,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';

const ICON_MAP = {
  Calculator: Calculator,
  Brain: Brain,
  Landmark: Landmark,
  Atom: Atom,
  BookOpen: BookOpen,
  Laptop: Laptop,
};

// Subject theme color accents
const SUBJECT_COLORS = {
  mathematics: {
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bg: '#fffbeb',
    border: '#fde68a',
  },
  reasoning: {
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    bg: '#f5f3ff',
    border: '#ddd6fe',
  },
  indian_polity: {
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  general_science: {
    accent: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    bg: '#f0f9ff',
    border: '#bae6fd',
  },
  english: {
    accent: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    bg: '#fff1f2',
    border: '#fecdd3',
  },
  computer_knowledge: {
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    bg: '#eef2ff',
    border: '#c7d2fe',
  },
};

export default function HomePage({ subjects = [], onSelectTopic, onSelectSubject, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Collect all active topics for search and counting
  const allActiveTopics = useMemo(() => {
    const list = [];
    subjects.forEach((sub) => {
      sub.topics?.forEach((top) => {
        if (top.is_available) {
          list.push({
            ...top,
            subjectId: sub.id,
            subjectName: sub.name,
          });
        }
      });
    });
    return list;
  }, [subjects]);

  const totalQuestionsCount = useMemo(() => {
    return allActiveTopics.reduce((acc, t) => acc + (t.question_count || 0), 0);
  }, [allActiveTopics]);

  // Filter topics for the instant search bar
  const filteredTopics = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return allActiveTopics.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.subjectName.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
    );
  }, [searchTerm, allActiveTopics]);

  // Filter displayed subjects based on tab selection
  const displayedSubjects = useMemo(() => {
    if (selectedCategory === 'all') return subjects;
    return subjects.filter((s) => s.id === selectedCategory);
  }, [subjects, selectedCategory]);

  return (
    <div>
      {/* Hero Header Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow orb in the background */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '180px',
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Live Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            boxShadow: 'inset 0 0 0 1px var(--primary-border)',
          }}
        >
          <Sparkles size={16} />
          <span>Complete 2026 Question Catalog • 100% Free & Open Access</span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: '2.75rem',
            fontWeight: 900,
            color: 'var(--text-main)',
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          Master Government Exams with <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Topic-Wise Precision Practice
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 2rem auto',
            lineHeight: 1.65,
          }}
        >
          Deliberate, question-by-question mastery for <strong>RRB NTPC, SSC CGL, RRB Group D</strong>, 
          Banking & State PSC examinations. Immediate answer reveals, step-by-step methods, shortcut formulas, 
          and full-length timed mock tests.
        </p>

        {/* Modern Search Input Bar */}
        <div style={{ maxWidth: '560px', margin: '0 auto 2rem auto', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '2px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem 1.25rem',
              gap: '0.85rem',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
              transition: 'border-color 0.2s',
            }}
          >
            <Search size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search 33 topics (e.g. Percentages, Blood Relations, Rights)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--text-main)',
              }}
            />
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  background: 'var(--bg-surface-hover)',
                  borderRadius: 'var(--radius-xs)',
                }}
              >
                Clear
              </button>
            ) : (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-light)',
                  backgroundColor: 'var(--bg-primary)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-light)',
                }}
              >
                {allActiveTopics.length} Topics
              </span>
            )}
          </div>

          {/* Quick Search Dropdown Preview */}
          {searchTerm.trim() && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 40,
                maxHeight: '320px',
                overflowY: 'auto',
                textAlign: 'left',
              }}
            >
              {filteredTopics.length === 0 ? (
                <div style={{ padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center' }}>
                  No active topics found matching "<strong>{searchTerm}</strong>".
                </div>
              ) : (
                filteredTopics.map((top) => (
                  <button
                    key={`${top.subjectId}-${top.id}`}
                    onClick={() => onSelectTopic(top.subjectId, top.id)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                      textAlign: 'left',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {top.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {top.subjectName} • 20 Comprehensive MCQs
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                      <span>Practice</span>
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Dynamic Live Counter Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            maxWidth: '840px',
            margin: '0 auto 2.25rem auto',
          }}
        >
          <div
            style={{
              padding: '1rem 0.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              {subjects.length || 6}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Core Subjects
            </div>
          </div>

          <div
            style={{
              padding: '1rem 0.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-heading)' }}>
              {allActiveTopics.length || 33}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Topics (100%)
            </div>
          </div>

          <div
            style={{
              padding: '1rem 0.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f59e0b', fontFamily: 'var(--font-heading)' }}>
              {totalQuestionsCount || 660}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Handcrafted MCQs
            </div>
          </div>

          <div
            style={{
              padding: '1rem 0.75rem',
              background: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#8b5cf6', fontFamily: 'var(--font-heading)' }}>
              5 Levels
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Basic to Exam Level
            </div>
          </div>
        </div>

        {/* Quick Action CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectTopic('mathematics', 'percentages')}
            className="btn btn-primary btn-lg"
          >
            <Zap size={18} />
            <span>Start Practice: Percentages</span>
            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => onNavigate('mock-tests')}
            className="btn btn-secondary btn-lg"
          >
            <Award size={18} style={{ color: 'var(--primary)' }} />
            <span>Launch Timed Mock Test</span>
          </button>
        </div>
      </section>

      {/* Subject Filter Tabs Bar */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Browse Complete Subject Catalog
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              All 6 subjects and 33 topics are fully loaded with 20 questions each.
            </p>
          </div>
          <button
            onClick={() => onNavigate('mock-tests')}
            className="btn btn-outline btn-sm"
          >
            <Award size={15} />
            <span>Mock Test Generator</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: selectedCategory === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
              backgroundColor: selectedCategory === 'all' ? 'var(--primary-light)' : '#ffffff',
              color: selectedCategory === 'all' ? 'var(--primary)' : 'var(--text-main)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            All Subjects ({allActiveTopics.length})
          </button>

          {subjects.map((sub) => {
            const isSelected = selectedCategory === sub.id;
            const topicCount = sub.topics?.filter((t) => t.is_available).length || 0;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedCategory(sub.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {sub.short_name || sub.name} ({topicCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {displayedSubjects.map((sub) => {
          const IconComponent = ICON_MAP[sub.icon] || BookOpen;
          const styling = SUBJECT_COLORS[sub.id] || {
            accent: 'var(--primary)',
            gradient: 'var(--primary-gradient)',
            bg: 'var(--primary-light)',
            border: 'var(--primary-border)',
          };
          const availableTopics = sub.topics?.filter((t) => t.is_available) || [];
          const totalQuestions = availableTopics.reduce((acc, t) => acc + (t.question_count || 0), 0);

          return (
            <div
              key={sub.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${styling.accent}`,
              }}
            >
              <div>
                {/* Header */}
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
                      width: 50,
                      height: 50,
                      borderRadius: 'var(--radius-md)',
                      background: styling.gradient,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 4px 12px ${styling.accent}33`,
                    }}
                  >
                    <IconComponent size={24} />
                  </div>

                  <span
                    className="badge"
                    style={{
                      backgroundColor: styling.bg,
                      color: styling.accent,
                      border: `1px solid ${styling.border}`,
                    }}
                  >
                    {totalQuestions} MCQs Active
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  {sub.name}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                  {sub.description}
                </p>

                {/* Topics Preview List */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                    Topics Included ({availableTopics.length})
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {availableTopics.map((top) => (
                      <div
                        key={top.id}
                        onClick={() => onSelectTopic(sub.id, top.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.55rem 0.75rem',
                          backgroundColor: 'var(--bg-primary)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = styling.bg;
                          e.currentTarget.style.borderColor = styling.border;
                          e.currentTarget.style.transform = 'translateX(3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                          e.currentTarget.style.borderColor = 'var(--border-light)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={15} style={{ color: styling.accent }} />
                          {top.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {top.question_count || 20} Qs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => onSelectSubject(sub.id)}
                >
                  <span>Explore Subject ({availableTopics.length} Topics)</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Competitive Exam Alignment Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderLeft: '5px solid var(--primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <TrendingUp size={16} />
              <span>Full Exam Alignment</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Mapped to Standard Competitive Exam Patterns
            </h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', marginTop: '0.3rem', maxWidth: '780px' }}>
              Practice questions with exact 4-option single-correct structure, 1/3rd negative marking simulations, 
              and difficulty levels matching Tier-I & Tier-II exams.
            </p>
          </div>
          <button onClick={() => onNavigate('exams')} className="btn btn-secondary">
            <span>View Marking Schemes</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span className="badge badge-level-2" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            🚆 RRB NTPC (CBT-1 & CBT-2)
          </span>
          <span className="badge badge-level-3" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            🏛️ SSC CGL (Tier-I & Tier-II)
          </span>
          <span className="badge badge-level-1" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            ⚙️ RRB Group D (Level-1)
          </span>
          <span className="badge badge-level-4" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            📝 SSC CHSL (10+2 DEO/LDC)
          </span>
          <span className="badge badge-level-5" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            🛡️ State PSC / Police SI Exams
          </span>
        </div>
      </div>
    </div>
  );
}
