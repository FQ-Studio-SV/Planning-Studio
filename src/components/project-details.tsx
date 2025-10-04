import { useState, useEffect } from 'react';
import { useAppStore } from '../store/app-store';
import { type ProjectDetailsFormState } from '../types';
import { StepHeader } from './step-header';

export function ProjectDetails() {
  const { projectData, setProjectDetails, setCurrentStep } = useAppStore();
  const [formState, setFormState] = useState<ProjectDetailsFormState>({
    dailyHours: 8,
    deliveryWeeks: 4,
    teamMembers: [],
    availableMembers: [],
    isLoadingMembers: false
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Mock Jira team members fetch (replace with actual API call)
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setFormState(prev => ({ ...prev, isLoadingMembers: true }));
      // Simulate API call
      setTimeout(() => {
        setFormState(prev => ({
          ...prev,
          availableMembers: [
            'John Doe',
            'Jane Smith',
            'Mike Johnson',
            'Sarah Wilson',
            'Alex Brown'
          ],
          isLoadingMembers: false
        }));
      }, 1000);
    };

    fetchTeamMembers();
  }, []);

  const handleMemberToggle = (member: string) => {
    setFormState(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(member) 
        ? prev.teamMembers.filter(m => m !== member)
        : [...prev.teamMembers, member]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.teamMembers.length > 0) {
      setProjectDetails({
        dailyHours: formState.dailyHours,
        deliveryWeeks: formState.deliveryWeeks,
        teamMembers: formState.teamMembers
      });
    }
  };

  const handleInputChange = (field: keyof ProjectDetailsFormState, value: ProjectDetailsFormState[keyof ProjectDetailsFormState]) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    setCurrentStep('description');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <StepHeader 
          stepNumber={2}
          title="Set Your Foundation"
          subtitle="Define your timeline, team, and resources to build the perfect project roadmap"
        />

        {/* Project Description Preview */}
        <div className="mb-8 p-4 bg-bermuda-50 rounded-xl border border-bermuda-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-bermuda-900 mb-2">Project Description:</h3>
              <p className={`text-bermuda-700 text-sm whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                {projectData.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="flex-shrink-0 p-1 text-bermuda-600 hover:text-bermuda-800 hover:bg-bermuda-100 rounded transition-all"
              aria-label={isDescriptionExpanded ? 'Collapse description' : 'Expand description'}
            >
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isDescriptionExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Daily Hours */}
          <div>
            <label htmlFor="dailyHours" className="block text-sm font-medium text-bermuda-900 mb-2">
              Daily Available Working Hours
            </label>
            <input
              type="number"
              id="dailyHours"
              value={formState.dailyHours}
              onChange={(e) => handleInputChange('dailyHours', Number(e.target.value))}
              min="1"
              max="24"
              className="input-field w-full p-3 rounded-xl text-bermuda-900"
              required
            />
          </div>

          {/* Delivery Weeks */}
          <div>
            <label htmlFor="deliveryWeeks" className="block text-sm font-medium text-bermuda-900 mb-2">
              Estimated Delivery Time (weeks)
            </label>
            <input
              type="number"
              id="deliveryWeeks"
              value={formState.deliveryWeeks}
              onChange={(e) => handleInputChange('deliveryWeeks', Number(e.target.value))}
              min="1"
              max="52"
              className="input-field w-full p-3 rounded-xl text-bermuda-900"
              required
            />
          </div>

          {/* Team Members */}
          <div>
            <label htmlFor="team-members" className="block text-sm font-medium text-bermuda-900 mb-2">
              Team Members
            </label>
            {formState.isLoadingMembers ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bermuda-500"></div>
                <span className="ml-2 text-bermuda-600">Loading team members from Jira...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formState.availableMembers.map((member) => (
                  <label
                    key={member}
                    className="flex items-center p-3 border-2 border-bermuda-200 rounded-xl cursor-pointer hover:border-bermuda-300 hover:bg-bermuda-50 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formState.teamMembers.includes(member)}
                      onChange={() => handleMemberToggle(member)}
                      className="mr-3 h-4 w-4 text-bermuda-500 focus:ring-bermuda-500 border-bermuda-300 rounded"
                    />
                    <span className="text-bermuda-900 font-medium">{member}</span>
                  </label>
                ))}
              </div>
            )}
            {formState.teamMembers.length > 0 && (
              <p className="text-sm text-bermuda-600 mt-2">
                {formState.teamMembers.length} team member{formState.teamMembers.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary px-6 py-3 font-semibold rounded-xl"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={formState.teamMembers.length === 0}
              className="btn-primary px-8 py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Generate Plan →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
