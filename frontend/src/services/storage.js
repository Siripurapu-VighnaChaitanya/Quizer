const STORAGE_KEY_PREFIX = 'examprep_';

export function getLocalItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read from localStorage (${key}):`, e);
    return defaultValue;
  }
}

export function setLocalItem(key, value) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage (${key}):`, e);
  }
}

export function removeLocalItem(key) {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  } catch (e) {
    console.warn(`Failed to remove from localStorage (${key}):`, e);
  }
}

export function clearAllLocalProgress() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Failed to clear progress:', e);
  }
}

// Session preferences
export function getPracticePreferences() {
  return getLocalItem('pref_practice', {
    instantFeedback: false,
    soundEffects: false,
    fontSize: 'medium',
  });
}

export function savePracticePreferences(prefs) {
  setLocalItem('pref_practice', prefs);
}

// Topic-level session progress tracking
export function getTopicProgress(topicId) {
  return getLocalItem(`progress_${topicId}`, {
    answered: {},
    correct: 0,
    incorrect: 0,
    revealed: 0,
    lastQuestionIndex: 0,
  });
}

export function saveTopicProgress(topicId, progressData) {
  setLocalItem(`progress_${topicId}`, progressData);
}

export function resetTopicProgress(topicId) {
  removeLocalItem(`progress_${topicId}`);
}
