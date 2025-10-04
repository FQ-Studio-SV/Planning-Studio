/**
 * Tipos TypeScript para la integración con Google Gemini API
 * Centraliza todas las definiciones de tipos relacionadas con IA
 */

// Configuración de la API (simplificada)
export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
}

// Respuesta de la API
export interface GeminiResponse {
  text: string;
  usage?: {
    promptTokens: number;
    candidatesTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  error?: string;
}

// Contexto del proyecto para planificación
export interface ProjectContext {
  description: string;
  timeFrame?: string;
  deliveryDate?: string;
  teamSize?: number;
  budget?: string;
  complexity?: ProjectComplexity;
  projectType?: ProjectType;
  technologies?: string[];
  requirements?: string[];
}

// Tipos de complejidad del proyecto
export type ProjectComplexity = 'baja' | 'media' | 'alta';

// Tipos de proyecto
export type ProjectType = 
  | 'web-app'
  | 'mobile-app'
  | 'e-commerce'
  | 'api'
  | 'desktop'
  | 'ai-ml'
  | 'data'
  | 'other';

// Resultado del análisis de viabilidad
export interface FeasibilityAnalysis {
  isFeasible: boolean;
  complexity: ProjectComplexity;
  estimatedDuration: string;
  recommendedTechnologies: string[];
  technicalChallenges: string[];
  riskLevel: 'bajo' | 'medio' | 'alto';
  confidence: number; // 0-100
}

// Plan de proyecto generado
export interface ProjectPlan {
  summary: string;
  phases: ProjectPhase[];
  timeline: ProjectTimeline;
  resources: ProjectResources;
  risks: ProjectRisk[];
  recommendations: string[];
}

// Fase del proyecto
export interface ProjectPhase {
  name: string;
  description: string;
  duration: string;
  tasks: ProjectTask[];
  dependencies: string[];
  deliverables: string[];
}

// Tarea del proyecto
export interface ProjectTask {
  name: string;
  description: string;
  estimatedHours: number;
  assignedRole: string;
  priority: 'alta' | 'media' | 'baja';
  dependencies: string[];
}

// Cronograma del proyecto
export interface ProjectTimeline {
  totalDuration: string;
  startDate?: string;
  endDate?: string;
  milestones: ProjectMilestone[];
  criticalPath: string[];
}

// Hito del proyecto
export interface ProjectMilestone {
  name: string;
  date: string;
  description: string;
  deliverables: string[];
}

// Recursos del proyecto
export interface ProjectResources {
  team: TeamMember[];
  budget: BudgetEstimate;
  tools: string[];
  infrastructure: string[];
}

// Miembro del equipo
export interface TeamMember {
  role: string;
  description: string;
  estimatedHours: number;
  skills: string[];
  availability: 'full-time' | 'part-time' | 'contract';
}

// Estimación de presupuesto
export interface BudgetEstimate {
  total: number;
  breakdown: {
    development: number;
    design: number;
    testing: number;
    infrastructure: number;
    contingency: number;
  };
  currency: string;
  confidence: 'baja' | 'media' | 'alta';
}

// Riesgo del proyecto
export interface ProjectRisk {
  name: string;
  description: string;
  probability: 'baja' | 'media' | 'alta';
  impact: 'bajo' | 'medio' | 'alto';
  mitigation: string;
  contingency: string;
}

// Configuración de reglas de negocio
export interface BusinessRules {
  systemPrompt: string;
  projectTypes: Record<ProjectType, string>;
  complexityFactors: Record<ProjectComplexity, {
    multiplier: number;
    description: string;
  }>;
  defaultEstimates: {
    development: number; // horas por punto de complejidad
    testing: number; // porcentaje del tiempo de desarrollo
    design: number; // porcentaje del tiempo de desarrollo
  };
}

// Estado de carga de la API
export interface ApiLoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

// Configuración de la solicitud a la API
export interface ApiRequest {
  prompt: string;
  context?: ProjectContext;
  options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  };
}

// Resultado de la validación
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Configuración de exportación
export interface ExportConfig {
  format: 'csv' | 'json' | 'pdf' | 'txt';
  includeTimeline: boolean;
  includeResources: boolean;
  includeRisks: boolean;
  language: 'es' | 'en';
}

// Historial de consultas
export interface QueryHistory {
  id: string;
  timestamp: Date;
  query: string;
  response: GeminiResponse;
  context: ProjectContext;
  type: 'plan' | 'feasibility' | 'timeline' | 'improvements';
}

// Configuración de la aplicación
export interface AppConfig {
  gemini: GeminiConfig;
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  features: {
    enableExport: boolean;
    enableHistory: boolean;
    enableValidation: boolean;
    maxHistoryItems: number;
  };
}
