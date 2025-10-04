# 🧪 Guía de Pruebas - Integración Gemini API

## 📋 Opciones de Prueba

### 1. **Prueba desde la Interfaz (Recomendado)**
```tsx
// En tu componente principal, importa y usa:
import { GeminiTestPanel } from './src/components/GeminiTestPanel';

function App() {
  return (
    <div>
      <GeminiTestPanel />
    </div>
  );
}
```

### 2. **Prueba Manual en Consola**
```typescript
// En la consola del navegador o en un componente:
import { runGeminiTests } from './src/test-gemini-integration';
await runGeminiTests();
```

## 🔧 Configuración Requerida

Antes de ejecutar las pruebas, asegúrate de tener:

1. **Archivo .env configurado:**
```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
VITE_GEMINI_MODEL=gemini-2.0-flash
VITE_GEMINI_TEMPERATURE=0.0
```

2. **API Key válida:**
   - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Crea una nueva API key
   - Cópiala en tu archivo .env

## 🧪 Qué Prueban las Pruebas

### ✅ **Test de Configuración**
- Verifica que la API key esté configurada
- Valida el modelo y temperatura
- Confirma que la configuración es válida

### ✅ **Test de Conectividad**
- Prueba la conexión básica con Gemini
- Verifica que se reciben respuestas
- Mide el tiempo de respuesta

### ✅ **Test de Análisis de Viabilidad**
- Envía un proyecto de ejemplo
- Verifica que se genera análisis técnico
- Confirma la estructura de respuesta

### ✅ **Test de Generación de Plan**
- Prueba la generación de planes de proyecto
- Valida el contexto del proyecto
- Verifica la respuesta estructurada

### ✅ **Test de Generación de Cronograma**
- Prueba la creación de cronogramas
- Valida diferentes tipos de proyectos
- Confirma la estimación de tiempo

### ✅ **Test de Sugerencias**
- Prueba las sugerencias de mejoras
- Valida el análisis de proyectos existentes
- Confirma la generación de recomendaciones

## 📊 Interpretación de Resultados

### ✅ **Prueba Exitosa**
```
✅ Análisis de viabilidad (1250ms)
   - Respuesta: El proyecto es técnicamente viable...
```

### ❌ **Prueba Fallida**
```
❌ Conectividad (5000ms)
   Error: Clave de API inválida. Verifica VITE_GEMINI_API_KEY
```

## 🚨 Solución de Problemas

### **Error: API Key no configurada**
```bash
# Verifica que existe el archivo .env
ls -la .env

# Si no existe, créalo:
cp env.example .env
# Luego edita .env y agrega tu API key
```

### **Error: Clave de API inválida**
- Verifica que la API key sea correcta
- Asegúrate de que no tenga espacios extra
- Confirma que la API key esté activa en Google AI Studio

### **Error: Cuota excedida**
- Espera unos minutos antes de volver a probar
- Verifica tu cuota en Google AI Studio
- Considera usar un modelo diferente

### **Error: Timeout**
- Verifica tu conexión a internet
- Intenta con un prompt más corto
- Revisa la configuración del modelo

## 🎯 Resultado Esperado

Si todo funciona correctamente, deberías ver:

```
🧪 Iniciando suite de pruebas de Gemini API...

🔧 Probando configuración...
✅ Configuración válida:
   - Modelo: gemini-2.0-flash
   - Temperatura: 0
   - API Key: AIzaSyC123...

🌐 Probando conectividad básica...
✅ Conectividad exitosa
   - Respuesta recibida: 450 caracteres
   - Tokens usados: 25

📊 Probando análisis de viabilidad...
✅ Análisis de viabilidad exitoso
   - Proyecto: Desarrollar una aplicación móvil de delivery...
   - Respuesta: El proyecto es técnicamente viable...

📋 Probando generación de plan de proyecto...
✅ Generación de plan exitosa
   - Contexto: Crear un sistema de gestión de inventario...
   - Respuesta: PLAN DE PROYECTO: Sistema de Gestión de Inventario...

⏰ Probando generación de cronograma...
✅ Generación de cronograma exitosa
   - Proyecto: Desarrollar una landing page para un producto SaaS...
   - Respuesta: CRONOGRAMA DETALLADO: Landing Page SaaS...

💡 Probando sugerencias de mejoras...
✅ Sugerencias generadas exitosamente
   - Proyecto: Aplicación web de e-commerce con carrito de compras...
   - Respuesta: SUGERENCIAS DE MEJORA: Para optimizar tu proyecto...

📊 RESUMEN DE PRUEBAS
==================================================
✅ Exitosas: 6/6
⏱️  Tiempo total: 8500ms
📈 Promedio por test: 1416ms

📋 Detalles:
   ✅ Configuración (5ms)
   ✅ Conectividad (1200ms)
   ✅ Análisis Viabilidad (1800ms)
   ✅ Generación Plan (2000ms)
   ✅ Generación Cronograma (1500ms)
   ✅ Sugerencias (1995ms)

🎉 ¡Todas las pruebas pasaron exitosamente!
🚀 La integración con Gemini está lista para usar.
```

## 🧹 Limpieza

Después de verificar que todo funciona, puedes eliminar los archivos de prueba:

```bash
rm src/test-gemini-integration.ts
rm src/components/GeminiTestPanel.tsx
rm PRUEBAS-GEMINI.md
```
