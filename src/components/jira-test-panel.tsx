/**
 * Componente de prueba para verificar el servicio de Jira
 * 
 * Interfaz visual para probar la conectividad y funcionalidades básicas
 */

import { useJiraTest } from '../hooks/use-jira-test';

export function JiraTestPanel() {
  const {
    isConfigured,
    isConnected,
    isLoading,
    error,
    serverInfo,
    users,
    projects,
    testResults,
    testConnection,
    testUsers,
    testProjects,
    runAllTests,
    resetTests,
  } = useJiraTest();

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? '✓' : '✗';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Prueba del Servicio de Jira
        </h2>
        <p className="text-gray-600">
          Verifica la conectividad y funcionalidades básicas del servicio de Jira
        </p>
      </div>

      {/* Estado de configuración */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Estado de Configuración</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${getStatusColor(isConfigured)}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getStatusIcon(isConfigured)}</span>
              <span>Configuración</span>
            </div>
            <p className="text-sm mt-1">
              {isConfigured ? 'Variables de entorno configuradas' : 'Faltan variables de entorno'}
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${getStatusColor(isConnected)}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getStatusIcon(isConnected)}</span>
              <span>Conexión</span>
            </div>
            <p className="text-sm mt-1">
              {isConnected ? 'Conectado a Jira' : 'Sin conexión'}
            </p>
          </div>
        </div>
      </div>

      {/* Información del servidor */}
      {serverInfo && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold mb-3">Información del Servidor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Versión:</span> {serverInfo.version}
            </div>
            <div>
              <span className="font-medium">URL:</span> {serverInfo.baseUrl}
            </div>
            <div>
              <span className="font-medium">Tipo:</span> {serverInfo.deploymentType}
            </div>
            <div>
              <span className="font-medium">Tiempo de respuesta:</span> {serverInfo.responseTime}ms
            </div>
          </div>
        </div>
      )}

      {/* Resultados de pruebas */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Resultados de Pruebas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${getStatusColor(testResults.connection)}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getStatusIcon(testResults.connection)}</span>
              <span>Conexión API</span>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${getStatusColor(testResults.users)}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getStatusIcon(testResults.users)}</span>
              <span>Usuarios ({users.length})</span>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${getStatusColor(testResults.projects)}`}>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{getStatusIcon(testResults.projects)}</span>
              <span>Proyectos ({projects.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de prueba */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Pruebas</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Probando...' : 'Probar Conexión'}
          </button>
          
          <button
            onClick={testUsers}
            disabled={isLoading || !isConnected}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Probar Usuarios'}
          </button>
          
          <button
            onClick={testProjects}
            disabled={isLoading || !isConnected}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Probar Proyectos'}
          </button>
          
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ejecutando...' : 'Ejecutar Todas las Pruebas'}
          </button>
          
          <button
            onClick={resetTests}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 border border-red-300 rounded-lg bg-red-50">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Lista de usuarios */}
      {users.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Usuarios Encontrados</h3>
          <div className="max-h-40 overflow-y-auto">
            {users.slice(0, 10).map((user) => (
              <div key={user.accountId} className="py-2 border-b last:border-b-0">
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-600">{user.emailAddress}</div>
              </div>
            ))}
            {users.length > 10 && (
              <div className="text-sm text-gray-500 mt-2">
                ... y {users.length - 10} usuarios más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lista de proyectos */}
      {projects.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Proyectos Encontrados</h3>
          <div className="max-h-40 overflow-y-auto">
            {projects.slice(0, 10).map((project) => (
              <div key={project.id} className="py-2 border-b last:border-b-0">
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-600">
                  {project.key} - {project.projectTypeKey}
                </div>
              </div>
            ))}
            {projects.length > 10 && (
              <div className="text-sm text-gray-500 mt-2">
                ... y {projects.length - 10} proyectos más
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="p-4 border rounded-lg bg-yellow-50">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Instrucciones de Configuración
        </h3>
        <div className="text-yellow-700 text-sm space-y-2">
          <p>1. Crea un archivo <code className="bg-yellow-200 px-1 rounded">.env.local</code> en la raíz del proyecto</p>
          <p>2. Agrega las siguientes variables:</p>
          <div className="ml-4 font-mono text-xs bg-yellow-200 p-2 rounded">
            VITE_JIRA_BASE_URL=https://tuempresa.atlassian.net<br/>
            VITE_JIRA_EMAIL=tu.email@empresa.com<br/>
            VITE_JIRA_API_KEY=tu_api_token_aqui
          </div>
          <p>3. Reinicia el servidor de desarrollo con <code className="bg-yellow-200 px-1 rounded">pnpm dev</code></p>
        </div>
      </div>
    </div>
  );
}
