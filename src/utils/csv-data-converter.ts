/**
 * CSV Data Conversion Utilities
 * 
 * Utilidades para convertir datos de Jira a formato CSV
 */

import type { JiraIssue, JiraUser, JiraProject } from '../types/jira-types';
import type { 
  JiraIssueCsvData, 
  JiraUserCsvData, 
  JiraProjectCsvData,
  CsvExportOptions,
  CsvRow 
} from '../types/csv-export-types';

export class CsvDataConverter {
  private options: CsvExportOptions;

  constructor(options: Partial<CsvExportOptions> = {}) {
    this.options = {
      includeHeaders: true,
      dateFormat: 'iso',
      fields: this.getDefaultFields(),
      ...options,
    };
  }

  private getDefaultFields() {
    return [
      { key: 'key', label: 'Issue Key', required: true, type: 'string' as const },
      { key: 'summary', label: 'Summary', required: true, type: 'string' as const },
      { key: 'description', label: 'Description', required: false, type: 'string' as const },
      { key: 'issueType', label: 'Issue Type', required: true, type: 'string' as const },
      { key: 'status', label: 'Status', required: true, type: 'string' as const },
      { key: 'priority', label: 'Priority', required: false, type: 'string' as const },
      { key: 'assignee', label: 'Assignee', required: false, type: 'string' as const },
      { key: 'reporter', label: 'Reporter', required: true, type: 'string' as const },
      { key: 'project', label: 'Project', required: true, type: 'string' as const },
      { key: 'projectKey', label: 'Project Key', required: true, type: 'string' as const },
      { key: 'created', label: 'Created', required: true, type: 'date' as const },
      { key: 'updated', label: 'Updated', required: true, type: 'date' as const },
      { key: 'storyPoints', label: 'Story Points', required: false, type: 'number' as const },
      { key: 'labels', label: 'Labels', required: false, type: 'array' as const },
      { key: 'components', label: 'Components', required: false, type: 'array' as const },
      { key: 'fixVersions', label: 'Fix Versions', required: false, type: 'array' as const },
    ];
  }

  /**
   * Convierte un issue de Jira a datos CSV
   */
  convertIssueToCsv(issue: JiraIssue): JiraIssueCsvData {
    return {
      key: issue.key,
      summary: this.escapeCsvField(issue.fields.summary),
      description: this.escapeCsvField(issue.fields.description || ''),
      issueType: issue.fields.issuetype.name,
      status: issue.fields.status.name,
      priority: issue.fields.priority?.name || '',
      assignee: issue.fields.assignee?.displayName || '',
      reporter: issue.fields.reporter.displayName,
      project: issue.fields.project.name,
      projectKey: issue.fields.project.key,
      created: this.formatDate(issue.fields.created),
      updated: this.formatDate(issue.fields.updated),
      storyPoints: issue.fields.customfield_10016 || '',
      labels: this.arrayToString((issue.fields as any).labels || []),
      components: this.arrayToString((issue.fields as any).components?.map((c: any) => c.name) || []),
      fixVersions: this.arrayToString((issue.fields as any).fixVersions?.map((v: any) => v.name) || []),
      customFields: this.extractCustomFields(issue),
    };
  }

  /**
   * Convierte un usuario de Jira a datos CSV
   */
  convertUserToCsv(user: JiraUser): JiraUserCsvData {
    return {
      accountId: user.accountId,
      displayName: this.escapeCsvField(user.displayName),
      emailAddress: user.emailAddress,
      active: user.active,
    };
  }

  /**
   * Convierte un proyecto de Jira a datos CSV
   */
  convertProjectToCsv(project: JiraProject): JiraProjectCsvData {
    return {
      id: project.id,
      key: project.key,
      name: this.escapeCsvField(project.name),
      projectTypeKey: project.projectTypeKey,
      lead: this.escapeCsvField(project.lead.displayName),
      leadEmail: project.lead.emailAddress,
    };
  }

