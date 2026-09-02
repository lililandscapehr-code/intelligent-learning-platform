import fs from 'fs';
import path from 'path';

export async function extractTextFromPdf(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'material', filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filename}`);
  }

  const dataBuffer = fs.readFileSync(filePath);
  
  try {
    const pdf = require('pdf-parse');
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error parsing PDF ${filename}:`, error);
    throw new Error(`Failed to extract text from ${filename}`);
  }
}

export function listMaterialFiles(): string[] {
  const materialDir = path.join(process.cwd(), 'material');
  if (!fs.existsSync(materialDir)) {
    return [];
  }
  
  return fs.readdirSync(materialDir).filter(file => file.toLowerCase().endsWith('.pdf'));
}
