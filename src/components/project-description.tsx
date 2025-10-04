import { useState } from 'react';
import { useAppStore } from '../store/app-store';
import { type ProjectDescriptionFormState } from '../types';

export function ProjectDescription() {
  const { setDescription } = useAppStore();
  const [formState, setFormState] = useState<ProjectDescriptionFormState>({
    description: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.description.trim()) {
      setDescription(formState.description.trim());
    }
  };

  const handleInputChange = (value: string) => {
    setFormState(prev => ({
      ...prev,
      description: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-br from-bermuda-500 via-bermuda-600 to-bermuda-700 bg-clip-text text-transparent p-4">
            Planning Studio
          </h1>
          <p className="text-xl text-bermuda-600 font-semibold max-w-2xl mx-auto">
            Tell us about your project requirements and watch them transform into actionable plans
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="text-md font-medium text-bermuda-900">
                Project Description
              </label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-bermuda-50 text-bermuda-900 text-sm font-semibold rounded-lg border-2 border-bermuda-400 hover:border-bermuda-500 transition-all"
              >
                <span>📝</span>
                <span>How to write a good description?</span>
              </button>
            </div>
            
            <textarea
              id="description"
              value={formState.description}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Describe your project in detail..."
              className="input-field w-full h-64 p-4 rounded-xl resize-none text-bermuda-900 placeholder-bermuda-400/60 bg-bermuda-50 border-1 border-bermuda-400/75"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formState.description.trim()}
              className="btn-primary px-8 py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Continue →
            </button>
          </div>
        </form>
        
        {/* Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-bermuda-500 to-bermuda-600 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>📝</span>
                  <span>Recommended Description Structure</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="px-6 py-6 space-y-5">
                <p className="text-bermuda-700 text-sm bg-bermuda-50 px-4 py-3 rounded-lg border border-bermuda-200">
                  Follow this structure to help us better understand your project requirements and generate more accurate plans.
                </p>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>📋</span>
                    <span>PROJECT OVERVIEW</span>
                  </h4>
                  <p className="text-bermuda-700 pl-7">What problem does this solve? What's the project's purpose?</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>🎯</span>
                    <span>GOALS & OBJECTIVES</span>
                  </h4>
                  <p className="text-bermuda-700 pl-7">What specific outcomes do you want to achieve?</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>✨</span>
                    <span>KEY FEATURES</span>
                  </h4>
                  <p className="text-bermuda-700 pl-7">What are the main functionalities? (e.g., user authentication, data visualization, payment processing)</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>👥</span>
                    <span>TARGET USERS</span>
                  </h4>
                  <p className="text-bermuda-700 pl-7">Who will use this? What are their needs and pain points?</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>🛠️</span>
                    <span>TECHNICAL REQUIREMENTS</span>
                  </h4>
                  <ul className="list-disc list-inside text-bermuda-700 pl-7 space-y-1">
                    <li>Technology stack preferences (React, Python, etc.)</li>
                    <li>Integrations needed (APIs, databases, third-party services)</li>
                    <li>Performance or scalability requirements</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>⚠️</span>
                    <span>CONSTRAINTS & CONSIDERATIONS</span>
                  </h4>
                  <ul className="list-disc list-inside text-bermuda-700 pl-7 space-y-1">
                    <li>Timeline or budget limitations</li>
                    <li>Compliance requirements (GDPR, accessibility, etc.)</li>
                    <li>Known challenges or dependencies</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold text-bermuda-900 mb-2 text-lg flex items-center gap-2">
                    <span>💡</span>
                    <span>ADDITIONAL CONTEXT</span>
                  </h4>
                  <p className="text-bermuda-700 pl-7">Any existing systems, reference projects, or specific implementation preferences?</p>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-bermuda-50 px-6 py-4 flex justify-end rounded-b-2xl border-t border-bermuda-200">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-bermuda-600 text-white font-semibold rounded-lg hover:bg-bermuda-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
