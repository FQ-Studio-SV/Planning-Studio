/**
 * Jira CSV Export Service
 * 
 * Servicio principal para exportar información de Jira a formato CSV
 */

import { CsvDataConverter } from '../utils/csv-data-converter';
import { CsvFileDownloader } from '../utils/csv-file-downloader';
import { jiraApiService } from '../services/jira-service';
import type { 
  CsvExportOptions, 
  CsvExportData,
  CsvRow 
} from '../types/csv-export-types';

export interface ExportResult {
  success: boolean;
  filename?: string;
  rowCount?: number;
  fileSize?: string;
  error?: string;
}

export interface ExportOptions {
  projectKey?: string;
  jql?: string;
  maxResults?: number;
  csvOptions?: Partial<CsvExportOptions>;
  filename?: string;
}

export class JiraCsvExportService {
  private dataConverter: CsvDataConverter;
  private fileDownloader: CsvFileDownloader;

  constructor() {
    this.dataConverter = new CsvDataConverter();
    this.fileDownloader = new CsvFileDownloader();
  }

  /**
   * Exporta issues de un proyecto específico
   */
  async exportProjectIssues(options: ExportOptions = {}): Promise<ExportResult> {
    try {
      const {
        projectKey = '',
        jql = '',
        maxResults = 1000,
        csvOptions = {},
        filename = 'jira_issues'
      } = options;

      // Actualizar opciones del convertidor
      this.dataConverter.updateOptions(csvOptions);

      // Obtener issues de Jira
      const issues = await jiraApiService.getIssues(projectKey, jql, maxResults);
      
      if (issues.length === 0) {
        return {
          success: false,
          error: 'No se encontraron issues para exportar',
        };
      }

      // Convertir a formato CSV
      const csvRows = this.dataConverter.convertIssuesToCsv(issues);
      const headers = this.dataConverter.getOptions().fields.map(field => field.label);

      // Generar nombre de archivo
      const finalFilename = this.fileDownloader.generateFilename(
        filename,
        'csv'
      );

      // Crear datos de exportación
      const exportData: CsvExportData = {
        headers,
        rows: csvRows,
        filename: finalFilename,
      };

      // Descargar archivo
      this.fileDownloader.downloadCsvData(exportData);

      // Calcular estadísticas
      const fileSize = this.fileDownloader.formatFileSize(
        this.fileDownloader.getEstimatedFileSize(headers, csvRows)
      );

      return {
        success: true,
        filename: finalFilename,
        rowCount: csvRows.length,
        fileSize,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Exporta usuarios de Jira
   */
  async exportUsers(options: ExportOptions = {}): Promise<ExportResult> {
    try {
      const {
        filename = 'jira_users'
      } = options;

      // Obtener usuarios de Jira
      const users = await jiraApiService.getUsers();
      
      if (users.length === 0) {
        return {
          success: false,
          error: 'No se encontraron usuarios para exportar',
        };
      }

      // Convertir a formato CSV
      const csvRows = this.dataConverter.convertUsersToCsv(users);
      const headers = ['Account ID', 'Display Name', 'Email Address', 'Active'];

      // Generar nombre de archivo
      const finalFilename = this.fileDownloader.generateFilename(
        filename,
        'csv'
      );

      // Crear datos de exportación
      const exportData: CsvExportData = {
        headers,
        rows: csvRows,
        filename: finalFilename,
      };

      // Descargar archivo
      this.fileDownloader.downloadCsvData(exportData);

      // Calcular estadísticas
      const fileSize = this.fileDownloader.formatFileSize(
        this.fileDownloader.getEstimatedFileSize(headers, csvRows)
      );

      return {
        success: true,
        filename: finalFilename,
        rowCount: csvRows.length,
        fileSize,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Exporta proyectos de Jira
   */
  async exportProjects(options: ExportOptions = {}): Promise<ExportResult> {
    try {
      const {
        filename = 'jira_projects'
      } = options;

      // Obtener proyectos de Jira
      const projects = await jiraApiService.getProjects();
      
      if (projects.length === 0) {
        return {
          success: false,
          error: 'No se encontraron proyectos para exportar',
        };
      }

      // Convertir a formato CSV
      const csvRows = this.dataConverter.convertProjectsToCsv(projects);
      const headers = ['ID', 'Key', 'Name', 'Project Type', 'Lead', 'Lead Email'];

      // Generar nombre de archivo
      const finalFilename = this.fileDownloader.generateFilename(
        filename,
        'csv'
      );

      // Crear datos de exportación
      const exportData: CsvExportData = {
        headers,
        rows: csvRows,
        filename: finalFilename,
      };

      // Descargar archivo
      this.fileDownloader.downloadCsvData(exportData);

      // Calcular estadísticas
      const fileSize = this.fileDownloader.formatFileSize(
        this.fileDownloader.getEstimatedFileSize(headers, csvRows)
      );

      return {
        success: true,
        filename: finalFilename,
        rowCount: csvRows.length,
        fileSize,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Exporta issues usando JQL personalizado
   */
  async exportIssuesWithJql(
    jql: string, 
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    try {
      const {
        maxResults = 1000,
        csvOptions = {},
        filename = 'jira_issues_jql'
      } = options;

      // Actualizar opciones del convertidor
      this.dataConverter.updateOptions(csvOptions);

      // Buscar issues con JQL
      const issues = await jiraApiService.searchIssues(jql, maxResults);
      
      if (issues.length === 0) {
        return {
          success: false,
          error: 'No se encontraron issues con la consulta JQL especificada',
        };
      }

      // Convertir a formato CSV
      const csvRows = this.dataConverter.convertIssuesToCsv(issues);
      const headers = this.dataConverter.getOptions().fields.map(field => field.label);

      // Generar nombre de archivo
      const finalFilename = this.fileDownloader.generateFilename(
        filename,
        'csv'
      );

      // Crear datos de exportación
      const exportData: CsvExportData = {
        headers,
        rows: csvRows,
        filename: finalFilename,
      };

      // Descargar archivo
      this.fileDownloader.downloadCsvData(exportData);

      // Calcular estadísticas
      const fileSize = this.fileDownloader.formatFileSize(
        this.fileDownloader.getEstimatedFileSize(headers, csvRows)
      );

      return {
        success: true,
        filename: finalFilename,
        rowCount: csvRows.length,
        fileSize,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Exporta datos personalizados a CSV
   */
  exportCustomData(
    headers: string[],
    rows: CsvRow[],
    filename: string = 'custom_data'
  ): ExportResult {
    try {
      if (rows.length === 0) {
        return {
          success: false,
          error: 'No hay datos para exportar',
        };
      }

      // Generar nombre de archivo
      const finalFilename = this.fileDownloader.generateFilename(
        filename,
        'csv'
      );

      // Crear datos de exportación
      const exportData: CsvExportData = {
        headers,
        rows,
        filename: finalFilename,
      };

      // Descargar archivo
      this.fileDownloader.downloadCsvData(exportData);

      // Calcular estadísticas
      const fileSize = this.fileDownloader.formatFileSize(
        this.fileDownloader.getEstimatedFileSize(headers, rows)
      );

      return {
        success: true,
        filename: finalFilename,
        rowCount: rows.length,
        fileSize,
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Previsualiza datos antes de exportar
   */
  async previewExport(
    type: 'issues' | 'users' | 'projects',
    options: ExportOptions = {}
  ): Promise<{ headers: string[]; rows: CsvRow[]; count: number } | null> {
    try {
      let headers: string[] = [];
      let rows: CsvRow[] = [];

      switch (type) {
        case 'issues':
          const issues = await jiraApiService.getIssues(
            options.projectKey || '',
            options.jql || '',
            10 // Solo primeros 10 para preview
          );
          rows = this.dataConverter.convertIssuesToCsv(issues);
          headers = this.dataConverter.getOptions().fields.map(field => field.label);
          break;

        case 'users':
          const users = await jiraApiService.getUsers();
          rows = this.dataConverter.convertUsersToCsv(users.slice(0, 10));
          headers = ['Account ID', 'Display Name', 'Email Address', 'Active'];
          break;

        case 'projects':
          const projects = await jiraApiService.getProjects();
          rows = this.dataConverter.convertProjectsToCsv(projects.slice(0, 10));
          headers = ['ID', 'Key', 'Name', 'Project Type', 'Lead', 'Lead Email'];
          break;
      }

      return {
        headers,
        rows,
        count: rows.length,
      };

    } catch (error) {
      console.error('Error en preview:', error);
      return null;
    }
  }

  /**
   * Actualiza las opciones de exportación CSV
   */
  updateCsvOptions(options: Partial<CsvExportOptions>): void {
    this.dataConverter.updateOptions(options);
  }

  /**
   * Obtiene las opciones actuales de exportación CSV
   */
  getCsvOptions(): CsvExportOptions {
    return this.dataConverter.getOptions();
  }
}

// Instancia singleton del servicio
export const jiraCsvExportService = new JiraCsvExportService();
