// ========================================
// AUDIO CONFIGURATION
// ========================================

// Set to true for Cloudflare, false for local testing
export const USE_CLOUDFLARE_AUDIO = true;

// Base URLs for audio files
// Worker URL: https://veda-audio.<subdomain>.workers.dev/yajurveda/splits
const CLOUDFLARE_AUDIO_BASE = 'https://veda-audio.secretary-e89.workers.dev/yajurveda/splits';

// Legacy: Prasna-level audio (full Prasna recordings)
const CLOUDFLARE_PRASNA_AUDIO = 'https://yajurveda-audio.secretary-e89.workers.dev/audio/MP3';

// NEW: Get audio URL for an Anuvaka (individual file per Anuvaka)
// For local: uses import.meta.env.BASE_URL to include the site's base path
// For Cloudflare: uses absolute URL
export function getAnuvakaAudioUrl(kanda: number, prasna: number, anuvaka: number, basePath?: string): string {
  const k = String(kanda).padStart(2, '0');
  const p = String(prasna).padStart(2, '0');
  const a = String(anuvaka).padStart(2, '0');
  
  if (USE_CLOUDFLARE_AUDIO) {
    return `${CLOUDFLARE_AUDIO_BASE}/K${k}_P${p}/K${k}_P${p}_A${a}.mp3`;
  } else {
    // Local: use basePath (includes /yajurveda.sanatana.in/ or /)
    const base = basePath || '/';
    return `${base}audio/splits/K${k}_P${p}/K${k}_P${p}_A${a}.mp3`;
  }
}

// LEGACY: Helper to construct audio URL for a full Prasna (kept for backward compatibility)
export function getAudioUrl(kanda: number, prasna: number): string {
  const k = String(kanda).padStart(2, '0');
  const p = String(prasna).padStart(2, '0');
  return `${CLOUDFLARE_PRASNA_AUDIO}/KYS_K${k}_P${p}.mp3`;
}

// ========================================
// SVARANUGAMI (SYNCED AUDIO-TEXT) FEATURE
// ========================================

// Master feature flag
export const SVARANUGAMI_ENABLED = true;

// Prasnas that have sync data available
// Format: { kanda, prasna } - add more as sync data is created
export const SVARANUGAMI_PRASNAS = [
  { kanda: 1, prasna: 1 }, { kanda: 1, prasna: 2 }, { kanda: 1, prasna: 3 },
  { kanda: 1, prasna: 4 }, { kanda: 1, prasna: 5 }, { kanda: 1, prasna: 6 },
  { kanda: 1, prasna: 7 }, { kanda: 1, prasna: 8 }, { kanda: 2, prasna: 1 },
  { kanda: 2, prasna: 2 }, { kanda: 2, prasna: 3 }, { kanda: 2, prasna: 4 },
  { kanda: 2, prasna: 5 }, { kanda: 2, prasna: 6 }, { kanda: 3, prasna: 1 },
  { kanda: 3, prasna: 2 }, { kanda: 3, prasna: 3 }, { kanda: 3, prasna: 4 },
  { kanda: 3, prasna: 5 }, { kanda: 4, prasna: 1 }, { kanda: 4, prasna: 2 },
  { kanda: 4, prasna: 3 }, { kanda: 4, prasna: 4 }, { kanda: 4, prasna: 5 },
  { kanda: 4, prasna: 6 }, { kanda: 4, prasna: 7 }, { kanda: 5, prasna: 1 },
  { kanda: 5, prasna: 2 }, { kanda: 5, prasna: 3 }, { kanda: 5, prasna: 4 },
  { kanda: 5, prasna: 5 }, { kanda: 5, prasna: 6 }, { kanda: 5, prasna: 7 },
  { kanda: 6, prasna: 1 }, { kanda: 6, prasna: 2 }, { kanda: 6, prasna: 3 },
  { kanda: 6, prasna: 4 }, { kanda: 6, prasna: 5 }, { kanda: 6, prasna: 6 },
  { kanda: 7, prasna: 1 }, { kanda: 7, prasna: 2 }, { kanda: 7, prasna: 3 },
  { kanda: 7, prasna: 4 }, { kanda: 7, prasna: 5 }
];

// Check if Svaranugami is available for a specific location
export function hasSvaranugamiData(kanda: number, prasna: number): boolean {
  if (!SVARANUGAMI_ENABLED) return false;
  return SVARANUGAMI_PRASNAS.some(p => p.kanda === kanda && p.prasna === prasna);
}

// Get sync data file path for a Panchasat
export function getSyncDataPath(kanda: number, prasna: number, anuvaka: number, panchasat: number): string {
  const k = String(kanda).padStart(2, '0');
  const p = String(prasna).padStart(2, '0');
  const a = String(anuvaka).padStart(2, '0');
  const ps = String(panchasat).padStart(2, '0');
  return `K${k}_P${p}/K${k}_P${p}_A${a}_PS${ps}.json`;
}

// ========================================
// AUDIO MARKERS (Legacy)
// ========================================

// Audio marker interface for future use
export interface AudioMarker {
  anuvaka: number;
  panchasat: number;
  startTime: number; // in seconds
  endTime: number;   // in seconds
}

// Placeholder for audio markers - to be populated with actual timing data
export const audioMarkers: Map<string, AudioMarker[]> = new Map();

// Get markers for a specific Prasna
export function getPrasnaMarkers(kanda: number, prasna: number): AudioMarker[] {
  const key = `${kanda}.${prasna}`;
  return audioMarkers.get(key) || [];
}

// Get marker for a specific Panchasat
export function getPanchasatMarker(
  kanda: number,
  prasna: number,
  anuvaka: number,
  panchasat: number
): AudioMarker | null {
  const markers = getPrasnaMarkers(kanda, prasna);
  return markers.find(m => m.anuvaka === anuvaka && m.panchasat === panchasat) || null;
}
