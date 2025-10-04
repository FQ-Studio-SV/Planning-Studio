import { useState, useEffect } from 'react';
import { useAppStore } from '../store/app-store';
import { type ProjectResults, type UserStory } from '../types';
import { StepHeader } from './step-header';

type LoadingTask = {
  id: number;
  label: string;
  completed: boolean;
};

export function ResultsVisualization() {
  const { projectData, setCurrentStep } = useAppStore();
  const [results, setResults] = useState<ProjectResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'stories' | 'schedule' | 'csv'>('overview');
  const [loadingTasks, setLoadingTasks] = useState<LoadingTask[]>([
    { id: 1, label: 'Analyzing project requirements', completed: false },
    { id: 2, label: 'Breaking down into user stories', completed: false },
    { id: 3, label: 'Estimating story points', completed: false },
    { id: 4, label: 'Assigning team members', completed: false },
    { id: 5, label: 'Creating delivery schedule', completed: false },
    { id: 6, label: 'Finalizing project plan', completed: false },
  ]);

  // Animate loading tasks
  useEffect(() => {
    if (!isLoading) return;

    const taskTimings = [500, 1000, 1500, 2000, 2500, 3000];
    const timers = taskTimings.map((delay, index) =>
      setTimeout(() => {
        setLoadingTasks(prev => 
          prev.map(task => 
            task.id === index + 1 ? { ...task, completed: true } : task
          )
        );
      }, delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [isLoading]);

  // Mock AI processing (replace with actual Gemini API call)
  useEffect(() => {
    const generateResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3500));

        // Mock generated data
        const mockStories: UserStory[] = [
          {
            id: '1',
            title: 'User Authentication System',
            description: 'Implement secure login and registration functionality',
            storyPoints: 8,
            assignee: projectData.teamMembers?.[0] || 'Unassigned',
            week: 1
          },
          {
            id: '2',
            title: 'Dashboard Interface',
            description: 'Create main dashboard with user data visualization',
            storyPoints: 5,
            assignee: projectData.teamMembers?.[1] || 'Unassigned',
            week: 1
          },
          {
            id: '3',
            title: 'Data Management API',
            description: 'Build REST API for data CRUD operations',
            storyPoints: 13,
            assignee: projectData.teamMembers?.[0] || 'Unassigned',
            week: 2
          },
          {
            id: '4',
            title: 'Mobile Responsive Design',
            description: 'Ensure application works on mobile devices',
            storyPoints: 5,
            assignee: projectData.teamMembers?.[2] || 'Unassigned',
            week: 2
          },
          {
            id: '5',
            title: 'Testing & Quality Assurance',
            description: 'Implement comprehensive testing suite',
            storyPoints: 8,
            assignee: projectData.teamMembers?.[1] || 'Unassigned',
            week: 3
          }
        ];

        const mockResults: ProjectResults = {
          userStories: mockStories,
          totalStoryPoints: mockStories.reduce((sum, story) => sum + story.storyPoints, 0),
          estimatedWeeks: projectData.deliveryWeeks || 4,
          csvData: generateCSV(mockStories)
        };

        setResults(mockResults);
      } catch (err) {
        console.error('Error generating project plan:', err);
        setError('Failed to generate project plan. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateResults();
  }, [projectData]);

  const generateCSV = (stories: UserStory[]): string => {
    const headers = 'Issue Type,Summary,Description,Story Points,Assignee,Week\n';
    const rows = stories.map(story => 
      `Story,"${story.title}","${story.description}",${story.storyPoints},"${story.assignee}",${story.week}`
    ).join('\n');
    return headers + rows;
  };

  const downloadCSV = () => {
    if (!results) return;

    const blob = new Blob([results.csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jira-import.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const sendToJira = async () => {
    // Mock Jira integration (replace with actual API call)
    alert('Jira integration would be implemented here. This would create issues directly in your Jira project.');
  };

  const handleBack = () => {
    setCurrentStep('details');
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-bermuda-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-bermuda-400 to-bermuda-600 rounded-full mb-4 animate-pulse">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-bermuda-700 to-bermuda-500 bg-clip-text text-transparent">
                Generating Your Project Plan
              </h2>
              <p className="text-bermuda-600">
                Our AI is working its magic...
              </p>
            </div>

            {/* Loading Tasks */}
            <div className="space-y-3">
              {loadingTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-500 ${
                    task.completed 
                      ? 'bg-bermuda-50 border-2 border-bermuda-300' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards'
                  }}
                >
                  {/* Checkbox */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed 
                      ? 'bg-bermuda-500 border-bermuda-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {task.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Task Label */}
                  <span className={`flex-1 font-medium transition-all duration-300 ${
                    task.completed 
                      ? 'text-bermuda-900' 
                      : 'text-gray-500'
                  }`}>
                    {task.label}
                  </span>

                  {/* Loading Spinner or Checkmark */}
                  {!task.completed && index === loadingTasks.findIndex(t => !t.completed) && (
                    <div className="flex-shrink-0">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bermuda-500"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-bermuda-500 to-bermuda-600 transition-all duration-500 ease-out"
                  style={{ 
                    width: `${(loadingTasks.filter(t => t.completed).length / loadingTasks.length) * 100}%` 
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-bermuda-600 mt-2">
                {loadingTasks.filter(t => t.completed).length} of {loadingTasks.length} tasks completed
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-bermuda-700 to-bermuda-500 bg-clip-text text-transparent">
              Something went wrong
            </h2>
            <p className="text-bermuda-600 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="btn-primary px-6 py-3 text-white font-semibold rounded-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="p-8">
          {/* Header */}
          <StepHeader 
            stepNumber={3}
            title="Your Plan is Ready!"
            subtitle="AI has crafted your personalized roadmap with user stories, estimates, and schedules - ready to bring your requirements to life"
          />

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-bermuda-100 p-1 rounded-xl">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'stories', label: 'User Stories' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'csv', label: 'CSV Export' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'stories' | 'schedule' | 'csv')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-bermuda-500 text-white shadow-md'
                      : 'text-bermuda-600 hover:text-bermuda-800 hover:bg-bermuda-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bermuda-50 p-6 rounded-xl border border-bermuda-200">
                  <h3 className="text-lg font-semibold text-bermuda-900 mb-2">Total Story Points</h3>
                  <p className="text-3xl font-bold text-bermuda-600">{results.totalStoryPoints}</p>
                </div>
                <div className="bg-bermuda-50 p-6 rounded-xl border border-bermuda-200">
                  <h3 className="text-lg font-semibold text-bermuda-900 mb-2">User Stories</h3>
                  <p className="text-3xl font-bold text-bermuda-600">{results.userStories.length}</p>
                </div>
                <div className="bg-bermuda-50 p-6 rounded-xl border border-bermuda-200">
                  <h3 className="text-lg font-semibold text-bermuda-900 mb-2">Estimated Weeks</h3>
                  <p className="text-3xl font-bold text-bermuda-600">{results.estimatedWeeks}</p>
                </div>
              </div>
            )}

            {activeTab === 'stories' && (
              <div className="space-y-4">
                {results.userStories.map((story) => (
                  <div key={story.id} className="border-2 border-bermuda-200 rounded-xl p-4 hover:border-bermuda-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-bermuda-900">{story.title}</h3>
                      <span className="bg-bermuda-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        {story.storyPoints} pts
                      </span>
                    </div>
                    <p className="text-bermuda-700 mb-2">{story.description}</p>
                    <div className="flex justify-between text-sm text-bermuda-600">
                      <span>Assigned to: {story.assignee}</span>
                      <span>Week {story.week}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div>
                {/* Calendar Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-bermuda-900 mb-2">
                    {results.estimatedWeeks}-Week Project Timeline
                  </h3>
                  <p className="text-bermuda-600">
                    Visual roadmap of your project delivery schedule
                  </p>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: results.estimatedWeeks }, (_, weekIndex) => {
                    const weekNumber = weekIndex + 1;
                    const weekStories = results.userStories.filter(story => story.week === weekNumber);
                    const weekPoints = weekStories.reduce((sum, story) => sum + story.storyPoints, 0);
                    
                    // Calculate intensity color based on story points
                    const maxPoints = Math.max(...Array.from({ length: results.estimatedWeeks }, (_, i) => {
                      const stories = results.userStories.filter(s => s.week === i + 1);
                      return stories.reduce((sum, s) => sum + s.storyPoints, 0);
                    }));
                    const intensity = weekPoints / maxPoints;
                    
                    return (
                      <div 
                        key={weekNumber} 
                        className="bg-white rounded-xl border-2 border-bermuda-200 overflow-hidden hover:shadow-lg hover:border-bermuda-400 transition-all duration-300 group"
                      >
                        {/* Week Header */}
                        <div 
                          className="p-4 text-center relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, 
                              rgba(94, 234, 212, ${0.3 + intensity * 0.4}) 0%, 
                              rgba(56, 189, 248, ${0.3 + intensity * 0.4}) 100%)`
                          }}
                        >
                          <div className="text-xs font-semibold text-bermuda-700 uppercase tracking-wider mb-1">
                            Week
                          </div>
                          <div className="text-3xl font-bold text-bermuda-900 mb-1">
                            {weekNumber}
                          </div>
                          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-bermuda-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-bold text-bermuda-900">
                              {weekPoints} pts
                            </span>
                          </div>
                        </div>

                        {/* Stories List */}
                        <div className="p-4 space-y-2 bg-gradient-to-b from-white to-bermuda-50/30">
                          {weekStories.length > 0 ? (
                            weekStories.map((story) => (
                              <div 
                                key={story.id} 
                                className="bg-white border border-bermuda-200 rounded-lg p-3 hover:border-bermuda-400 hover:shadow-md transition-all group/story"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-sm text-bermuda-900 leading-tight flex-1 pr-2 group-hover/story:text-bermuda-600 transition-colors">
                                    {story.title}
                                  </h4>
                                  <span className="flex-shrink-0 bg-bermuda-100 text-bermuda-700 px-2 py-0.5 rounded text-xs font-bold">
                                    {story.storyPoints}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-bermuda-600">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  <span className="truncate">{story.assignee}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6 text-bermuda-400">
                              <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                              <p className="text-xs">No stories</p>
                            </div>
                          )}
                        </div>

                        {/* Week Stats Footer */}
                        <div className="px-4 py-2 bg-bermuda-50/50 border-t border-bermuda-100 text-center">
                          <span className="text-xs text-bermuda-600 font-medium">
                            {weekStories.length} {weekStories.length === 1 ? 'story' : 'stories'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-8 p-4 bg-bermuda-50 rounded-xl border border-bermuda-200">
                  <div className="flex items-center justify-center space-x-6 text-sm text-bermuda-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-bermuda-200 to-blue-200"></div>
                      <span>Light workload</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-bermuda-400 to-blue-400"></div>
                      <span>Heavy workload</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'csv' && (
              <div className="space-y-4">
                <div className="bg-bermuda-50 p-4 rounded-xl border border-bermuda-200">
                  <h3 className="text-lg font-semibold text-bermuda-900 mb-2">CSV Preview</h3>
                  <pre className="text-sm text-bermuda-700 whitespace-pre-wrap overflow-x-auto">
                    {results.csvData}
                  </pre>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={downloadCSV}
                    className="btn-primary px-6 py-3 text-white font-semibold rounded-xl"
                  >
                    📥 Download CSV
                  </button>
                  <button
                    onClick={sendToJira}
                    className="btn-secondary px-6 py-3 font-semibold rounded-xl"
                  >
                    🚀 Send to Jira
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
