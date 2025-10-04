# 🧪 Verificación del Servicio de Jira

## Cómo verificar que el servicio funciona

### 1. Configuración Inicial

Antes de probar el servicio, necesitas configurar las variables de entorno:

1. **Crea un archivo `.env.local`** en la raíz del proyecto:
```bash
# En la raíz del proyecto (mismo nivel que package.json)
touch .env.local
```

2. **Agrega las siguientes variables** al archivo `.env.local`:
```env
VITE_JIRA_BASE_URL=https://tuempresa.atlassian.net
VITE_JIRA_EMAIL=tu.email@empresa.com
VITE_JIRA_API_KEY=tu_api_token_aqui
```

3. **Obtén tu API Token de Jira**:
   - Ve a [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
   - Haz clic en "Create API token"
   - Copia el token generado

### 2. Ejecutar la Aplicación

```bash
# Instalar dependencias (si es la primera vez)
pnpm install

# Ejecutar el servidor de desarrollo
pnpm dev
```

### 3. Interfaz de Prueba

La aplicación ahora muestra un **Panel de Prueba de Jira** que incluye:

#### ✅ Indicadores de Estado
- **Configuración**: Verifica que las variables de entorno estén configuradas
- **Conexión**: Prueba la conectividad con la API de Jira

#### 🔧 Botones de Prueba
- **Probar Conexión**: Verifica la conectividad básica
- **Probar Usuarios**: Obtiene la lista de usuarios
- **Probar Proyectos**: Obtiene la lista de proyectos
- **Ejecutar Todas las Pruebas**: Ejecuta todas las pruebas en secuencia
- **Reiniciar**: Limpia los resultados anteriores

#### 📊 Información Mostrada
- **Información del Servidor**: Versión, URL, tipo de despliegue
- **Usuarios Encontrados**: Lista de usuarios con nombres y emails
- **Proyectos Encontrados**: Lista de proyectos con claves y tipos

### 4. Interpretación de Resultados

#### ✅ Pruebas Exitosas
- **Verde con ✓**: La funcionalidad funciona correctamente
- Se muestran datos reales de tu instancia de Jira

#### ❌ Pruebas Fallidas
- **Rojo con ✗**: Hay un problema con esa funcionalidad
- Se muestra un mensaje de error específico

#### ⚠️ Errores Comunes

1. **"Jira API no está configurada"**
   - Verifica que el archivo `.env.local` existe
   - Confirma que las variables están escritas correctamente
   - Reinicia el servidor de desarrollo

2. **"No se pudo conectar con Jira"**
   - Verifica que la URL de Jira es correcta
   - Confirma que el email y API token son válidos
   - Verifica que tienes acceso a la instancia de Jira

3. **"Error obteniendo usuarios/proyectos"**
   - La conexión funciona pero hay problemas de permisos
   - Verifica que tu usuario tiene acceso a los proyectos

### 5. Pruebas Manuales Adicionales

Si quieres probar funcionalidades específicas, puedes usar el servicio directamente en la consola del navegador:

```javascript
// En la consola del navegador (F12)
import { jiraApiService } from './src/services/jira-service';

// Probar conexión
await jiraApiService.testConnection();

// Obtener usuarios
const users = await jiraApiService.getUsers();
console.log(users);

// Obtener proyectos
const projects = await jiraApiService.getProjects();
console.log(projects);

// Crear un issue de prueba
const newIssue = await jiraApiService.createIssue({
  fields: {
    project: { key: 'TU_PROYECTO' },
    summary: 'Issue de prueba',
    description: 'Este es un issue creado para probar el servicio',
    issuetype: { name: 'Task' }
  }
});
console.log(newIssue);
```

### 6. Estructura de Archivos Creados

```
src/
├── components/
│   └── jira-test-panel.tsx    # Panel de prueba visual
├── hooks/
│   └── use-jira-test.ts       # Hook para manejar pruebas
├── services/
│   └── jira-service.ts        # Servicio principal
├── types/
│   └── jira-types.ts          # Interfaces TypeScript
└── utils/
    ├── jira-config.ts         # Configuración
    └── jira-http-client.ts    # Cliente HTTP
```

### 7. Próximos Pasos

Una vez que verifiques que el servicio funciona correctamente:

1. **Integración con Gemini**: El servicio está listo para trabajar con los servicios de IA
2. **Flujo de 3 pasos**: Puedes implementar el flujo completo del MVP
3. **Creación de Issues**: El servicio puede crear issues automáticamente desde Gemini

---

## 🚀 ¡El servicio está listo para usar!

Si todas las pruebas pasan exitosamente, tu servicio de Jira está funcionando correctamente y listo para integrarse con el resto de la aplicación.
