#!/usr/bin/env node

/**
 * Generate Panchasat Index by Starting Letter
 * Groups all Panchasats by the first Devanagari character of their Samhita text
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'panchasat-index.json');

// Common Devanagari letters for grouping
const DEVANAGARI_GROUPS = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ',
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ञ',
  'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न',
  'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व',
  'श', 'ष', 'स', 'ह'
];

// Map similar letters to base letter
const LETTER_NORMALIZATION = {
  'ॐ': 'ओ',
  'ꣳ': 'अ',
};

function getFirstLetter(text) {
  if (!text) return null;
  
  // Remove any leading whitespace and Vedic marks
  const cleanText = text.replace(/^[\s॥।॰᳚]+/, '').trim();
  
  if (!cleanText) return null;
  
  // Get first character
  let firstChar = cleanText.charAt(0);
  
  // Normalize if needed
  if (LETTER_NORMALIZATION[firstChar]) {
    firstChar = LETTER_NORMALIZATION[firstChar];
  }
  
  // Check if it's a valid Devanagari consonant/vowel
  const code = firstChar.charCodeAt(0);
  if (code >= 0x0900 && code <= 0x097F) {
    // Find matching group
    for (const group of DEVANAGARI_GROUPS) {
      if (firstChar === group) return group;
    }
    // Handle vowel signs and other marks - try to find base
    if (code >= 0x0915 && code <= 0x0939) {
      return firstChar; // It's a consonant
    }
  }
  
  return firstChar;
}

function generateIndex() {
  console.log('Generating Panchasat Index by Starting Letter...\n');
  
  const index = {};
  let totalCount = 0;
  
  // Read structure index
  const structurePath = path.join(DATA_DIR, 'structure-index.json');
  const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
  
  for (const kanda of structure.kandas) {
    for (const prasna of kanda.prasnas) {
      for (const anuvaka of prasna.anuvakas) {
        for (let ps = 1; ps <= anuvaka.panchasatCount; ps++) {
          const panchasatPath = path.join(
            DATA_DIR,
            String(kanda.id).padStart(2, '0'),
            String(prasna.id).padStart(2, '0'),
            String(anuvaka.id).padStart(2, '0'),
            `${String(ps).padStart(2, '0')}.json`
          );
          
          if (!fs.existsSync(panchasatPath)) continue;
          
          try {
            const data = JSON.parse(fs.readFileSync(panchasatPath, 'utf-8'));
            const samhita = data.samhita || '';
            const firstLetter = getFirstLetter(samhita);
            
            if (firstLetter) {
              if (!index[firstLetter]) {
                index[firstLetter] = [];
              }
              
              index[firstLetter].push({
                kanda: kanda.id,
                prasna: prasna.id,
                anuvaka: anuvaka.id,
                panchasat: ps,
                ref: `${kanda.id}.${prasna.id}.${anuvaka.id}.${ps}`,
                preview: samhita.substring(0, 80) + (samhita.length > 80 ? '...' : '')
              });
              
              totalCount++;
            }
          } catch (err) {
            console.error(`Error reading ${panchasatPath}:`, err.message);
          }
        }
      }
    }
  }
  
  // Sort entries within each letter group
  for (const letter of Object.keys(index)) {
    index[letter].sort((a, b) => {
      if (a.kanda !== b.kanda) return a.kanda - b.kanda;
      if (a.prasna !== b.prasna) return a.prasna - b.prasna;
      if (a.anuvaka !== b.anuvaka) return a.anuvaka - b.anuvaka;
      return a.panchasat - b.panchasat;
    });
  }
  
  // Create sorted output with standard Devanagari order
  const sortedIndex = {};
  const letterOrder = [...DEVANAGARI_GROUPS];
  
  // First add letters in standard order
  for (const letter of letterOrder) {
    if (index[letter]) {
      sortedIndex[letter] = index[letter];
    }
  }
  
  // Then add any remaining letters
  for (const letter of Object.keys(index).sort()) {
    if (!sortedIndex[letter]) {
      sortedIndex[letter] = index[letter];
    }
  }
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedIndex, null, 2));
  
  console.log('Index Statistics:');
  console.log('=================');
  console.log(`Total Panchasats indexed: ${totalCount}`);
  console.log(`Unique starting letters: ${Object.keys(sortedIndex).length}`);
  console.log('\nLetter Distribution:');
  
  for (const [letter, entries] of Object.entries(sortedIndex)) {
    console.log(`  ${letter}: ${entries.length} panchasats`);
  }
  
  console.log(`\nIndex saved to: ${OUTPUT_FILE}`);
}

generateIndex();
