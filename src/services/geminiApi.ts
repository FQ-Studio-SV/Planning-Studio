/**
 * Servicio centralizado para la API de Google Gemini 2.5 Flash
 * Configurado específicamente para la lógica de negocio de Planning Studio
 * Utiliza el SDK oficial de @google/genai
 */

import { GoogleGenAI } from '@google/genai';

import type {
	GeminiResponse,
	ProjectContext,
	ProjectPlan,
	ProjectPhase,
	ProjectTimeline,
	ProjectRisk,
	ApiLoadingState,
	ValidationResult,
} from "../types/gemini";
import { getGeminiConfig } from "../config/environment";

// Obtener configuración desde el archivo de entorno
const getDefaultConfig = () => {
	return getGeminiConfig();
};

// Reglas de negocio por defecto para Planning Studio
const BUSINESS_RULES = {
	systemPrompt: `Eres un experto consultor en planificación de proyectos de software. 
Tu especialidad es analizar descripciones de proyectos y generar planes detallados, estimaciones de tiempo, 
recursos necesarios y cronogramas realistas.

REGLAS DE NEGOCIO:
1. Siempre proporciona estimaciones realistas y conservadoras
2. Considera factores de riesgo y contingencia (20-30% adicional)
3. Desglosa el proyecto en fases claras y tareas específicas
4. Incluye consideraciones técnicas, de diseño y de testing
5. Sugiere roles específicos del equipo necesarios
7. Identifica dependencias críticas y riesgos potenciales
8. Usa un formato estructurado y fácil de leer
9. Considera al equipo de trabajo y el horario de trabajo del equipo

FORMATO DE RESPUESTA:
- Resumen ejecutivo
- Fases del proyecto con duración estimada
- Tareas detalladas por fase
- Cronograma sugerido
- Riesgos identificados y mitigaciones`,

	projectTypes:
		"Identifica el tipo de proyecto que se esta planificando y usalo como base importante para gestionar las tareas",

	complexityFactors: {
		baja: {
			multiplier: 1.0,
			description: "Proyecto simple, pocas integraciones",
		},
		media: {
			multiplier: 1.5,
			description: "Proyecto moderado, algunas integraciones complejas",
		},
		alta: {
			multiplier: 2.0,
			description:
				"Proyecto complejo, múltiples integraciones y desafíos técnicos",
		},
	},
};

class GeminiApiService {
	private config: ReturnType<typeof getGeminiConfig>;
	private genAI!: GoogleGenAI;

	constructor(config?: Partial<ReturnType<typeof getGeminiConfig>>) {
		this.config = { ...getDefaultConfig(), ...config };
		this.validateConfig();
		this.initializeGemini();
	}

	private validateConfig(): void {
		if (!this.config.apiKey) {
			throw new Error(
				"VITE_GEMINI_API_KEY no está configurada en las variables de entorno"
			);
		}
	}

	private initializeGemini(): void {
		this.genAI = new GoogleGenAI({ apiKey: this.config.apiKey });
	}

	/**
	 * Genera un plan de proyecto basado en la descripción y contexto
	 */
	async generateProjectPlan(context: ProjectContext): Promise<GeminiResponse> {
		const prompt = this.buildProjectPrompt(context);
		return this.callGeminiAPI(prompt);
	}

	/**
	 * Analiza la viabilidad técnica de un proyecto
	 */
	async analyzeFeasibility(description: string): Promise<GeminiResponse> {
		const prompt = `${BUSINESS_RULES.systemPrompt}

    ANÁLISIS DE VIABILIDAD TÉCNICA:
    Analiza la siguiente descripción de proyecto y evalúa:
    1. Viabilidad técnica general
    2. Tecnologías recomendadas
    3. Desafíos técnicos identificados
    4. Estimación de complejidad (baja/media/alta)
    5. Tiempo mínimo estimado
    6. Recursos técnicos necesarios

    DESCRIPCIÓN DEL PROYECTO:
    ${description}`;

		return this.callGeminiAPI(prompt);
	}

