import React from 'react';
import { Database, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>
            ExamPrep Hub
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Empowering students with 100% free, deliberate MCQ practice for Indian competitive examinations.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <Database size={16} style={{ color: 'var(--primary)' }} />
            <span>Serverless JSON Engine ($0/month)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
            <span>660 Verified MCQs Across 33 Topics</span>
          </div>

          <button
            onClick={() => onNavigate('quality-report')}
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.8rem' }}
          >
            <Sparkles size={13} />
            <span>Quality Report</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
