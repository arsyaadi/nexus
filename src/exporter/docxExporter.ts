import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';
import { OKFExporter, OKFExporterOptions } from './index.js';
import { loadOKFPackage } from './loader.js';

export class DocxExporter implements OKFExporter {
  async export(options: OKFExporterOptions): Promise<void> {
    const { okfDir, outputDir, title = 'OKF Documentation' } = options;
    const pkg = await loadOKFPackage(okfDir);

    await fs.mkdir(outputDir, { recursive: true });

    // 1. Generate technical.docx
    const techDoc = await this.createDocumentFromMap(
      `${title} - Technical Documentation`,
      pkg.technicalDocs
    );
    const techBuffer = await Packer.toBuffer(techDoc);
    await fs.writeFile(path.join(outputDir, 'technical.docx'), techBuffer);

    // 2. Generate business.docx
    const bizDoc = await this.createDocumentFromMap(
      `${title} - Business Flow Documentation (Draft)`,
      pkg.businessDocs
    );
    const bizBuffer = await Packer.toBuffer(bizDoc);
    await fs.writeFile(path.join(outputDir, 'business.docx'), bizBuffer);
  }

  private async createDocumentFromMap(docTitle: string, docsMap: Map<string, string>): Promise<Document> {
    const children: (Paragraph | Table)[] = [];

    // Main Document Header Title
    children.push(
      new Paragraph({
        text: docTitle,
        heading: HeadingLevel.TITLE,
        spacing: { after: 300 }
      })
    );

    if (docsMap.size === 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: 'No modules documented.', italics: true })]
        })
      );
    }

    for (const [filename, markdown] of docsMap.entries()) {
      const moduleName = filename.replace(/\.md$/, '').toUpperCase();

      children.push(
        new Paragraph({
          text: `Module: ${moduleName}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const elements = await this.parseMarkdownToDocxElements(markdown);
      children.push(...elements);
    }

    return new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    });
  }

  private async parseMarkdownToDocxElements(markdown: string): Promise<(Paragraph | Table)[]> {
    const elements: (Paragraph | Table)[] = [];
    const lines = markdown.split(/\r?\n/);

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Handle Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } },
            spacing: { before: 180, after: 180 }
          })
        );
        i++;
        continue;
      }

      // Handle Code Blocks & Mermaid Diagrams
      if (line.startsWith('```')) {
        const isMermaid = line.includes('mermaid');
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```

        if (isMermaid) {
          const mermaidCode = codeLines.join('\n');
          const imgBuffer = await this.fetchMermaidImage(mermaidCode);

          if (imgBuffer) {
            elements.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imgBuffer,
                    transformation: {
                      width: 550,
                      height: 320
                    },
                    type: 'png'
                  })
                ],
                spacing: { before: 180, after: 180 }
              })
            );
          } else {
            // Fallback to styled process table if offline/fetch error
            elements.push(this.renderMermaidAsTable(codeLines));
          }
        } else {
          elements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: codeLines.join('\n'),
                  font: 'Courier New',
                  size: 19
                })
              ],
              shading: { fill: 'F4F4F5' },
              spacing: { before: 120, after: 120 }
            })
          );
        }
        continue;
      }

      // Handle Markdown Tables
      if (line.trim().startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        elements.push(this.renderMarkdownTable(tableLines));
        continue;
      }

      // Handle Blockquotes / Callout boxes
      if (line.trim().startsWith('>')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        elements.push(
          new Paragraph({
            children: this.parseInlineMarkdown(quoteLines.join(' ')),
            shading: { fill: 'FFFBEB' },
            border: { left: { style: BorderStyle.SINGLE, size: 24, color: 'F59E0B' } },
            spacing: { before: 140, after: 140 }
          })
        );
        continue;
      }

      if (!line.trim()) {
        i++;
        continue;
      }

      // Handle Headings
      if (line.startsWith('# ')) {
        elements.push(
          new Paragraph({
            children: this.parseInlineMarkdown(line.replace(/^#\s+/, '')),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 }
          })
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          new Paragraph({
            children: this.parseInlineMarkdown(line.replace(/^##\s+/, '')),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 100 }
          })
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          new Paragraph({
            children: this.parseInlineMarkdown(line.replace(/^###\s+/, '')),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 180, after: 80 }
          })
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          new Paragraph({
            children: this.parseInlineMarkdown(line.replace(/^[-*]\s+/, '')),
            bullet: { level: 0 },
            spacing: { after: 60 }
          })
        );
      } else {
        elements.push(
          new Paragraph({
            children: this.parseInlineMarkdown(line),
            spacing: { after: 120 }
          })
        );
      }

      i++;
    }

    return elements;
  }

  /**
   * Fetch rendered PNG image buffer for Mermaid code via mermaid.ink service
   */
  private async fetchMermaidImage(mermaidCode: string): Promise<Buffer | null> {
    try {
      const base64Code = Buffer.from(mermaidCode, 'utf-8').toString('base64');
      const url = `https://mermaid.ink/img/${base64Code}`;
      const response = await fetch(url);
      if (response.ok) {
        const arrayBuf = await response.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
    } catch {
      // Fallback on offline or fetch error
    }
    return null;
  }

  /**
   * Parse inline Markdown syntax (**bold**, *italic*, `code`) into TextRun objects
   */
  private parseInlineMarkdown(text: string): TextRun[] {
    const runs: TextRun[] = [];

    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const parts = text.split(regex);

    for (const part of parts) {
      if (!part) continue;

      if (part.startsWith('**') && part.endsWith('**')) {
        runs.push(
          new TextRun({
            text: part.slice(2, -2),
            bold: true
          })
        );
      } else if (part.startsWith('*') && part.endsWith('*')) {
        runs.push(
          new TextRun({
            text: part.slice(1, -1),
            italics: true
          })
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        runs.push(
          new TextRun({
            text: part.slice(1, -1),
            font: 'Courier New',
            size: 20
          })
        );
      } else {
        runs.push(new TextRun({ text: part }));
      }
    }

    return runs;
  }

  /**
   * Convert markdown table syntax (| col1 | col2 |) to Word Table
   */
  private renderMarkdownTable(tableLines: string[]): Table {
    const rows: TableRow[] = [];

    const parsedLines = tableLines
      .map((l) => l.trim())
      .filter((l) => l && !l.match(/^\|?\s*:?-+:?\s*(\|?\s*:?-+:?\s*)*\|?$/));

    parsedLines.forEach((line, rowIndex) => {
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter((c, idx, arr) => idx > 0 && idx < arr.length - 1 || c !== '');

      const isHeader = rowIndex === 0;

      const tableCells = cells.map((cellText) => {
        return new TableCell({
          children: [
            new Paragraph({
              children: this.parseInlineMarkdown(cellText)
            })
          ],
          shading: isHeader ? { fill: 'E5E7EB' } : undefined,
          width: { size: 100 / cells.length, type: WidthType.PERCENTAGE }
        });
      });

      rows.push(new TableRow({ children: tableCells }));
    });

    return new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    });
  }

  /**
   * Convert Mermaid diagram lines to styled Process Flow Table in Word (Fallback)
   */
  private renderMermaidAsTable(mermaidLines: string[]): Table {
    const steps: Array<{ from: string; to: string; action: string }> = [];

    for (const line of mermaidLines) {
      const arrowMatch = line.match(/(.+?)\s*(?:-->|-->>|->>)\s*(?:\|(.+?)\|)?\s*(.+)/);
      if (arrowMatch) {
        steps.push({
          from: arrowMatch[1].trim(),
          action: arrowMatch[2] ? arrowMatch[2].trim() : 'Proceed',
          to: arrowMatch[3].trim()
        });
      }
    }

    const rows: TableRow[] = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Langkah', bold: true })] })], shading: { fill: 'DBEAFE' } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dari (Source)', bold: true })] })], shading: { fill: 'DBEAFE' } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Aksi / Kondisi', bold: true })] })], shading: { fill: 'DBEAFE' } }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Ke (Target)', bold: true })] })], shading: { fill: 'DBEAFE' } }),
        ]
      })
    ];

    if (steps.length === 0) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 4,
              children: [
                new Paragraph({
                  children: [new TextRun({ text: mermaidLines.join('\n'), font: 'Courier New', size: 19 })]
                })
              ]
            })
          ]
        })
      );
    } else {
      steps.forEach((step, idx) => {
        rows.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: `Step ${idx + 1}` })] }),
              new TableCell({ children: [new Paragraph({ text: step.from })] }),
              new TableCell({ children: [new Paragraph({ text: step.action })] }),
              new TableCell({ children: [new Paragraph({ text: step.to })] }),
            ]
          })
        );
      });
    }

    return new Table({
      rows,
      width: { size: 100, type: WidthType.PERCENTAGE }
    });
  }
}
