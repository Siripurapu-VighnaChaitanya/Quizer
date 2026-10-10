import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, Bookmark, Compass } from 'lucide-react';

export default function ExplanationBox({ explanation }) {
  if (!explanation) return null;

  const [activeMethodIndex, setActiveMethodIndex] = useState(0);

  const methods = explanation.methods || [];
  const hasMethods = methods.length > 0;

  return (
    <div className="explanation-box" id="explanation-container">
      <div className="explanation-title">
        <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
        <span>Explanation & Solution</span>
      </div>

      {explanation.simple && (
        <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: 500 }}>
          {explanation.simple}
        </div>
      )}

      {/* Step by step calculation */}
      {explanation.steps && explanation.steps.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Step-by-Step Breakdown:
          </div>
          <ol className="explanation-steps">
            {explanation.steps.map((step, idx) => (
              <li key={idx} style={{ lineHeight: 1.5 }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Alternative Solving Methods (Standard vs Shortcut) */}
      {hasMethods && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-medium)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <Compass size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Alternative Solving Methods:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {methods.map((method, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMethodIndex(idx)}
                className={`btn btn-sm ${activeMethodIndex === idx ? 'btn-primary' : 'btn-secondary'}`}
              >
                {method.name}
              </button>
            ))}
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem', color: 'var(--primary)' }}>
              {methods[activeMethodIndex]?.name}:
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
              {methods[activeMethodIndex]?.steps.map((step, sIdx) => (
                <li key={sIdx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Exam Tip Callout */}
      {explanation.exam_tip && (
        <div className="exam-tip-callout">
          <Lightbulb size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Exam Tip / Shortcut: </strong>
            <span>{explanation.exam_tip}</span>
          </div>
        </div>
      )}

      {/* Constitutional / Academic Reference */}
      {explanation.reference && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Bookmark size={13} />
          <span>Reference: {explanation.reference}</span>
        </div>
      )}
    </div>
  );
}
