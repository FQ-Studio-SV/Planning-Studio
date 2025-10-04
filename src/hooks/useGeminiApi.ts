/**
 * Hook personalizado para integrar la API de Gemini con React
 * Proporciona estado de carga, manejo de errores y funciones de conveniencia
 */

import { useState, useCallback, useRef } from 'react';
import type { 
  ProjectContext, 
  GeminiResponse, 
  ApiLoadingState, 
  ValidationResult,
  ProjectPlan 
} from '../types/gemini';
import { geminiApi } from '../services/geminiApi';

interface UseGeminiApiReturn {
  // Estado
  loading: ApiLoadingState;
  lastResponse: GeminiResponse | null;
  validation: ValidationResult | null;
  
  // Funciones principales
  generateProjectPlan: (context: ProjectContext) => Promise<GeminiResponse>;
  analyzeFeasibility: (description: string) => Promise<GeminiResponse>;
  generateTimeline: (context: ProjectContext) => Promise<GeminiResponse>;
  suggestImprovements: (description: string, currentPlan?: string) => Promise<GeminiResponse>;
  
  // Funciones de utilidad
  validateContext: (context: ProjectContext) => ValidationResult;
  parseProjectPlan: (response: GeminiResponse) => Partial<ProjectPlan>;
  clearError: () => void;
  reset: () => void;
}

export const useGeminiApi = (): UseGeminiApiReturn => {
  const [loading, setLoading] = useState<ApiLoadingState>({
    isLoading: false,
    error: null,
    progress: undefined
  });
  
  const [lastResponse, setLastResponse] = useState<GeminiResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para manejar el estado de carga
  const handleLoading = useCallback((isLoading: boolean, error: string | null = null, progress?: number) => {
    setLoading({ isLoading, error, progress });
  }, []);

  // Función para validar contexto
  const validateContext = useCallback((context: ProjectContext): ValidationResult => {
    const result = geminiApi.validateProjectContext(context);
    setValidation(result);
    return result;
  }, []);

  // Función para parsear plan de proyecto
  const parseProjectPlan = useCallback((response: GeminiResponse): Partial<ProjectPlan> => {
    return geminiApi.parseProjectPlan(response);
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setLoading(prev => ({ ...prev, error: null }));
  }, []);

  // Función para resetear estado
  const reset = useCallback(() => {
    setLoading({ isLoading: false, error: null, progress: undefined });
    setLastResponse(null);
    setValidation(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Función wrapper para llamadas a la API con manejo de estado
  const apiCall = useCallback(async <T>(
    apiFunction: () => Promise<T>,
    operation: string
  ): Promise<T> => {
    // Cancelar operación anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      handleLoading(true, null, 0);
      
      const result = await apiFunction();
      
      handleLoading(false, null, 100);
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      handleLoading(false, errorMessage);
      throw error;
    } finally {
      abortControllerRef.current = null;
    }
  }, [handleLoading]);

  // Generar plan de proyecto
  const generateProjectPlan = useCallback(async (context: ProjectContext): Promise<GeminiResponse> => {
    // Validar contexto antes de hacer la llamada
    const validationResult = validateContext(context);
    if (!validationResult.isValid) {
      throw new Error(`Contexto inválido: ${validationResult.errors.join(', ')}`);
    }

    return apiCall(async () => {
      const response = await geminiApi.generateProjectPlan(context);
      setLastResponse(response);
      return response;
    }, 'Generar plan de proyecto');
  }, [apiCall, validateContext]);

  // Analizar viabilidad
  const analyzeFeasibility = useCallback(async (description: string): Promise<GeminiResponse> => {
    if (!description.trim()) {
      throw new Error('La descripción del proyecto es requerida');
    }

    return apiCall(async () => {
      const response = await geminiApi.analyzeFeasibility(description);
      setLastResponse(response);
      return response;
    }, 'Analizar viabilidad');
  }, [apiCall]);

  // Generar cronograma
  const generateTimeline = useCallback(async (context: ProjectContext): Promise<GeminiResponse> => {
    const validationResult = validateContext(context);
    if (!validationResult.isValid) {
      throw new Error(`Contexto inválido: ${validationResult.errors.join(', ')}`);
    }

    return apiCall(async () => {
      const response = await geminiApi.generateTimeline(context);
      setLastResponse(response);
      return response;
    }, 'Generar cronograma');
  }, [apiCall, validateContext]);

  // Sugerir mejoras
  const suggestImprovements = useCallback(async (
    description: string, 
    currentPlan?: string
  ): Promise<GeminiResponse> => {
    if (!description.trim()) {
      throw new Error('La descripción del proyecto es requerida');
    }

    return apiCall(async () => {
      const response = await geminiApi.suggestImprovements(description, currentPlan);
      setLastResponse(response);
      return response;
    }, 'Sugerir mejoras');
  }, [apiCall]);

  return {
    // Estado
    loading,
    lastResponse,
    validation,
    
    // Funciones principales
    generateProjectPlan,
    analyzeFeasibility,
    generateTimeline,
    suggestImprovements,
    
    // Funciones de utilidad
    validateContext,
    parseProjectPlan,
    clearError,
    reset
  };
};

export default useGeminiApi;

