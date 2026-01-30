import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'src', 'data');
const publicDir = path.join(rootDir, 'public');

function padNumber(n, width = 2) {
  return String(n).padStart(width, '0');
}

// Phonetic normalization for search
const SVARA_MARKS = /[॒॑᳚]/g;
const PHONETIC_MAP = [
  [/ख/g, 'क'], [/घ/g, 'ग'], [/छ/g, 'च'], [/झ/g, 'ज'],
  [/ठ/g, 'ट'], [/ढ/g, 'ड'], [/थ/g, 'त'], [/ध/g, 'द'],
  [/फ/g, 'प'], [/भ/g, 'ब'],
  [/श/g, 'स'], [/ष/g, 'स'],
  [/ण/g, 'न'], [/ङ/g, 'न'], [/ञ/g, 'न'],
  [/ळ/g, 'ल'],
  [/आ/g, 'अ'], [/ई/g, 'इ'], [/ऊ/g, 'उ'], [/ऐ/g, 'ए'], [/औ/g, 'ओ'], [/ॠ/g, 'ऋ'],
  [/ं/g, 'म'], [/ँ/g, ''], [/ः/g, ''], [/ऽ/g, ''],
];

function phoneticKey(text) {
  let result = text.replace(SVARA_MARKS, '');
  for (const [pattern, replacement] of PHONETIC_MAP) {
    result = result.replace(pattern, replacement);
  }
  return result.replace(/[\s।॥,\.\-]+/g, ' ').trim().toLowerCase();
}

console.log('Generating search index...');

const searchIndex = [];

// Process Taittiriya Samhita (TS)
console.log('Processing TS...');
for (let k = 1; k <= 7; k++) {
  const kandaPath = path.join(dataDir, padNumber(k));
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
            const data = JSON.parse(content);
            
            const textContent = data.samhita + ' ' + (data.pada || '');
            searchIndex.push({
              id: data.id,
              text: 'ts',
              classification: data.classification,
              samhita: data.samhita,
              pada: data.pada,
              phonetic: phoneticKey(textContent),
              url: `/ts/panchasat/${data.classification.kanda}/${data.classification.prasna}/${data.classification.anuvaka}/${data.classification.panchasat}`
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing TS kanda ${k}:`, error.message);
  }
}
console.log(`  TS: ${searchIndex.length} entries`);

// Process Taittiriya Brahmana (TB)
const tbStartCount = searchIndex.length;
console.log('Processing TB...');
const tbDir = path.join(dataDir, 'tb');
const tbMetaPath = path.join(tbDir, 'metadata.json');

if (fs.existsSync(tbMetaPath)) {
  const tbMeta = JSON.parse(fs.readFileSync(tbMetaPath, 'utf-8'));
  
  for (const prasna of tbMeta.prasnas) {
    for (const prapaataka of prasna.prapatakas) {
      for (const anuvaka of prapaataka.anuvakas) {
        const p = padNumber(prasna.prasna);
        const pr = padNumber(prapaataka.prapaataka);
        const a = padNumber(anuvaka.anuvaka);
        const anuvakaDir = path.join(tbDir, p, pr, a);
        
        if (fs.existsSync(anuvakaDir)) {
          const files = fs.readdirSync(anuvakaDir).filter(f => f.endsWith('.json'));
          
          for (const f of files) {
            const content = fs.readFileSync(path.join(anuvakaDir, f), 'utf-8');
            const data = JSON.parse(content);
            
            searchIndex.push({
              id: data.id,
              text: 'tb',
              classification: data.classification,
              samhita: data.samhita,
              phonetic: phoneticKey(data.samhita),
              url: `/tb/anuvaka/${prasna.prasna}/${prapaataka.prapaataka}/${anuvaka.anuvaka}`
            });
          }
        }
      }
    }
  }
}
console.log(`  TB: ${searchIndex.length - tbStartCount} entries`);

// Process Taittiriya Aranyaka (TA)
const taStartCount = searchIndex.length;
console.log('Processing TA...');
const taDir = path.join(dataDir, 'ta');
const taMetaPath = path.join(taDir, 'metadata.json');

if (fs.existsSync(taMetaPath)) {
  const taMeta = JSON.parse(fs.readFileSync(taMetaPath, 'utf-8'));
  
  for (const prapaataka of taMeta.prapatakas) {
    for (const anuvaka of prapaataka.anuvakas) {
      const pr = padNumber(prapaataka.prapaataka);
      const a = padNumber(anuvaka.anuvaka);
      const anuvakaDir = path.join(taDir, pr, a);
      
      if (fs.existsSync(anuvakaDir)) {
        const files = fs.readdirSync(anuvakaDir).filter(f => f.endsWith('.json'));
        
        for (const f of files) {
          const content = fs.readFileSync(path.join(anuvakaDir, f), 'utf-8');
          const data = JSON.parse(content);
          
          searchIndex.push({
            id: data.id,
            text: 'ta',
            classification: data.classification,
            samhita: data.samhita,
            phonetic: phoneticKey(data.samhita),
            url: `/ta/anuvaka/${prapaataka.prapaataka}/${anuvaka.anuvaka}`
          });
        }
      }
    }
  }
}
console.log(`  TA: ${searchIndex.length - taStartCount} entries`);

// Write search index
const outputPath = path.join(publicDir, 'search-index.json');
fs.writeFileSync(outputPath, JSON.stringify(searchIndex));

console.log(`\nTotal search index: ${searchIndex.length} entries`);
console.log(`Written to: ${outputPath}`);