	/**
	 * Genera un cronograma detallado para un proyecto
	 */
	async generateTimeline(context: ProjectContext): Promise<GeminiResponse> {
		const prompt = `${BUSINESS_RULES.systemPrompt}

GENERACIÓN DE CRONOGRAMA DETALLADO:
Basándote en la siguiente información del proyecto, genera un cronograma detallado:

DESCRIPCIÓN: ${context.description}
TIEMPO DISPONIBLE: ${context.timeFrame || "No especificado"}
FECHA DE ENTREGA: ${context.deliveryDate || "No especificada"}
TAMAÑO DEL EQUIPO: ${context.teamSize || "No especificado"}
PRESUPUESTO: ${context.budget || "No especificado"}
COMPLEJIDAD: ${context.complexity || "media"}

Incluye:
- Fases principales con fechas específicas
- Hitos importantes
- Tareas paralelas y dependencias
- Buffer de tiempo para imprevistos
- Revisión y testing`;

		return this.callGeminiAPI(prompt);
	}

	/**
	 * Sugiere mejoras o optimizaciones para un proyecto
	 */
	async suggestImprovements(
		description: string,
		currentPlan?: string
	): Promise<GeminiResponse> {
		const prompt = `${BUSINESS_RULES.systemPrompt}

SUGERENCIAS DE MEJORA:
Analiza el siguiente proyecto y su plan actual (si se proporciona) y sugiere mejoras:

PROYECTO: ${description}
PLAN ACTUAL: ${currentPlan || "No proporcionado"}

Sugiere:
1. Optimizaciones técnicas
2. Mejoras en la arquitectura
3. Reducción de costos
4. Aceleración del desarrollo
5. Mejores prácticas
6. Herramientas recomendadas`;

		return this.callGeminiAPI(prompt);
	}

	/**
	 * Construye el prompt específico para planificación de proyectos
	 */
	private buildProjectPrompt(context: ProjectContext): string {
		const complexityInfo = context.complexity
			? BUSINESS_RULES.complexityFactors[context.complexity]
			: BUSINESS_RULES.complexityFactors.media;

		return `${BUSINESS_RULES.systemPrompt}

INFORMACIÓN DEL PROYECTO:
Descripción: ${context.description}
Tiempo disponible: ${context.timeFrame || "Flexible"}
Fecha de entrega: ${context.deliveryDate || "No especificada"}
Tamaño del equipo: ${context.teamSize || "Por determinar"}
Presupuesto: ${context.budget || "Por determinar"}
Complejidad estimada: ${context.complexity || "media"} (${
			complexityInfo.description
		})

Multiplicador de complejidad: ${complexityInfo.multiplier}x

Genera un plan detallado considerando estos factores específicos.`;
	}

	/**
	 * Realiza la llamada a la API de Gemini usando el SDK oficial
	 */
	private async callGeminiAPI(prompt: string): Promise<GeminiResponse> {
		try {
			const response = await this.genAI.models.generateContent({
				model: this.config.model,
				contents: [
					{
						parts: [{ text: prompt }],
						role: "user"
					}
				]
			});
			
			if (!response) {
				throw new Error("No se generó contenido válido");
			}

			const text = response.text;
			
			if (!text) {
				throw new Error("La respuesta está vacía");
			}

			// Obtener metadatos de uso si están disponibles
			const usageMetadata = response.usageMetadata;

			return {
				text,
				usage: usageMetadata ? {
					promptTokens: usageMetadata.promptTokenCount || 0,
					candidatesTokens: usageMetadata.candidatesTokenCount || 0,
					totalTokens: usageMetadata.totalTokenCount || 0,
				} : undefined,
				finishReason: 'STOP',
			};
		} catch (error) {
			console.error("Error en la llamada a Gemini API:", error);
			
			// Manejo específico de errores del SDK
			if (error instanceof Error) {
				if (error.message.includes('API_KEY_INVALID')) {
					throw new Error("Clave de API inválida. Verifica VITE_GEMINI_API_KEY");
				}
				if (error.message.includes('QUOTA_EXCEEDED')) {
					throw new Error("Cuota de API excedida. Intenta más tarde");
				}
				if (error.message.includes('SAFETY')) {
					throw new Error("El contenido fue bloqueado por filtros de seguridad");
				}
			}
			
			throw new Error(
				`Error al comunicarse con Gemini: ${
					error instanceof Error ? error.message : "Error desconocido"
				}`
			);
		}
	}

