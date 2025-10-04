# Configuración de Variables de Entorno

## Variables Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Key de Google Gemini (REQUERIDA)
VITE_GEMINI_API_KEY=tu_api_key_aqui

# Configuración opcional
VITE_GEMINI_MODEL=gemini-2.0-flash-exp
VITE_GEMINI_TEMPERATURE=0.7
```

## Obtener API Key

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key y agrégala a tu archivo `.env`

## Variables Disponibles

- `VITE_GEMINI_API_KEY` - Tu API key de Google Gemini (requerida)
- `VITE_GEMINI_MODEL` - Modelo a usar (por defecto: gemini-2.0-flash-exp)
- `VITE_GEMINI_TEMPERATURE` - Temperatura para la generación (0.0-1.0, por defecto: 0.7)

## Uso

```typescript
import { getGeminiConfig } from '../config/environment';

const config = getGeminiConfig();
console.log(config.apiKey); // Tu API key
console.log(config.model); // Modelo configurado
console.log(config.temperature); // Temperatura configurada
```

