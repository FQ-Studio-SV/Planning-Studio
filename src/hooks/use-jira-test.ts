/**
 * Hook personalizado para probar el servicio de Jira
 * 
 * Proporciona estado y métodos para verificar la conectividad y funcionalidades
 */

import { useState } from 'react';
import { jiraApiService } from '../services/jira-service';
import type { JiraUser, JiraProject } from '../types/jira-types';

interface JiraTestState {
  isConfigured: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  serverInfo: any;
  users: JiraUser[];
  projects: JiraProject[];
  testResults: {
    connection: boolean;
    users: boolean;
    projects: boolean;
  };
}

export function useJiraTest() {
  const [state, setState] = useState<JiraTestState>({
    isConfigured: false,
    isConnected: false,
    isLoading: false,
    error: null,
    serverInfo: null,
    users: [],
    projects: [],
    testResults: {
      connection: false,
      users: false,
      projects: false,
    },
  });

  const testConnection = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Verificar configuración
      const isConfigured = jiraApiService.isConfigured();
      
      if (!isConfigured) {
        throw new Error('Jira API no está configurada. Verifica las variables de entorno.');
      }

      // Probar conexión
      const isConnected = await jiraApiService.testConnection();
      
      if (!isConnected) {
        throw new Error('No se pudo conectar con Jira. Verifica la URL y credenciales.');
      }

      // Obtener información del servidor
      const serverInfo = await jiraApiService.getServerInfo();

      setState(prev => ({
        ...prev,
        isConfigured: true,
        isConnected: true,
        serverInfo,
        testResults: {
          ...prev.testResults,
          connection: true,
        },
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        testResults: {
          ...prev.testResults,
          connection: false,
        },
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const testUsers = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const users = await jiraApiService.getUsers();
      
      setState(prev => ({
        ...prev,
        users,
        testResults: {
          ...prev.testResults,
          users: users.length > 0,
        },
      }));

      return users.length > 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo usuarios';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        testResults: {
          ...prev.testResults,
          users: false,
        },
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const testProjects = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const projects = await jiraApiService.getProjects();
      
      setState(prev => ({
        ...prev,
        projects,
        testResults: {
          ...prev.testResults,
          projects: projects.length > 0,
        },
      }));

      return projects.length > 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error obteniendo proyectos';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        testResults: {
          ...prev.testResults,
          projects: false,
        },
      }));
      return false;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const runAllTests = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Probar conexión primero
    const connectionOk = await testConnection();
    
    if (connectionOk) {
      // Si la conexión es exitosa, probar otras funcionalidades
      await Promise.all([
        testUsers(),
        testProjects(),
      ]);
    }

    setState(prev => ({ ...prev, isLoading: false }));
  };

  const resetTests = () => {
    setState({
      isConfigured: false,
      isConnected: false,
      isLoading: false,
      error: null,
      serverInfo: null,
      users: [],
      projects: [],
      testResults: {
        connection: false,
        users: false,
        projects: false,
      },
    });
  };

  return {
    ...state,
    testConnection,
    testUsers,
    testProjects,
    runAllTests,
    resetTests,
  };
}
