# 🚀 Planning Studio

Una aplicación web moderna para la planificación y gestión de proyectos utilizando inteligencia artificial (Google Gemini) e integración con Jira.

## ✨ Características

- **🤖 IA-Powered Planning**: Generación automática de planes de proyecto usando Google Gemini 2.0 Flash
- **📊 Análisis de Viabilidad**: Evaluación técnica de proyectos con recomendaciones
- **⏰ Cronogramas Inteligentes**: Generación automática de timelines basados en complejidad y equipo
- **🔗 Integración Jira**: Conexión directa con Jira para crear issues y gestionar proyectos
- **📈 Exportación CSV**: Exportación de datos de proyectos en formato CSV
- **🎨 UI Moderna**: Interfaz construida con React 19, TypeScript y Tailwind CSS
- **⚡ Desarrollo Rápido**: Configurado con Vite para desarrollo ágil

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **IA**: Google Gemini 2.0 Flash API
- **Gestión de Estado**: Zustand
- **Integración**: Jira REST API
- **Linting**: ESLint

## 📋 Prerrequisitos

- **Node.js**: v18.0.0 o superior
- **pnpm**: Gestor de paquetes (recomendado) o npm
- **Cuenta Google**: Para obtener API key de Gemini
- **Cuenta Jira**: Para integración (opcional)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Planning-Studio
```

### 2. Instalar Dependencias

```bash
# Usando pnpm (recomendado)
pnpm install

# O usando npm
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cp env.example .env.local
```

Edita el archivo `.env.local` con tus credenciales:

```env
# Configuración de Google Gemini API (REQUERIDA)
VITE_GEMINI_API_KEY=tu_api_key_de_gemini_aqui

# Configuración opcional de Gemini
VITE_GEMINI_MODEL=gemini-2.0-flash
VITE_GEMINI_TEMPERATURE=0.0

# Configuración de Jira (OPCIONAL)
VITE_JIRA_BASE_URL=https://tuempresa.atlassian.net
VITE_JIRA_EMAIL=tu.email@empresa.com
VITE_JIRA_API_KEY=tu_api_token_de_jira_aqui
```

### 4. Obtener API Keys

#### Google Gemini API Key
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta Google
3. Haz clic en "Create API Key"
4. Copia la key generada y agrégala a tu `.env.local`

#### Jira API Token (Opcional)
1. Ve a [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Haz clic en "Create API token"
3. Dale un nombre descriptivo al token
4. Copia el token y agrégalo a tu `.env.local`

### 5. Ejecutar la Aplicación

```bash
# Modo desarrollo
pnpm dev

# O usando npm
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🎯 Uso

### Panel Principal

La aplicación incluye varios paneles de prueba para verificar la funcionalidad:

1. **🧪 Panel de Pruebas Gemini**: Verifica la integración con la API de Google Gemini
2. **🔗 Panel de Pruebas Jira**: Verifica la conectividad con Jira
3. **📊 Panel de Exportación CSV**: Prueba la funcionalidad de exportación

### Funcionalidades Principales

#### Generación de Planes de Proyecto
```typescript
// Ejemplo de uso programático
import { useGeminiApi } from './src/hooks/useGeminiApi';

const { generateProjectPlan } = useGeminiApi();

const plan = await generateProjectPlan({
  description: "Aplicación web de e-commerce con React",
  timeFrame: "3 meses",
  teamSize: 4,
  complexity: "media"
});
```

#### Análisis de Viabilidad
```typescript
const { analyzeFeasibility } = useGeminiApi();

const analysis = await analyzeFeasibility(
  "Sistema de gestión de inventario con IA"
);
```

#### Integración con Jira
```typescript
import { jiraApiService } from './src/services/jira-service';

// Crear un issue en Jira
const issue = await jiraApiService.createIssue({
  fields: {
    project: { key: 'PROJ' },
    summary: 'Nueva tarea generada por IA',
    description: 'Descripción detallada...',
    issuetype: { name: 'Task' }
  }
});
```

## 🧪 Pruebas

### Pruebas de Gemini
1. Abre la aplicación en el navegador
2. Ve al "Panel de Pruebas Gemini"
3. Haz clic en "🚀 Ejecutar Todas las Pruebas"
4. Verifica que todas las pruebas pasen exitosamente

### Pruebas de Jira
1. Configura las variables de Jira en `.env.local`
2. Ve al "Panel de Pruebas Jira"
3. Haz clic en "Probar Conexión"
4. Verifica que la conexión sea exitosa

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── GeminiTestPanel.tsx
│   ├── jira-test-panel.tsx
│   └── csv-export-test-panel.tsx
├── config/              # Configuración
│   └── environment.ts
├── hooks/               # Hooks personalizados
│   ├── useGeminiApi.ts
│   └── use-jira-test.ts
├── services/            # Servicios de API
│   ├── geminiApi.ts
│   ├── jira-service.ts
│   └── jira-csv-export.ts
├── types/               # Definiciones TypeScript
│   ├── gemini.ts
│   ├── jira-types.ts
│   └── csv-export-types.ts
├── utils/               # Utilidades
│   ├── jira-config.ts
│   ├── jira-http-client.ts
│   ├── csv-data-converter.ts
│   └── csv-file-downloader.ts
└── App.tsx             # Componente principal
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Construcción para producción
pnpm build

# Vista previa de la build
pnpm preview

# Linting
pnpm lint
```

## 🚨 Solución de Problemas

### Error: "VITE_GEMINI_API_KEY no está configurada"
- Verifica que el archivo `.env.local` existe
- Confirma que la variable `VITE_GEMINI_API_KEY` está definida
- Reinicia el servidor de desarrollo

### Error: "Clave de API inválida"
- Verifica que la API key de Gemini sea correcta
- Asegúrate de que no tenga espacios extra
- Confirma que la API key esté activa en Google AI Studio

### Error: "No se pudo conectar con Jira"
- Verifica que la URL de Jira sea correcta
- Confirma que el email y API token sean válidos
- Verifica que tienes acceso a la instancia de Jira

### Error: "Cuota excedida" (Gemini)
- Espera unos minutos antes de volver a probar
- Verifica tu cuota en Google AI Studio
- Considera usar un modelo diferente

## 🔒 Seguridad

- Las API keys se almacenan en variables de entorno
- No se incluyen credenciales en el código fuente
- Se incluye `.env.local` en `.gitignore`
- Validación de entrada en todas las funciones

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Verifica que todas las dependencias estén instaladas correctamente
3. Asegúrate de que las API keys sean válidas
4. Abre un issue en el repositorio

## 🎉 ¡Listo para Usar!

Una vez configurado correctamente, tendrás acceso a:

- ✅ Generación automática de planes de proyecto
- ✅ Análisis de viabilidad técnica
- ✅ Cronogramas inteligentes
- ✅ Integración con Jira
- ✅ Exportación de datos
- ✅ Interfaz moderna y responsive

¡Disfruta planificando tus proyectos con IA! 🚀