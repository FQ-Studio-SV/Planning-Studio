/**
 * Jira API Configuration Utilities
 * 
 * Utilidades para manejar la configuración de la API de Jira
 */

export interface JiraConfig {
  baseUrl: string;
  apiKey: string;
  email: string;
}

export class JiraConfigManager {
  private config: JiraConfig;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_JIRA_BASE_URL || '',
      apiKey: import.meta.env.VITE_JIRA_API_KEY || '',
      email: import.meta.env.VITE_JIRA_EMAIL || '',
    };

    this.validateConfig();
  }

  private validateConfig(): void {
    const { baseUrl, apiKey, email } = this.config;
    
    if (!baseUrl || !apiKey || !email) {
      console.warn('Jira API configuration is incomplete. Please check environment variables:');
      console.warn('- VITE_JIRA_BASE_URL:', baseUrl ? '✓' : '✗');
      console.warn('- VITE_JIRA_API_KEY:', apiKey ? '✓' : '✗');
      console.warn('- VITE_JIRA_EMAIL:', email ? '✓' : '✗');
    }
  }

  getConfig(): JiraConfig {
    return { ...this.config };
  }

  getAuthHeader(): string {
    const credentials = btoa(`${this.config.email}:${this.config.apiKey}`);
    return `Basic ${credentials}`;
  }

  isConfigured(): boolean {
    return !!(this.config.baseUrl && this.config.apiKey && this.config.email);
  }

  getBaseUrl(): string {
    return this.config.baseUrl;
  }
}
