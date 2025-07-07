export interface DiffResult {
  type: 'addition' | 'deletion' | 'modification';
  lineNumber: number;
  oldLine?: string;
  newLine?: string;
  description: string;
}

export class DiffUtil {
  /**
   * Simple diff algorithm to compare two code strings
   * Returns an array of changes with descriptions
   */
  static diff(oldCode: string, newCode: string): DiffResult[] {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const changes: DiffResult[] = [];
    
    const maxLength = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLength; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      
      if (oldLine === undefined && newLine !== undefined) {
        // Addition
        changes.push({
          type: 'addition',
          lineNumber: i + 1,
          newLine,
          description: `Added line ${i + 1}: ${newLine.substring(0, 50)}${newLine.length > 50 ? '...' : ''}`
        });
      } else if (oldLine !== undefined && newLine === undefined) {
        // Deletion
        changes.push({
          type: 'deletion',
          lineNumber: i + 1,
          oldLine,
          description: `Removed line ${i + 1}: ${oldLine.substring(0, 50)}${oldLine.length > 50 ? '...' : ''}`
        });
      } else if (oldLine !== newLine) {
        // Modification
        changes.push({
          type: 'modification',
          lineNumber: i + 1,
          oldLine,
          newLine,
          description: `Modified line ${i + 1}`
        });
      }
    }
    
    return changes;
  }

  /**
   * Generate a human-readable summary of changes
   */
  static generateChangeSummary(changes: DiffResult[]): string[] {
    const summaries: string[] = [];
    
    const additions = changes.filter(c => c.type === 'addition').length;
    const deletions = changes.filter(c => c.type === 'deletion').length;
    const modifications = changes.filter(c => c.type === 'modification').length;
    
    if (additions > 0) {
      summaries.push(`Added ${additions} line${additions > 1 ? 's' : ''}`);
    }
    if (deletions > 0) {
      summaries.push(`Removed ${deletions} line${deletions > 1 ? 's' : ''}`);
    }
    if (modifications > 0) {
      summaries.push(`Modified ${modifications} line${modifications > 1 ? 's' : ''}`);
    }
    
    return summaries;
  }

  /**
   * Create a patch string in unified diff format
   */
  static createPatch(oldCode: string, newCode: string, filename: string = 'index.html'): string {
    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const changes = this.diff(oldCode, newCode);
    
    if (changes.length === 0) {
      return '';
    }
    
    let patch = `--- ${filename}\n`;
    patch += `+++ ${filename}\n`;
    patch += `@@ -1,${oldLines.length} +1,${newLines.length} @@\n`;
    
    let oldIndex = 0;
    let newIndex = 0;
    
    for (const change of changes) {
      const lineNum = change.lineNumber;
      
      // Add context lines before the change
      const contextStart = Math.max(0, lineNum - 3);
      const contextEnd = Math.min(lineNum + 2, oldLines.length);
      
      for (let i = contextStart; i < lineNum - 1; i++) {
        patch += ` ${oldLines[i]}\n`;
      }
      
      // Add the change
      switch (change.type) {
        case 'addition':
          patch += `+${change.newLine}\n`;
          break;
        case 'deletion':
          patch += `-${change.oldLine}\n`;
          break;
        case 'modification':
          patch += `-${change.oldLine}\n`;
          patch += `+${change.newLine}\n`;
          break;
      }
      
      // Add context lines after the change
      for (let i = lineNum; i < contextEnd; i++) {
        patch += ` ${oldLines[i]}\n`;
      }
    }
    
    return patch;
  }
} 