  /**
   * Convierte múltiples issues a formato CSV
   */
  convertIssuesToCsv(issues: JiraIssue[]): CsvRow[] {
    return issues.map(issue => {
      const csvData = this.convertIssueToCsv(issue);
      const row: CsvRow = {};

      this.options.fields.forEach(field => {
        const value = csvData[field.key as keyof JiraIssueCsvData];
        row[field.label] = this.formatValue(value, field.type);
      });

      return row;
    });
  }

  /**
   * Convierte múltiples usuarios a formato CSV
   */
  convertUsersToCsv(users: JiraUser[]): CsvRow[] {
    return users.map(user => {
      const csvData = this.convertUserToCsv(user);
      return {
        'Account ID': csvData.accountId,
        'Display Name': csvData.displayName,
        'Email Address': csvData.emailAddress,
        'Active': csvData.active,
      };
    });
  }

  /**
   * Convierte múltiples proyectos a formato CSV
   */
  convertProjectsToCsv(projects: JiraProject[]): CsvRow[] {
    return projects.map(project => {
      const csvData = this.convertProjectToCsv(project);
      return {
        'ID': csvData.id,
        'Key': csvData.key,
        'Name': csvData.name,
        'Project Type': csvData.projectTypeKey,
        'Lead': csvData.lead,
        'Lead Email': csvData.leadEmail,
      };
    });
  }

  /**
   * Escapa campos CSV para evitar problemas con comillas y saltos de línea
   */
  private escapeCsvField(field: string): string {
    if (typeof field !== 'string') return '';
    
    // Si contiene comillas, comas o saltos de línea, envolver en comillas
    if (field.includes('"') || field.includes(',') || field.includes('\n') || field.includes('\r')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    
    return field;
  }

  /**
   * Convierte array a string separado por comas
   */
  private arrayToString(array: string[]): string {
    return array.length > 0 ? array.join(', ') : '';
  }

  /**
   * Formatea fechas según las opciones
   */
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    switch (this.options.dateFormat) {
      case 'iso':
        return date.toISOString();
      case 'local':
        return date.toLocaleString();
      case 'custom':
        return this.options.customDateFormat 
          ? this.formatCustomDate(date, this.options.customDateFormat)
          : date.toLocaleString();
      default:
        return date.toISOString();
    }
  }

  /**
   * Formatea fecha con formato personalizado
   */
  private formatCustomDate(date: Date, format: string): string {
    // Implementación básica de formato personalizado
    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
      .replace('DD', date.getDate().toString().padStart(2, '0'))
      .replace('HH', date.getHours().toString().padStart(2, '0'))
      .replace('mm', date.getMinutes().toString().padStart(2, '0'))
      .replace('ss', date.getSeconds().toString().padStart(2, '0'));
  }

  /**
   * Formatea valores según su tipo
   */
  private formatValue(value: any, type: string): string | number | boolean {
    switch (type) {
      case 'string':
        return this.escapeCsvField(String(value || ''));
      case 'number':
        return typeof value === 'number' ? value : 0;
      case 'boolean':
        return Boolean(value);
      case 'date':
        return this.formatDate(String(value || ''));
      case 'array':
        return Array.isArray(value) ? this.arrayToString(value) : '';
      default:
        return String(value || '');
    }
  }

  /**
   * Extrae campos personalizados del issue
   */
  private extractCustomFields(issue: JiraIssue): Record<string, string> {
    const customFields: Record<string, string> = {};
    
    // Buscar campos que empiecen con 'customfield_'
    Object.entries(issue.fields).forEach(([key, value]) => {
      if (key.startsWith('customfield_') && value !== null && value !== undefined) {
        customFields[key] = this.escapeCsvField(String(value));
      }
    });
    
    return customFields;
  }

  /**
   * Actualiza las opciones de exportación
   */
  updateOptions(newOptions: Partial<CsvExportOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Obtiene las opciones actuales
   */
  getOptions(): CsvExportOptions {
    return { ...this.options };
  }
}
