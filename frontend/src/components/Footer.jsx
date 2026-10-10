import React from 'react';
import { Database, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            ExamPrep Hub
          </div>
          <div>
            Government Exam Question-Practice Platform • IndiaBIX Inspired Workflow
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={15} style={{ color: 'var(--primary)' }} />
            <span>100% Database-Free (JSON Engine)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={15} style={{ color: 'var(--success)' }} />
            <span>200 Verified Original MCQs</span>
          </div>
          <button
            onClick={() => onNavigate('quality-report')}
            style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.85rem' }}
          >
            Verification Report
          </button>
        </div>
      </div>
    </footer>
  );
}
