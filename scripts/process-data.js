import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, '..'); // Parent directory with JSON files
const outputDir = path.join(rootDir, 'src', 'data');

// Load the JSON files
const padaGhanaPath = path.join(dataDir, 'TS_withPadaGhanaJataiKrama.json');
const sayanaBhashyaPath = path.join(dataDir, 'TS_withSayanaBhashya.json');
const bhattaBhashyaPath = path.join(dataDir, 'TS_withBhattaBhashya.json');

console.log('Loading JSON files...');

const padaGhanaData = JSON.parse(fs.readFileSync(padaGhanaPath, 'utf-8'));
const sayanaBhashyaData = JSON.parse(fs.readFileSync(sayanaBhashyaPath, 'utf-8'));
const bhattaBhashyaData = JSON.parse(fs.readFileSync(bhattaBhashyaPath, 'utf-8'));

// Helper to pad numbers
function padNumber(n, width = 2) {
  return String(n).padStart(width, '0');
}

// Build a lookup map for Sayana Bhashya by kanda/prasna/anuvaka
function buildBhashyaMap(data, bhashyaKey) {
  const map = new Map();
  
  if (!data.TS || !data.TS.Kanda) return map;
  
  data.TS.Kanda.forEach((kanda, kIndex) => {
    const kandaNum = kIndex + 1;
    
    if (!kanda.Prasna) return;
    kanda.Prasna.forEach((prasna, pIndex) => {
      const prasnaNum = pIndex + 1;
      
      if (!prasna.Anuvakkam) return;
      prasna.Anuvakkam.forEach((anuvaka, aIndex) => {
        const anuvakaNum = aIndex + 1;
        
        // Get bhashya if available
        const bhashya = anuvaka[bhashyaKey];
        if (bhashya && bhashya.Sloka) {
          const key = `${kandaNum}.${prasnaNum}.${anuvakaNum}`;
          map.set(key, {
            header: bhashya.header || [],
            sloka: bhashya.Sloka || []
          });
        }
      });
    });
  });
  
  return map;
}

console.log('Building Bhashya lookup maps...');
const sayanaBhashyaMap = buildBhashyaMap(sayanaBhashyaData, 'SayanaBhashya');
const bhattaBhashyaMap = buildBhashyaMap(bhattaBhashyaData, 'BhattaBhashya');

// Process the main data
console.log('Processing Panchasat data...');

const stats = {
  kandas: 0,
  prasnas: 0,
  anuvakas: 0,
  panchasats: 0
};

// Structure index for navigation
const structureIndex = {
  kandas: []
};

if (!padaGhanaData.TS || !padaGhanaData.TS.Kanda) {
  console.error('Invalid data structure');
  process.exit(1);
}

padaGhanaData.TS.Kanda.forEach((kanda, kIndex) => {
  const kandaNum = kIndex + 1;
  stats.kandas++;
  
  const kandaInfo = {
    id: kandaNum,
    prasnas: []
  };
  
  if (!kanda.Prasna) return;
  
  kanda.Prasna.forEach((prasna, pIndex) => {
    const prasnaNum = pIndex + 1;
    stats.prasnas++;
    
    const prasnaInfo = {
      id: prasnaNum,
      anuvakas: []
    };
    
    if (!prasna.Anuvakkam) return;
    
    prasna.Anuvakkam.forEach((anuvaka, aIndex) => {
      const anuvakaNum = aIndex + 1;
      stats.anuvakas++;
      
      const anuvakaInfo = {
        id: anuvakaNum,
        info: anuvaka.anuvakkamInfo || '',
        korvaiInfo: anuvaka.KorvaiInfo || '',
        panchasatCount: 0
      };
      
      if (!anuvaka.Panchasat) return;
      
      // Get bhashya for this anuvaka
      const bhashyaKey = `${kandaNum}.${prasnaNum}.${anuvakaNum}`;
      const sayanaBhashya = sayanaBhashyaMap.get(bhashyaKey);
      const bhattaBhashya = bhattaBhashyaMap.get(bhashyaKey);
      
      anuvaka.Panchasat.forEach((panchasat, psIndex) => {
        const panchasatNum = psIndex + 1;
        stats.panchasats++;
        anuvakaInfo.panchasatCount++;
        
        // Create the panchasat data structure
        const panchasatData = {
          id: `TS ${kandaNum}.${prasnaNum}.${anuvakaNum}.${panchasatNum}`,
          classification: {
            kanda: String(kandaNum),
            prasna: String(prasnaNum),
            anuvaka: String(anuvakaNum),
            panchasat: String(panchasatNum)
          },
          header: panchasat.header || '',
          panchasatInfo: panchasat.panchasatInfo || '',
          padaCount: panchasat.padaCount || 0,
          samhita: panchasat.SamhitaPaata || '',
          pada: panchasat.PadaPaata || '',
          // Placeholders for rishi/devata/chandas
          attribute: {
            rishi: 'अज्ञात',
            devata: 'अज्ञात',
            chandas: 'अज्ञात'
          }
        };
        
        // Add bhashya if available for this anuvaka
        if (sayanaBhashya) {
          panchasatData.sayanaBhashya = sayanaBhashya.sloka.join('\n');
        }
        if (bhattaBhashya) {
          panchasatData.bhattaBhashya = bhattaBhashya.sloka.join('\n');
        }
        
        // Create directory structure
        const outPath = path.join(
          outputDir,
          padNumber(kandaNum),
          padNumber(prasnaNum),
          padNumber(anuvakaNum)
        );
        
        fs.mkdirSync(outPath, { recursive: true });
        
        // Write the JSON file
        const filePath = path.join(outPath, `${padNumber(panchasatNum)}.json`);
        fs.writeFileSync(filePath, JSON.stringify(panchasatData, null, 2));
      });
      
      prasnaInfo.anuvakas.push(anuvakaInfo);
    });
    
    kandaInfo.prasnas.push(prasnaInfo);
  });
  
  structureIndex.kandas.push(kandaInfo);
});

// Write the structure index
const indexPath = path.join(outputDir, 'structure-index.json');
fs.writeFileSync(indexPath, JSON.stringify(structureIndex, null, 2));

console.log('\nProcessing complete!');
console.log(`Kandas: ${stats.kandas}`);
console.log(`Prasnas: ${stats.prasnas}`);
console.log(`Anuvakas: ${stats.anuvakas}`);
console.log(`Panchasats: ${stats.panchasats}`);
console.log(`\nStructure index written to: ${indexPath}`);
