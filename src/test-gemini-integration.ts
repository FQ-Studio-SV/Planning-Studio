/**
 * Sistema de pruebas para verificar la integración con Google Gemini API
 * Ejecuta diferentes tests para validar la funcionalidad completa
 */

import { geminiApi } from './services/geminiApi';
import { getGeminiConfig } from './config/environment';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  response?: any;
}

class GeminiTestSuite {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log('🧪 Iniciando suite de pruebas de Gemini API...\n');
    
    // Verificar configuración
    await this.testConfiguration();
    
    // Test básico de conectividad
    await this.testBasicConnectivity();
    
    // Test de análisis de viabilidad
    await this.testFeasibilityAnalysis();
    
    // Test de generación de plan
    await this.testProjectPlanGeneration();
    
    // Test de generación de cronograma
    await this.testTimelineGeneration();
    
    // Test de sugerencias
    await this.testImprovementSuggestions();
    
    // Mostrar resumen
    this.showResults();
  }

  private async testConfiguration(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('🔧 Probando configuración...');
      
      const config = getGeminiConfig();
      
      if (!config.apiKey) {
        throw new Error('API Key no configurada');
      }
      
      if (!config.model) {
        throw new Error('Modelo no configurado');
      }
      
      console.log(`✅ Configuración válida:`);
      console.log(`   - Modelo: ${config.model}`);
      console.log(`   - Temperatura: ${config.temperature}`);
      console.log(`   - API Key: ${config.apiKey.substring(0, 10)}...`);
      
      this.addResult('Configuración', true, Date.now() - startTime);
      
    } catch (error) {
      console.log(`❌ Error en configuración: ${error}`);
      this.addResult('Configuración', false, Date.now() - startTime, error as string);
    }
  }

  private async testBasicConnectivity(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('\n🌐 Probando conectividad básica...');
      
      const response = await geminiApi.analyzeFeasibility('Test de conectividad');
      
      if (!response.text) {
        throw new Error('Respuesta vacía');
      }
      
      console.log(`✅ Conectividad exitosa`);
      console.log(`   - Respuesta recibida: ${response.text.length} caracteres`);
      
      if (response.usage) {
        console.log(`   - Tokens usados: ${response.usage.totalTokens}`);
      }
      
      this.addResult('Conectividad', true, Date.now() - startTime, undefined, response);
      
    } catch (error) {
      console.log(`❌ Error de conectividad: ${error}`);
      this.addResult('Conectividad', false, Date.now() - startTime, error as string);
    }
  }

  private async testFeasibilityAnalysis(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('\n📊 Probando análisis de viabilidad...');
      
      const testProject = 'Desarrollar una aplicación móvil de delivery con React Native, backend en Node.js y base de datos PostgreSQL';
      
      const response = await geminiApi.analyzeFeasibility(testProject);
      
      if (!response.text) {
        throw new Error('Respuesta vacía');
      }
      
      console.log(`✅ Análisis de viabilidad exitoso`);
      console.log(`   - Proyecto: ${testProject.substring(0, 50)}...`);
      console.log(`   - Respuesta: ${response.text.substring(0, 100)}...`);
      
      this.addResult('Análisis Viabilidad', true, Date.now() - startTime, undefined, response);
      
    } catch (error) {
      console.log(`❌ Error en análisis de viabilidad: ${error}`);
      this.addResult('Análisis Viabilidad', false, Date.now() - startTime, error as string);
    }
  }

  private async testProjectPlanGeneration(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('\n📋 Probando generación de plan de proyecto...');
      
      const testContext = {
        description: 'Crear un sistema de gestión de inventario para una tienda pequeña',
        timeFrame: '3 meses',
        teamSize: 2,
        budget: '5000 USD',
        complexity: 'media' as const,
        deliveryDate: '2024-03-15'
      };
      
      const response = await geminiApi.generateProjectPlan(testContext);
      
      if (!response.text) {
        throw new Error('Respuesta vacía');
      }
      
      console.log(`✅ Generación de plan exitosa`);
      console.log(`   - Contexto: ${testContext.description}`);
      console.log(`   - Respuesta: ${response.text.substring(0, 150)}...`);
      
      this.addResult('Generación Plan', true, Date.now() - startTime, undefined, response);
      
    } catch (error) {
      console.log(`❌ Error en generación de plan: ${error}`);
      this.addResult('Generación Plan', false, Date.now() - startTime, error as string);
    }
  }

  private async testTimelineGeneration(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('\n⏰ Probando generación de cronograma...');
      
      const testContext = {
        description: 'Desarrollar una landing page para un producto SaaS',
        timeFrame: '2 semanas',
        teamSize: 1,
        complexity: 'baja' as const
      };
      
      const response = await geminiApi.generateTimeline(testContext);
      
      if (!response.text) {
        throw new Error('Respuesta vacía');
      }
      
      console.log(`✅ Generación de cronograma exitosa`);
      console.log(`   - Proyecto: ${testContext.description}`);
      console.log(`   - Respuesta: ${response.text.substring(0, 150)}...`);
      
      this.addResult('Generación Cronograma', true, Date.now() - startTime, undefined, response);
      
    } catch (error) {
      console.log(`❌ Error en generación de cronograma: ${error}`);
      this.addResult('Generación Cronograma', false, Date.now() - startTime, error as string);
    }
  }

  private async testImprovementSuggestions(): Promise<void> {
    const startTime = Date.now();
    
    try {
      console.log('\n💡 Probando sugerencias de mejoras...');
      
      const testDescription = 'Aplicación web de e-commerce con carrito de compras';
      const currentPlan = 'Desarrollo en 6 meses con equipo de 3 personas';
      
      const response = await geminiApi.suggestImprovements(testDescription, currentPlan);
      
      if (!response.text) {
        throw new Error('Respuesta vacía');
      }
      
      console.log(`✅ Sugerencias generadas exitosamente`);
      console.log(`   - Proyecto: ${testDescription}`);
      console.log(`   - Respuesta: ${response.text.substring(0, 150)}...`);
      
      this.addResult('Sugerencias', true, Date.now() - startTime, undefined, response);
      
    } catch (error) {
      console.log(`❌ Error en sugerencias: ${error}`);
      this.addResult('Sugerencias', false, Date.now() - startTime, error as string);
    }
  }

  private addResult(name: string, success: boolean, duration: number, error?: string, response?: any): void {
    this.results.push({
      name,
      success,
      duration,
      error,
      response
    });
  }

  private showResults(): void {
    console.log('\n📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(50));
    
    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`✅ Exitosas: ${successful}/${total}`);
    console.log(`⏱️  Tiempo total: ${totalTime}ms`);
    console.log(`📈 Promedio por test: ${Math.round(totalTime / total)}ms`);
    
    console.log('\n📋 Detalles:');
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const time = `${result.duration}ms`;
      console.log(`   ${status} ${result.name} (${time})`);
      
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });
    
    if (successful === total) {
      console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
      console.log('🚀 La integración con Gemini está lista para usar.');
    } else {
      console.log('\n⚠️  Algunas pruebas fallaron. Revisa la configuración.');
    }
  }
}

// Función principal para ejecutar las pruebas
export async function runGeminiTests(): Promise<void> {
  const testSuite = new GeminiTestSuite();
  await testSuite.runAllTests();
}

// Ejecutar si se llama directamente
if (import.meta.main) {
  runGeminiTests().catch(console.error);
}
