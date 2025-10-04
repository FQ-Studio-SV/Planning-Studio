import { create } from 'zustand';
import { type AppStep, type ProjectData } from '../types';

interface AppState {
  // Current step in the flow
  currentStep: AppStep;
  
  // Project data collected through the steps
  projectData: Partial<ProjectData>;
  
  // Navigation actions
  setCurrentStep: (step: AppStep) => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  resetApp: () => void;
  
  // Step-specific actions
  setDescription: (description: string) => void;
  setProjectDetails: (details: Omit<ProjectData, 'description'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentStep: 'description',
  projectData: {},
  
  // Navigation actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateProjectData: (data) => set((state) => ({
    projectData: { ...state.projectData, ...data }
  })),
  
  resetApp: () => set({
    currentStep: 'description',
    projectData: {}
  }),
  
  // Step-specific actions
  setDescription: (description) => set((state) => ({
    projectData: { ...state.projectData, description },
    currentStep: 'details'
  })),
  
  setProjectDetails: (details) => set((state) => ({
    projectData: { ...state.projectData, ...details },
    currentStep: 'results'
  }))
}));
