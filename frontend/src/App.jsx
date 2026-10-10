import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SubjectPage from './pages/SubjectPage';
import PracticePage from './pages/PracticePage';
import MockTestsPage from './pages/MockTestsPage';
import MockTestActivePage from './pages/MockTestActivePage';
import MockTestResultPage from './pages/MockTestResultPage';
import ExamsOverviewPage from './pages/ExamsOverviewPage';
import QualityReportPage from './pages/QualityReportPage';
import {
  fetchSubjects,
  fetchExams,
  fetchMockTestPresets,
  generateMockTest,
  submitMockTest,
} from './services/api';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [mockPresets, setMockPresets] = useState([]);

  // Active navigation selection
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  // Active Mock Test data
  const [activeTestData, setActiveTestData] = useState(null);
  const [testResultData, setTestResultData] = useState(null);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Initial load
  useEffect(() => {
    async function initData() {
      try {
        const [subsData, examsData, presetsData] = await Promise.all([
          fetchSubjects().catch(() => []),
          fetchExams().catch(() => []),
          fetchMockTestPresets().catch(() => ({ presets: [] })),
        ]);
        setSubjects(subsData);
        setExams(examsData);
        setMockPresets(presetsData.presets || []);
      } catch (e) {
        console.error('Failed to load initial app data:', e);
      }
    }
    initData();
  }, []);

  // Handlers for switching views
  const handleSelectSubject = (subId) => {
    setSelectedSubjectId(subId);
    setCurrentRoute('subject');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopic = (subId, topId) => {
    setSelectedSubjectId(subId);
    setSelectedTopicId(topId);
    setCurrentRoute('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMockTest = async (config) => {
    try {
      const generated = await generateMockTest(config);
      setActiveTestData(generated);
      setCurrentRoute('mock-test-active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(`Could not start mock test: ${e.message}`);
    }
  };

  const handleSubmitMockTest = async (payload) => {
    try {
      const result = await submitMockTest(payload);
      setTestResultData(result);
      setCurrentRoute('mock-test-result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(`Could not evaluate mock test: ${e.message}`);
    }
  };

  // Find active subject and topic names
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  let activeTopicName = selectedTopicId;
  if (activeSubject) {
    const top = activeSubject.topics?.find((t) => t.id === selectedTopicId);
    if (top) activeTopicName = top.name;
  }

  return (
    <div className="app-container">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={(route) => {
          setCurrentRoute(route);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchClick={() => {
          setCurrentRoute('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="main-content">
        {currentRoute === 'home' && (
          <HomePage
            subjects={subjects}
            onSelectSubject={handleSelectSubject}
            onSelectTopic={handleSelectTopic}
            onNavigate={(route) => {
              setCurrentRoute(route);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentRoute === 'subject' && (
          <SubjectPage
            subject={activeSubject}
            onSelectTopic={handleSelectTopic}
            onNavigateMockTest={(type, targetId) =>
              handleStartMockTest({
                test_type: type,
                target_id: targetId,
                question_count: 15,
                time_limit_minutes: 15,
                negative_marking: 0.33,
                marks_per_question: 1.0,
              })
            }
            onBackToHome={() => setCurrentRoute('home')}
          />
        )}

        {currentRoute === 'practice' && (
          <PracticePage
            subjectId={selectedSubjectId}
            topicId={selectedTopicId}
            subjectName={activeSubject ? activeSubject.name : 'Subject'}
            topicName={activeTopicName || 'Topic'}
            onBackToSubject={() => setCurrentRoute('subject')}
            onBackToHome={() => setCurrentRoute('home')}
            onNavigateMockTest={(type, targetId) =>
              handleStartMockTest({
                test_type: type,
                target_id: targetId,
                question_count: 15,
                time_limit_minutes: 15,
                negative_marking: 0.33,
                marks_per_question: 1.0,
              })
            }
          />
        )}

        {currentRoute === 'mock-tests' && (
          <MockTestsPage
            presets={mockPresets}
            availableSubjects={subjects}
            availableExams={exams}
            onStartTest={handleStartMockTest}
            onBackToHome={() => setCurrentRoute('home')}
          />
        )}

        {currentRoute === 'mock-test-active' && (
          <MockTestActivePage
            testData={activeTestData}
            onSubmitTest={handleSubmitMockTest}
          />
        )}

        {currentRoute === 'mock-test-result' && (
          <MockTestResultPage
            resultData={testResultData}
            onTakeAnotherTest={() => setCurrentRoute('mock-tests')}
            onBackToHome={() => setCurrentRoute('home')}
          />
        )}

        {currentRoute === 'exams' && (
          <ExamsOverviewPage
            exams={exams}
            onBackToHome={() => setCurrentRoute('home')}
            onNavigateMockTest={(type, targetId) =>
              handleStartMockTest({
                test_type: type,
                target_id: targetId,
                question_count: 20,
                time_limit_minutes: 20,
                negative_marking: 0.33,
                marks_per_question: 1.0,
              })
            }
          />
        )}

        {currentRoute === 'quality-report' && (
          <QualityReportPage onBackToHome={() => setCurrentRoute('home')} />
        )}
      </main>

      <Footer onNavigate={(route) => setCurrentRoute(route)} />
    </div>
  );
}
