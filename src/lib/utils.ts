import fs from 'fs';
import path from 'path';

export interface PanchasatData {
  id: string;
  classification: {
    kanda: string;
    prasna: string;
    anuvaka: string;
    panchasat: string;
  };
  header: string;
  panchasatInfo: string;
  padaCount: number;
  samhita: string;
  pada: string;
  attribute: {
    rishi: string;
    devata: string;
    chandas: string;
  };
  sayanaBhashya?: string;
  bhattaBhashya?: string;
}

export interface StructureIndex {
  kandas: {
    id: number;
    prasnas: {
      id: number;
      anuvakas: {
        id: number;
        info: string;
        korvaiInfo: string;
        panchasatCount: number;
      }[];
    }[];
  }[];
}

export function padNumber(n: number, width: number = 2): string {
  return String(n).padStart(width, '0');
}

export async function loadPanchasat(
  kanda: number,
  prasna: number,
  anuvaka: number,
  panchasat: number
): Promise<PanchasatData | null> {
  const filePath = path.join(
    process.cwd(),
    'src/data',
    padNumber(kanda),
    padNumber(prasna),
    padNumber(anuvaka),
    `${padNumber(panchasat)}.json`
  );
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function getStructureIndex(): StructureIndex {
  const filePath = path.join(process.cwd(), 'src/data/structure-index.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function getAnuvakaPanchasats(
  kanda: number,
  prasna: number,
  anuvaka: number
): PanchasatData[] {
  const anuvakaPath = path.join(
    process.cwd(),
    'src/data',
    padNumber(kanda),
    padNumber(prasna),
    padNumber(anuvaka)
  );
  const panchasats: PanchasatData[] = [];
  
  try {
    const files = fs.readdirSync(anuvakaPath).filter(f => f.endsWith('.json')).sort();
    for (const file of files) {
      const content = fs.readFileSync(path.join(anuvakaPath, file), 'utf-8');
      panchasats.push(JSON.parse(content));
    }
  } catch {}
  
  return panchasats;
}

export function getPrasnaAnuvakas(kanda: number, prasna: number): PanchasatData[][] {
  const prasnaPath = path.join(
    process.cwd(),
    'src/data',
    padNumber(kanda),
    padNumber(prasna)
  );
  const result: PanchasatData[][] = [];
  
  try {
    const anuvakas = fs.readdirSync(prasnaPath)
      .filter(d => !d.startsWith('.'))
      .sort();
    
    for (const a of anuvakas) {
      const anuvakaPath = path.join(prasnaPath, a);
      const stat = fs.statSync(anuvakaPath);
      if (stat.isDirectory()) {
        const panchasats: PanchasatData[] = [];
        const files = fs.readdirSync(anuvakaPath).filter(f => f.endsWith('.json')).sort();
        for (const file of files) {
          const content = fs.readFileSync(path.join(anuvakaPath, file), 'utf-8');
          panchasats.push(JSON.parse(content));
        }
        result.push(panchasats);
      }
    }
  } catch {}
  
  return result;
}

export const KANDA_NAMES = [
  '', // index 0 unused
  'प्रथमं काण्डम्',
  'द्वितीयं काण्डम्',
  'तृतीयं काण्डम्',
  'चतुर्थं काण्डम्',
  'पञ्चमं काण्डम्',
  'षष्ठं काण्डम्',
  'सप्तमं काण्डम्',
];

export const KANDA_NAMES_EN = [
  '',
  'First Kanda',
  'Second Kanda',
  'Third Kanda',
  'Fourth Kanda',
  'Fifth Kanda',
  'Sixth Kanda',
  'Seventh Kanda',
];



// Create URL-safe slug
export function createSlug(name: string): string {
  return simpleHash(name);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Cache for all panchasats
let _allPanchasatsCache: PanchasatData[] | null = null;

export function getAllPanchasats(): PanchasatData[] {
  if (_allPanchasatsCache) return _allPanchasatsCache;
  
  const allPanchasats: PanchasatData[] = [];
  const dataPath = path.join(process.cwd(), 'src/data');
  
  for (let k = 1; k <= 7; k++) {
    const kandaPath = path.join(dataPath, padNumber(k));
    try {
      const prasnas = fs.readdirSync(kandaPath).filter(d => !d.startsWith('.'));
      for (const p of prasnas) {
        const prasnaPath = path.join(kandaPath, p);
        const anuvakas = fs.readdirSync(prasnaPath).filter(d => !d.startsWith('.'));
        for (const a of anuvakas) {
          const anuvakaPath = path.join(prasnaPath, a);
          const stat = fs.statSync(anuvakaPath);
          if (stat.isDirectory()) {
            const files = fs.readdirSync(anuvakaPath).filter(f => f.endsWith('.json'));
            for (const f of files) {
              const content = fs.readFileSync(path.join(anuvakaPath, f), 'utf-8');
              allPanchasats.push(JSON.parse(content));
            }
          }
        }
      }
    } catch {}
  }
  
  _allPanchasatsCache = allPanchasats;
  return allPanchasats;
}

// ========================================
// SVARANUGAMI SYNC DATA
// ========================================

export interface SyncPhrase {
  text: string;
  start: number;
  end: number;
}

export interface SyncData {
  kanda: number;
  prasna: number;
  anuvaka: number;
  panchasat: number;
  phrases: SyncPhrase[];
  total_phrases: number;
}

/**
 * Load sync data for all Panchasats in an Anuvaka
 * Returns array of SyncData objects, one per Panchasat
 */
export function getAnuvakaSyncData(kanda: number, prasna: number, anuvaka: number): SyncData[] {
  const syncDir = path.join(process.cwd(), 'src/data/sync');
  const k = padNumber(kanda);
  const p = padNumber(prasna);
  const a = padNumber(anuvaka);
  const prasnaDir = path.join(syncDir, `K${k}_P${p}`);
  
  const syncDataList: SyncData[] = [];
  
  try {
    if (!fs.existsSync(prasnaDir)) return [];
    
    const files = fs.readdirSync(prasnaDir)
      .filter(f => f.startsWith(`K${k}_P${p}_A${a}_PS`) && f.endsWith('.json'))
      .sort();
    
    for (const file of files) {
      const content = fs.readFileSync(path.join(prasnaDir, file), 'utf-8');
      syncDataList.push(JSON.parse(content));
    }
  } catch (e) {
    // Sync data not available for this Anuvaka
  }
  
  return syncDataList;
}

/**
 * Combine all phrases from multiple Panchasats into a single array
 * Adjusts timing offsets so phrases are sequential
 */
export function combineAnuvakaPhrases(syncDataList: SyncData[]): SyncPhrase[] {
  const allPhrases: SyncPhrase[] = [];
  let timeOffset = 0;
  
  for (const syncData of syncDataList) {
    for (const phrase of syncData.phrases) {
      allPhrases.push({
        text: phrase.text,
        start: phrase.start + timeOffset,
        end: phrase.end + timeOffset
      });
    }
    // Add offset for next Panchasat (use last phrase's end time)
    if (syncData.phrases.length > 0) {
      const lastPhrase = syncData.phrases[syncData.phrases.length - 1];
      timeOffset += lastPhrase.end;
    }
  }
  
  return allPhrases;
}
