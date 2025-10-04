export interface ProjectData {
  description: string;
  dailyHours: number;
  deliveryWeeks: number;
  teamMembers: string[];
}

export interface UserStory {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  assignee: string;
  week: number;
}

export interface ProjectResults {
  userStories: UserStory[];
  totalStoryPoints: number;
  estimatedWeeks: number;
  csvData: string;
}

export type AppStep = 'description' | 'details' | 'results';

// Form state interfaces
export interface ProjectDescriptionFormState {
  description: string;
}

export interface ProjectDetailsFormState {
  dailyHours: number;
  deliveryWeeks: number;
  teamMembers: string[];
  availableMembers: string[];
  isLoadingMembers: boolean;
}