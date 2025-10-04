/**
 * Configuración para Google Generative AI SDK
 */

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
}

// Configuración por defecto optimizada para Planning Studio
const defaultConfig: GeminiConfig = {
  apiKey: '',
  model: 'gemini-2.0-flash',
  temperature: 0.0,
};

// Cargar configuración desde variables de entorno
const loadGeminiConfig = (): GeminiConfig => {
  const config = { ...defaultConfig };

  // API Key (requerida)
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    config.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  }

  // Modelo (opcional)
  if (import.meta.env.VITE_GEMINI_MODEL) {
    config.model = import.meta.env.VITE_GEMINI_MODEL;
  }

  // Temperatura (opcional)
  if (import.meta.env.VITE_GEMINI_TEMPERATURE) {
    const temp = parseFloat(import.meta.env.VITE_GEMINI_TEMPERATURE);
    if (!isNaN(temp) && temp >= 0 && temp <= 1) {
      config.temperature = temp;
    }
  }

  return config;
};

// Instancia de configuración
export const geminiConfig = loadGeminiConfig();

// Validar configuración crítica
export const validateGeminiConfig = (): void => {
  if (!geminiConfig.apiKey) {
    console.warn('⚠️ VITE_GEMINI_API_KEY no está configurada. La funcionalidad de IA no estará disponible.');
  }
};

// Función para obtener la configuración de Gemini
export const getGeminiConfig = () => geminiConfig;

export default geminiConfig;
