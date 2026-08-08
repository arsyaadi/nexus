import { ModuleDocOutput } from '../types/index.js';

export interface DocGenerator {
  formatTechnicalDoc(moduleName: string, rawDetails: string): string;
  formatBusinessDoc(moduleName: string, rawFlow: string): string;
}

export class HumanizerSanitizer {
  /**
   * Cleans text of robotic AI-isms, filler phrases, and overly formal mechanical expressions (English & Indonesian).
   */
  static sanitize(text: string): string {
    if (!text) return '';
    return text
      .replace(/\bis a (module|component) responsible for\b/gi, 'handles')
      .replace(/\bis designed to (facilitate|provide)\b/gi, 'provides')
      .replace(/\bdelve into\b/gi, 'examine')
      .replace(/\btapestry\b/gi, 'structure')
      .replace(/\bseamlessly\b/gi, 'directly')
      .replace(/\bfurthermore\b/gi, 'also')
      .replace(/\bin conclusion\b/gi, 'summary:')
      .replace(/\btestament to\b/gi, 'proves')
      .replace(/merupakan (suatu|sebuah|modul) (yang|komponen yang) (bertugas|digunakan|berfungsi) untuk/gi, 'mengolah')
      .replace(/adalah (sebuah|suatu) (komponen|modul) yang/gi, 'berfungsi untuk')
      .replace(/dalam rangka (untuk|proses)/gi, 'untuk')
      .replace(/seiring dengan (perkembangan|proses)/gi, 'saat')
      .replace(/perlu dicatat bahwa/gi, 'catatan:')
      .replace(/secara (seamless|tanpa hambatan)/gi, 'langsung');
  }
}

export class MarkdownDocGenerator implements DocGenerator {
  formatTechnicalDoc(moduleName: string, rawDetails: string): string {
    const cleaned = HumanizerSanitizer.sanitize(rawDetails);
    return `# Technical Documentation: ${moduleName}\n\n${cleaned}`;
  }

  formatBusinessDoc(moduleName: string, rawFlow: string): string {
    const cleaned = HumanizerSanitizer.sanitize(rawFlow);
    return `# Draft Business Flow: ${moduleName}\n\n> 💡 **Notice**: Business flow is inferred.\n\n${cleaned}`;
  }
}
