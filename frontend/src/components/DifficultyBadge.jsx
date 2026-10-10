import React from 'react';

const LEVEL_NAMES = {
  1: 'Basic',
  2: 'Easy',
  3: 'Medium',
  4: 'Hard',
  5: 'Exam Level',
};

export default function DifficultyBadge({ level = 1, showLabel = true }) {
  const safeLevel = Math.min(Math.max(Number(level) || 1, 1), 5);
  const name = LEVEL_NAMES[safeLevel];

  return (
    <span className={`badge badge-level-${safeLevel}`} title={`Difficulty Level ${safeLevel}: ${name}`}>
      Level {safeLevel}{showLabel && ` • ${name}`}
    </span>
  );
}
