/**
 * CSV Export Test Component
 * 
 * Componente para probar las funcionalidades de exportación CSV
 */

import { useState } from 'react';
import { jiraCsvExportService } from '../services/jira-csv-export';
import type { ExportResult } from '../services/jira-csv-export';

export function CsvExportTestPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ExportResult | null>(null);
  const [projectKey, setProjectKey] = useState('');
  const [jqlQuery, setJqlQuery] = useState('');
  const [maxResults, setMaxResults] = useState(100);
  const [customFilename, setCustomFilename] = useState('');

  const handleExport = async (type: 'issues' | 'users' | 'projects' | 'jql') => {
    setIsLoading(true);
    setLastResult(null);

    try {
      let result: ExportResult;

      switch (type) {
        case 'issues':
          result = await jiraCsvExportService.exportProjectIssues({
            projectKey,
            maxResults,
            filename: customFilename || undefined,
          });
          break;

        case 'users':
          result = await jiraCsvExportService.exportUsers({
            filename: customFilename || undefined,
          });
          break;

        case 'projects':
          result = await jiraCsvExportService.exportProjects({
            filename: customFilename || undefined,
          });
          break;

        case 'jql':
          if (!jqlQuery.trim()) {
            result = {
              success: false,
              error: 'Debes ingresar una consulta JQL',
            };
          } else {
            result = await jiraCsvExportService.exportIssuesWithJql(jqlQuery, {
              maxResults,
              filename: customFilename || undefined,
            });
          }
          break;

        default:
          result = {
            success: false,
            error: 'Tipo de exportación no válido',
          };
      }

      setLastResult(result);
    } catch (error) {
      setLastResult({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async (type: 'issues' | 'users' | 'projects') => {
    try {
      const preview = await jiraCsvExportService.previewExport(type, {
        projectKey,
        jql: jqlQuery,
      });

      if (preview) {
        console.log(`=== Preview ${type} ===`);
        console.log('Headers:', preview.headers);
        console.log('Sample rows:', preview.rows);
        console.log('Total count:', preview.count);
        alert(`Preview generado en consola. ${preview.count} registros encontrados.`);
      } else {
        alert('No se pudo generar el preview');
      }
    } catch (error) {
      alert(`Error en preview: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Exportación CSV de Jira
        </h2>
        <p className="text-gray-600">
          Exporta información de Jira a archivos CSV para análisis o importación
        </p>
      </div>

      {/* Configuración */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Configuración de Exportación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clave del Proyecto
            </label>
            <input
              type="text"
              value={projectKey}
              onChange={(e) => setProjectKey(e.target.value)}
              placeholder="Ej: PROJ"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Máximo de Resultados
            </label>
            <input
              type="number"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              min="1"
              max="10000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consulta JQL (opcional)
            </label>
            <input
              type="text"
              value={jqlQuery}
              onChange={(e) => setJqlQuery(e.target.value)}
              placeholder="Ej: project = PROJ AND status = 'In Progress'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Archivo Personalizado (opcional)
            </label>
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              placeholder="Dejar vacío para nombre automático"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Botones de Exportación */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Exportaciones Disponibles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Exportar Issues del Proyecto */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Issues del Proyecto</h4>
            <p className="text-sm text-gray-600 mb-3">
              Exporta todos los issues de un proyecto específico
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('issues')}
                disabled={isLoading || !projectKey.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Exportando...' : 'Exportar Issues'}
              </button>
              <button
                onClick={() => handlePreview('issues')}
                disabled={isLoading || !projectKey.trim()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Exportar con JQL */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Consulta JQL</h4>
            <p className="text-sm text-gray-600 mb-3">
              Exporta issues usando una consulta JQL personalizada
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('jql')}
                disabled={isLoading || !jqlQuery.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Exportando...' : 'Exportar con JQL'}
              </button>
            </div>
          </div>

          {/* Exportar Usuarios */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Usuarios</h4>
            <p className="text-sm text-gray-600 mb-3">
              Exporta la lista de usuarios de Jira
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('users')}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Exportando...' : 'Exportar Usuarios'}
              </button>
              <button
                onClick={() => handlePreview('users')}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            </div>
          </div>

          {/* Exportar Proyectos */}
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Proyectos</h4>
            <p className="text-sm text-gray-600 mb-3">
              Exporta la lista de proyectos de Jira
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('projects')}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Exportando...' : 'Exportar Proyectos'}
              </button>
              <button
                onClick={() => handlePreview('projects')}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resultado de la última exportación */}
      {lastResult && (
        <div className={`mb-6 p-4 border rounded-lg ${
          lastResult.success ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
        }`}>
          <h3 className={`text-lg font-semibold mb-2 ${
            lastResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {lastResult.success ? 'Exportación Exitosa' : 'Error en Exportación'}
          </h3>
          
          {lastResult.success ? (
            <div className="text-green-700 space-y-1">
              <p><strong>Archivo:</strong> {lastResult.filename}</p>
              <p><strong>Registros:</strong> {lastResult.rowCount}</p>
              <p><strong>Tamaño:</strong> {lastResult.fileSize}</p>
            </div>
          ) : (
            <p className="text-red-700">{lastResult.error}</p>
          )}
        </div>
      )}

      {/* Información adicional */}
      <div className="p-4 border rounded-lg bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Información sobre Exportaciones CSV
        </h3>
        <div className="text-blue-700 text-sm space-y-2">
          <p>• Los archivos CSV se descargan automáticamente al navegador</p>
          <p>• Los nombres de archivo incluyen timestamp para evitar duplicados</p>
          <p>• Los campos con comillas, comas o saltos de línea se escapan automáticamente</p>
          <p>• Usa Preview para verificar los datos antes de exportar</p>
          <p>• Las consultas JQL permiten filtros avanzados (ej: status, assignee, etc.)</p>
        </div>
      </div>
    </div>
  );
}
