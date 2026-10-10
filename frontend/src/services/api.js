const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse(res);
}

export async function fetchExams() {
  const res = await fetch(`${API_BASE}/exams`);
  return handleResponse(res);
}

export async function fetchSubjects() {
  const res = await fetch(`${API_BASE}/subjects`);
  return handleResponse(res);
}

export async function fetchTopics(subjectId = null) {
  const url = subjectId ? `${API_BASE}/topics?subject=${encodeURIComponent(subjectId)}` : `${API_BASE}/topics`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchQuestions({ topic, subject, difficulty, includeAnswers = false } = {}) {
  const params = new URLSearchParams();
  if (topic) params.append('topic', topic);
  if (subject) params.append('subject', subject);
  if (difficulty) params.append('difficulty', difficulty);
  if (includeAnswers) params.append('include_answers', 'true');

  const res = await fetch(`${API_BASE}/questions?${params.toString()}`);
  return handleResponse(res);
}

export async function fetchQuestion(questionId, includeAnswers = false) {
  const url = `${API_BASE}/questions/${encodeURIComponent(questionId)}${includeAnswers ? '?include_answers=true' : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function submitPracticeAnswer({ questionId, selectedOption }) {
  const res = await fetch(`${API_BASE}/practice/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question_id: questionId,
      selected_option: selectedOption,
    }),
  });
  return handleResponse(res);
}

export async function revealPracticeAnswer(questionId) {
  const res = await fetch(`${API_BASE}/practice/reveal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question_id: questionId,
    }),
  });
  return handleResponse(res);
}

export async function fetchMockTestPresets() {
  const res = await fetch(`${API_BASE}/mock-tests`);
  return handleResponse(res);
}

export async function generateMockTest(config) {
  const res = await fetch(`${API_BASE}/mock-tests/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return handleResponse(res);
}

export async function submitMockTest(payload) {
  const res = await fetch(`${API_BASE}/mock-tests/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchQualityReport() {
  const res = await fetch(`${API_BASE}/quality-report`);
  return handleResponse(res);
}
