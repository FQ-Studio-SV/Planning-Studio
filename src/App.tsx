import { useAppStore } from './store/app-store';
import { ProjectDescription } from './components/project-description';
import { ProjectDetails } from './components/project-details';
import { ResultsVisualization } from './components/results-visualization';

function App() {
  const { currentStep } = useAppStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'description':
        return <ProjectDescription />;
      case 'details':
        return <ProjectDetails />;
      case 'results':
        return <ResultsVisualization />;
      default:
        return <ProjectDescription />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* White Sphere Grid Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(18,115,101,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(18,115,101,0.05) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(24,180,152,0.05) 0%, rgba(103,231,202,0.05) 100%, transparent 80%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10">
        {renderCurrentStep()}
      </div>
    </div>
  );
}

export default App;
