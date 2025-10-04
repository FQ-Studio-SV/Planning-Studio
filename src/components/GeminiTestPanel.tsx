/**
 * Panel de pruebas para verificar la integración con Gemini
 * Componente temporal para testing - se puede eliminar después
 */

import { useState } from 'react';
import { useGeminiApi } from '../hooks/useGeminiApi';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  response?: string;
}

export function GeminiTestPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  
  const {
    generateProjectPlan,
    analyzeFeasibility,
    generateTimeline,
    suggestImprovements,
    loading
  } = useGeminiApi();

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    const startTime = Date.now();
    try {
      const response = await testFunction();
      const duration = Date.now() - startTime;
      
      setResults(prev => [...prev, {
        name: testName,
        success: true,
        duration,
        response: response.text?.substring(0, 200) + '...'
      }]);
    } catch (error) {
      const duration = Date.now() - startTime;
      setResults(prev => [...prev, {
        name: testName,
        success: false,
        duration,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }]);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Test 1: Análisis de viabilidad
    setCurrentTest('Análisis de viabilidad...');
    await runTest('Análisis de viabilidad', () => 
      analyzeFeasibility('Aplicación web de gestión de tareas con React y TypeScript')
    );
    
    // Test 2: Generación de plan
    setCurrentTest('Generación de plan...');
    await runTest('Generación de plan', () => 
      generateProjectPlan({
        description: 'Sistema de inventario para tienda',
        timeFrame: '2 meses',
        teamSize: 2,
        complexity: 'media'
      })
    );
    
    // Test 3: Generación de cronograma
    setCurrentTest('Generación de cronograma...');
    await runTest('Generación de cronograma', () => 
      generateTimeline({
        description: 'Landing page para SaaS',
        timeFrame: '1 mes',
        teamSize: 1,
        complexity: 'baja'
      })
    );
    
    // Test 4: Sugerencias
    setCurrentTest('Sugerencias de mejoras...');
    await runTest('Sugerencias', () => 
      suggestImprovements('E-commerce con carrito de compras', 'Desarrollo en 6 meses')
    );
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🧪 Panel de Pruebas - Gemini API
      </h2>
      
      {/* Controles */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={runAllTests}
            disabled={isRunning || loading.isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Ejecutando...' : '🚀 Ejecutar Todas las Pruebas'}
          </button>
          
          <button
            onClick={clearResults}
            disabled={isRunning || loading.isLoading}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            🗑️ Limpiar Resultados
          </button>
        </div>
        
        {currentTest && (
          <div className="text-blue-600 font-medium">
            ⏳ {currentTest}
          </div>
        )}
        
        {loading.isLoading && (
          <div className="text-orange-600 font-medium">
            🔄 {loading.progress ? `Progreso: ${loading.progress}%` : 'Procesando...'}
          </div>
        )}
        
        {loading.error && (
          <div className="text-red-600 font-medium">
            ❌ Error: {loading.error}
          </div>
        )}
      </div>
      
      {/* Resultados */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            📊 Resultados de las Pruebas
          </h3>
          
          <div className="grid gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success 
                    ? 'bg-green-50 border-green-500' 
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {result.success ? '✅' : '❌'} {result.name}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {result.duration}ms
                  </span>
                </div>
                
                {result.error && (
                  <div className="text-red-600 text-sm mb-2">
                    <strong>Error:</strong> {result.error}
                  </div>
                )}
                
                {result.response && (
                  <div className="text-gray-600 text-sm">
                    <strong>Respuesta:</strong> {result.response}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Resumen */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">📈 Resumen</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Exitosas:</strong> {results.filter(r => r.success).length}/{results.length}
              </div>
              <div>
                <strong>Tiempo total:</strong> {results.reduce((sum, r) => sum + r.duration, 0)}ms
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Instrucciones */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Instrucciones</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Asegúrate de tener configurada VITE_GEMINI_API_KEY en tu archivo .env</li>
          <li>• Las pruebas verifican conectividad, análisis, generación de planes y sugerencias</li>
          <li>• Este panel es temporal y se puede eliminar después de verificar la integración</li>
        </ul>
      </div>
    </div>
  );
}