	/**
	 * Actualiza la configuración de la API
	 */
	updateConfig(newConfig: Partial<ReturnType<typeof getGeminiConfig>>): void {
		this.config = { ...this.config, ...newConfig };
		this.validateConfig();
		// No necesitamos reinicializar ya que el modelo se crea en cada llamada
	}

	/**
	 * Obtiene la configuración actual
	 */
	getConfig() {
		return { ...this.config };
	}

	/**
	 * Valida el contexto del proyecto
	 */
	validateProjectContext(context: ProjectContext): ValidationResult {
		const errors: string[] = [];
		const warnings: string[] = [];

		if (!context.description || context.description.trim().length < 10) {
			errors.push(
				"La descripción del proyecto debe tener al menos 10 caracteres"
			);
		}

		if (context.description && context.description.length > 5000) {
			warnings.push(
				"La descripción es muy larga, considera resumirla para mejores resultados"
			);
		}

		if (context.teamSize && (context.teamSize < 1 || context.teamSize > 50)) {
			warnings.push("El tamaño del equipo parece poco realista");
		}

		if (
			context.complexity &&
			!["baja", "media", "alta"].includes(context.complexity)
		) {
			errors.push("La complejidad debe ser: baja, media o alta");
		}

		return {
			isValid: errors.length === 0,
			errors,
			warnings,
		};
	}

	/**
	 * Obtiene el estado de carga de la API
	 */
	getLoadingState(): ApiLoadingState {
		return {
			isLoading: false, // Esto se manejaría con un estado global
			error: null,
			progress: undefined,
		};
	}

	/**
	 * Procesa la respuesta de la API para extraer información estructurada
	 */
	parseProjectPlan(response: GeminiResponse): Partial<ProjectPlan> {
		const text = response.text;

		// Extraer fases del proyecto (implementación básica)
		const phases = this.extractPhases(text);
		const timeline = this.extractTimeline();
		const risks = this.extractRisks(text);

		return {
			summary: this.extractSummary(text),
			phases,
			timeline,
			risks,
			recommendations: this.extractRecommendations(text),
		};
	}

	private extractSummary(text: string): string {
		const lines = text.split("\n");
		const summaryIndex = lines.findIndex(
			(line) =>
				line.toLowerCase().includes("resumen") ||
				line.toLowerCase().includes("summary")
		);

		if (summaryIndex !== -1) {
			return lines[summaryIndex + 1] || "";
		}

		return lines.slice(0, 3).join(" ");
	}

	private extractPhases(text: string): ProjectPhase[] {
		// Implementación básica para extraer fases
		// En una implementación real, usarías regex más sofisticado
		const phaseMatches = text.match(/Fase \d+[:]\s*([^\n]+)/gi);
		return phaseMatches
			? phaseMatches.map((phase) => ({
					name: phase,
					description: "",
					duration: "",
					tasks: [],
					dependencies: [],
					deliverables: [],
			  }))
			: [];
	}

	private extractTimeline(): ProjectTimeline {
		// Implementación básica para extraer cronograma
		return {
			totalDuration: "",
			milestones: [],
			criticalPath: [],
		};
	}

	private extractRisks(text: string): ProjectRisk[] {
		// Implementación básica para extraer riesgos
		const riskMatches = text.match(/Riesgo[:]\s*([^\n]+)/gi);
		return riskMatches
			? riskMatches.map((risk) => ({
					name: risk,
					description: "",
					probability: "media" as const,
					impact: "medio" as const,
					mitigation: "",
					contingency: "",
			  }))
			: [];
	}

	private extractRecommendations(text: string): string[] {
		// Implementación básica para extraer recomendaciones
		const recMatches = text.match(/Recomendación[:]\s*([^\n]+)/gi);
		return recMatches || [];
	}
}

// Instancia singleton para uso en toda la aplicación
export const geminiApi = new GeminiApiService();

// Funciones de conveniencia para uso directo
export const generateProjectPlan = (context: ProjectContext) =>
	geminiApi.generateProjectPlan(context);
export const analyzeFeasibility = (description: string) =>
	geminiApi.analyzeFeasibility(description);
export const generateTimeline = (context: ProjectContext) =>
	geminiApi.generateTimeline(context);
export const suggestImprovements = (
	description: string,
	currentPlan?: string
) => geminiApi.suggestImprovements(description, currentPlan);

export default geminiApi;
