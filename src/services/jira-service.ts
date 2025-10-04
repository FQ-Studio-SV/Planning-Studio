/**
 * Jira API Service
 * 
 * Servicio principal para consumir la API de Jira con los endpoints más comunes.
 * Integra con servicios de Gemini para generar información de tareas.
 */

import { JiraConfigManager } from '../utils/jira-config';
import { JiraHttpClient } from '../utils/jira-http-client';
import type {
  JiraUser,
  JiraProject,
  JiraIssueType,
  JiraIssue,
  CreateIssueRequest,
  JiraTransition,
  JiraComment,
} from '../types/jira-types';

export class JiraApiService {
  private httpClient: JiraHttpClient;
  private configManager: JiraConfigManager;

  constructor() {
    this.configManager = new JiraConfigManager();
    this.httpClient = new JiraHttpClient(this.configManager);
  }

  /**
   * Obtiene todos los usuarios del proyecto
   */
  async getUsers(): Promise<JiraUser[]> {
    const response = await this.httpClient.get<JiraUser[]>('/users/search');
    if (!response.success) {
      console.error('Failed to fetch users:', response.error);
      throw new Error(response.error || 'Failed to fetch users');
    }
    return response.data || [];
  }

  /**
   * Obtiene información de un usuario específico por accountId
   */
  async getUser(accountId: string): Promise<JiraUser | null> {
    const response = await this.httpClient.get<JiraUser>(`/user?accountId=${accountId}`);
    return response.success ? response.data : null;
  }

  /**
   * Obtiene todos los proyectos accesibles
   */
  async getProjects(): Promise<JiraProject[]> {
    const response = await this.httpClient.get<JiraProject[]>('/project');
    if (!response.success) {
      console.error('Failed to fetch projects:', response.error);
      throw new Error(response.error || 'Failed to fetch projects');
    }
    return response.data || [];
  }

  /**
   * Obtiene información de un proyecto específico
   */
  async getProject(projectKey: string): Promise<JiraProject | null> {
    const response = await this.httpClient.get<JiraProject>(`/project/${projectKey}`);
    return response.success ? response.data : null;
  }

  /**
   * Obtiene los tipos de issues disponibles para un proyecto
   */
  async getIssueTypes(projectKey: string): Promise<JiraIssueType[]> {
    const response = await this.httpClient.get<{ issueTypes: JiraIssueType[] }>(`/project/${projectKey}`);
    return response.success ? response.data.issueTypes || [] : [];
  }

  /**
   * Obtiene issues de un proyecto con filtros opcionales
   */
  async getIssues(
    projectKey: string,
    jql: string = '',
    maxResults: number = 50
  ): Promise<JiraIssue[]> {
    const jqlQuery = jql || `project = ${projectKey}`;
    const endpoint = `/search?jql=${encodeURIComponent(jqlQuery)}&maxResults=${maxResults}`;
    
    const response = await this.httpClient.get<{ issues: JiraIssue[] }>(endpoint);
    return response.success ? response.data.issues : [];
  }

  /**
   * Obtiene un issue específico por su key
   */
  async getIssue(issueKey: string): Promise<JiraIssue | null> {
    const response = await this.httpClient.get<JiraIssue>(`/issue/${issueKey}`);
    return response.success ? response.data : null;
  }

  /**
   * Crea un nuevo issue en Jira
   */
  async createIssue(issueData: CreateIssueRequest): Promise<JiraIssue | null> {
    const response = await this.httpClient.post<JiraIssue>('/issue', issueData);
    return response.success ? response.data : null;
  }

  /**
   * Actualiza un issue existente
   */
  async updateIssue(
    issueKey: string,
    updateData: Partial<CreateIssueRequest>
  ): Promise<JiraIssue | null> {
    const response = await this.httpClient.put<JiraIssue>(`/issue/${issueKey}`, updateData);
    return response.success ? response.data : null;
  }

  /**
   * Transiciona un issue a un nuevo estado
   */
  async transitionIssue(
    issueKey: string,
    transitionId: string,
    comment?: string
  ): Promise<boolean> {
    const body: any = {
      transition: { id: transitionId },
    };

    if (comment) {
      body.update = {
        comment: [
          {
            add: {
              body: comment,
            },
          },
        ],
      };
    }

    const response = await this.httpClient.post<void>(`/issue/${issueKey}/transitions`, body);
    return response.success;
  }

  /**
   * Obtiene las transiciones disponibles para un issue
   */
  async getIssueTransitions(issueKey: string): Promise<JiraTransition[]> {
    const response = await this.httpClient.get<{ transitions: JiraTransition[] }>(`/issue/${issueKey}/transitions`);
    return response.success ? response.data.transitions : [];
  }

  /**
   * Agrega un comentario a un issue
   */
  async addComment(issueKey: string, comment: string): Promise<JiraComment | null> {
    const response = await this.httpClient.post<JiraComment>(`/issue/${issueKey}/comment`, {
      body: comment,
    });
    return response.success ? response.data : null;
  }

  /**
   * Busca issues usando JQL (Jira Query Language)
   */
  async searchIssues(jql: string, maxResults: number = 50): Promise<JiraIssue[]> {
    const endpoint = `/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`;
    const response = await this.httpClient.get<{ issues: JiraIssue[] }>(endpoint);
    return response.success ? response.data.issues : [];
  }

  /**
   * Obtiene información de configuración del servidor Jira
   */
  async getServerInfo(): Promise<any> {
    const response = await this.httpClient.get<any>('/serverInfo');
    return response.success ? response.data : null;
  }

  /**
   * Verifica la conectividad con la API de Jira
   */
  async testConnection(): Promise<boolean> {
    const serverInfo = await this.getServerInfo();
    return serverInfo !== null;
  }

  /**
   * Verifica si la configuración está completa
   */
  isConfigured(): boolean {
    return this.configManager.isConfigured();
  }
}

// Instancia singleton del servicio
export const jiraApiService = new JiraApiService();
