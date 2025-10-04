/**
 * CSV File Download Utilities
 * 
 * Utilidades para generar y descargar archivos CSV
 */

import type { CsvRow, CsvExportData } from '../types/csv-export-types';

export class CsvFileDownloader {
  /**
   * Genera contenido CSV a partir de datos
   */
  generateCsvContent(headers: string[], rows: CsvRow[]): string {
    const csvLines: string[] = [];

    // Agregar headers si están habilitados
    if (headers.length > 0) {
      csvLines.push(this.arrayToCsvLine(headers));
    }

    // Agregar filas de datos
    rows.forEach(row => {
      const values = headers.map(header => row[header] || '');
      csvLines.push(this.arrayToCsvLine(values));
    });

    return csvLines.join('\n');
  }

  /**
   * Convierte un array de valores a una línea CSV
   */
  private arrayToCsvLine(values: (string | number | boolean)[]): string {
    return values.map(value => this.escapeCsvValue(value)).join(',');
  }

  /**
   * Escapa un valor para CSV
   */
  private escapeCsvValue(value: string | number | boolean): string {
    const stringValue = String(value);
    
    // Si contiene comillas, comas o saltos de línea, envolver en comillas
    if (stringValue.includes('"') || stringValue.includes(',') || 
        stringValue.includes('\n') || stringValue.includes('\r')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  /**
   * Descarga un archivo CSV
   */
  downloadCsvFile(csvContent: string, filename: string): void {
    // Crear blob con el contenido CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Crear URL del blob
    const url = URL.createObjectURL(blob);
    
    // Crear elemento de descarga temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    // Agregar al DOM, hacer clic y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL del blob
    URL.revokeObjectURL(url);
  }

  /**
   * Genera nombre de archivo con timestamp
   */
  generateFilename(prefix: string, extension: string = 'csv'): string {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `${prefix}_${timestamp}.${extension}`;
  }

  /**
   * Valida que el nombre del archivo sea seguro
   */
  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Descarga datos CSV completos
   */
  downloadCsvData(data: CsvExportData): void {
    const csvContent = this.generateCsvContent(data.headers, data.rows);
    const sanitizedFilename = this.sanitizeFilename(data.filename);
    this.downloadCsvFile(csvContent, sanitizedFilename);
  }

  /**
   * Descarga CSV con configuración personalizada
   */
  downloadCsvWithConfig(
    headers: string[],
    rows: CsvRow[],
    filename: string,
    includeHeaders: boolean = true
  ): void {
    const finalHeaders = includeHeaders ? headers : [];
    const csvContent = this.generateCsvContent(finalHeaders, rows);
    const sanitizedFilename = this.sanitizeFilename(filename);
    this.downloadCsvFile(csvContent, sanitizedFilename);
  }

  /**
   * Previsualiza contenido CSV en consola
   */
  previewCsv(headers: string[], rows: CsvRow[], maxRows: number = 10): void {
    console.log('=== CSV Preview ===');
    console.log('Headers:', headers);
    console.log(`Rows (showing first ${Math.min(maxRows, rows.length)}):`);
    
    rows.slice(0, maxRows).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
    
    if (rows.length > maxRows) {
      console.log(`... and ${rows.length - maxRows} more rows`);
    }
  }

  /**
   * Obtiene el tamaño estimado del archivo CSV
   */
  getEstimatedFileSize(headers: string[], rows: CsvRow[]): number {
    const sampleContent = this.generateCsvContent(headers, rows.slice(0, 1));
    const bytesPerRow = new Blob([sampleContent]).size;
    const totalBytes = bytesPerRow * rows.length;
    
    return totalBytes;
  }

  /**
   * Formatea el tamaño del archivo en unidades legibles
   */
  formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
