/**
 * Jira API HTTP Client
 * 
 * Cliente HTTP especializado para realizar peticiones a la API de Jira
 */

import { JiraConfigManager } from '../utils/jira-config';
import type { JiraApiResponse } from '../types/jira-types';

export class JiraHttpClient {
  private configManager: JiraConfigManager;

  constructor(configManager: JiraConfigManager) {
    this.configManager = configManager;
  }

  async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<JiraApiResponse<T>> {
    try {
      if (!this.configManager.isConfigured()) {
        throw new Error('Jira API is not properly configured');
      }

      const url = `${this.configManager.getBaseUrl()}/rest/api/3${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': this.configManager.getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jira API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('Jira API request failed:', error);
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async get<T>(endpoint: string): Promise<JiraApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<JiraApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<JiraApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<JiraApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}
