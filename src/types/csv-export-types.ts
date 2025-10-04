/**
 * Jira CSV Export Types
 * 
 * Tipos para la exportación de datos de Jira a CSV
 */

// Tipos para la exportación de datos de Jira a CSV

export interface CsvExportOptions {
  includeHeaders: boolean;
  dateFormat: 'iso' | 'local' | 'custom';
  customDateFormat?: string;
  fields: CsvField[];
}

export interface CsvField {
  key: string;
  label: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
}

export interface CsvRow {
  [key: string]: string | number | boolean;
}

export interface CsvExportData {
  headers: string[];
  rows: CsvRow[];
  filename: string;
}

export interface JiraIssueCsvData {
  key: string;
  summary: string;
  description: string;
  issueType: string;
  status: string;
  priority: string;
  assignee: string;
  reporter: string;
  project: string;
  projectKey: string;
  created: string;
  updated: string;
  storyPoints: number | string;
  labels: string;
  components: string;
  fixVersions: string;
  customFields: Record<string, string>;
}

export interface JiraUserCsvData {
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
}

export interface JiraProjectCsvData {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  lead: string;
  leadEmail: string;
}
