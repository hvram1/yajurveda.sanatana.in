// Audio configuration
// For local development with base path
// For Cloudflare R2: update AUDIO_BASE_URL to Worker URL
const BASE_PATH = import.meta.env.BASE_URL || '/yajurveda.sanatana.in/';
export const AUDIO_BASE_URL = 'https://yajurveda-audio.rigveda.workers.dev/MP3/';
//export const AUDIO_BASE_URL = `${BASE_PATH}audio`;

// Helper to construct audio URL for a Prasna
export function getAudioUrl(kanda: number, prasna: number): string {
  const k = String(kanda).padStart(2, '0');
  const p = String(prasna).padStart(2, '0');
  return `${AUDIO_BASE_URL}/KYS_K${k}_P${p}.mp3`;
}

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
