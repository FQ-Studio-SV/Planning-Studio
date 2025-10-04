# Servicio de API de Google Gemini

Este directorio contiene la implementación centralizada para la integración con la API de Google Gemini 2.5 Flash, específicamente configurada para la lógica de negocio de Planning Studio.

## Archivos

- `geminiApi.ts` - Servicio principal de la API
- `../config/environment.ts` - Configuración de variables de entorno
- `../types/gemini.ts` - Definiciones de tipos TypeScript
- `../hooks/useGeminiApi.ts` - Hook de React para integración

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Key de Google Gemini (requerida)
VITE_GEMINI_API_KEY=tu_api_key_aqui

# Configuración opcional
VITE_GEMINI_MODEL=gemini-2.0-flash-exp
VITE_GEMINI_TEMPERATURE=0.7
```

### 2. Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key y agrégala a tu archivo `.env`

## Uso

### Uso Básico con el Servicio

```typescript
import { geminiApi } from '../services/geminiApi';

// Generar plan de proyecto
const context = {
  description: "Aplicación web de e-commerce con React y Node.js",
  timeFrame: "3 meses",
  teamSize: 4,
  complexity: "media" as const
};

const response = await geminiApi.generateProjectPlan(context);
console.log(response.text);
```

### Uso con React Hook

```typescript
import { useGeminiApi } from '../hooks/useGeminiApi';

function ProjectPlanner() {
  const {
    loading,
    lastResponse,
    generateProjectPlan,
    validateContext,
    clearError
  } = useGeminiApi();

  const handleGeneratePlan = async () => {
    try {
      const context = {
        description: "Mi proyecto...",
        timeFrame: "2 meses"
      };
      
      const response = await generateProjectPlan(context);
      console.log('Plan generado:', response.text);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {loading.isLoading && <p>Generando plan...</p>}
      {loading.error && <p>Error: {loading.error}</p>}
      {lastResponse && <pre>{lastResponse.text}</pre>}
      <button onClick={handleGeneratePlan}>Generar Plan</button>
    </div>
  );
}
```

## Funciones Disponibles

### Servicio Principal (`geminiApi`)

- `generateProjectPlan(context)` - Genera un plan completo del proyecto
- `analyzeFeasibility(description)` - Analiza la viabilidad técnica
- `generateTimeline(context)` - Genera cronograma detallado
- `suggestImprovements(description, currentPlan?)` - Sugiere mejoras
- `validateProjectContext(context)` - Valida el contexto del proyecto
- `parseProjectPlan(response)` - Parsea la respuesta en estructura de datos

### Hook de React (`useGeminiApi`)

- `loading` - Estado de carga con error y progreso
- `lastResponse` - Última respuesta de la API
- `validation` - Resultado de validación del contexto
- `clearError()` - Limpia errores
- `reset()` - Resetea todo el estado

## Reglas de Negocio

El servicio está configurado con reglas específicas para Planning Studio:

1. **Estimaciones Realistas**: Siempre incluye factores de contingencia (20-30%)
2. **Desglose por Fases**: Organiza proyectos en fases claras y tareas específicas
3. **Consideraciones Técnicas**: Incluye diseño, desarrollo, testing y deployment
4. **Roles del Equipo**: Sugiere roles específicos necesarios
5. **Análisis de Riesgos**: Identifica dependencias críticas y riesgos potenciales
6. **Formato Estructurado**: Respuestas en formato fácil de leer y procesar

## Tipos de Proyecto Soportados

- `web-app` - Aplicación web moderna
- `mobile-app` - Aplicación móvil
- `e-commerce` - Plataforma de comercio electrónico
- `api` - API REST o GraphQL
- `desktop` - Aplicación de escritorio
- `ai-ml` - Proyecto con IA/ML
- `data` - Análisis de datos
- `other` - Otros tipos

## Niveles de Complejidad

- `baja` - Proyecto simple, pocas integraciones (multiplicador: 1.0x)
- `media` - Proyecto moderado, algunas integraciones complejas (multiplicador: 1.5x)
- `alta` - Proyecto complejo, múltiples integraciones (multiplicador: 2.0x)

## Manejo de Errores

El servicio incluye manejo robusto de errores:

- Validación de API key
- Validación de contexto del proyecto
- Manejo de errores de red
- Retry automático (configurable)
- Mensajes de error descriptivos en español

## Ejemplos de Uso Avanzado

### Análisis de Viabilidad

```typescript
const feasibility = await geminiApi.analyzeFeasibility(
  "Aplicación de realidad aumentada para retail"
);
```

### Generación de Cronograma

```typescript
const timeline = await geminiApi.generateTimeline({
  description: "Sistema de gestión de inventario",
  deliveryDate: "2024-06-01",
  teamSize: 6,
  complexity: "alta"
});
```

### Sugerencias de Mejora

```typescript
const improvements = await geminiApi.suggestImprovements(
  "Mi proyecto actual",
  "Plan existente del proyecto"
);
```

## Consideraciones de Rendimiento

- **Rate Limiting**: El servicio respeta los límites de la API de Gemini
- **Caching**: Las respuestas se pueden cachear (implementación futura)
- **Timeout**: Configurable para evitar esperas largas
- **Abort Controller**: Soporte para cancelar operaciones en curso

## Seguridad

- API key almacenada en variables de entorno
- Validación de entrada en todas las funciones
- Sanitización de prompts para evitar inyección
- Configuración de safety settings de Gemini
