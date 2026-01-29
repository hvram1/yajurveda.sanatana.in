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

console.log('Generating search index...');

const searchIndex = [];

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
            
            // Add to search index with minimal data
            searchIndex.push({
              id: data.id,
              classification: data.classification,
              samhita: data.samhita,
              pada: data.pada
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing kanda ${k}:`, error.message);
  }
}

// Write search index
const outputPath = path.join(publicDir, 'search-index.json');
fs.writeFileSync(outputPath, JSON.stringify(searchIndex));

console.log(`Search index generated with ${searchIndex.length} entries`);
console.log(`Written to: ${outputPath}`);
