# यजुर्वेद (Yajurveda) - Feature Guide

A comprehensive digital platform for exploring the Krishna Yajurveda Taittiriya Samhita with modern navigation, search, and audio capabilities.

---

## Table of Contents

1. [Homepage](#homepage)
2. [Navigation System](#navigation-system)
3. [Kanda (Book) Pages](#kanda-book-pages)
4. [Prasna (Chapter) Pages](#prasna-chapter-pages)
5. [Panchasat (Verse) Detail Pages](#panchasat-verse-detail-pages)
6. [Search Functionality](#search-functionality)
7. [Audio Streaming](#audio-streaming)
8. [Commentaries](#commentaries)
9. [Mobile Accessibility](#mobile-accessibility)
10. [Planned Features](#planned-features)

---

## Homepage

![Homepage](screenshots/01-homepage.png)

The homepage serves as the central hub for navigating the Taittiriya Samhita. It features:

### Header Banner
- Deep teal/indigo gradient design distinctive from the Rigveda site
- Sanskrit title "यजुर्वेद" with subtitle "कृष्ण यजुर्वेद तैत्तिरीय संहिता"
- English transliteration "Yajurvēda - Krishna Yajurveda Taittiriya Samhita"

### Statistics Dashboard
Four key metrics displayed prominently:
- **7 काण्डानि** (Kandas/Books)
- **44 प्रश्नाः** (Prasnas/Chapters)
- **651 अनुवाकाः** (Anuvakas/Sections)
- **2,198 पञ्चाशत्** (Panchasats/Verse groups)

### Kanda Navigation Grid
- **7 Kandas** displayed as interactive cards
- Each card shows:
  - Kanda number in a gradient circle
  - Sanskrit name (e.g., "प्रथमं काण्डम्")
  - English name (e.g., "First Kanda")
  - Number of Prasnas in that Kanda
- Click any Kanda to access its detailed page

### About Section
Brief introduction to the Taittiriya Samhita in both Sanskrit and English, explaining:
- The text's significance in the Krishna Yajurveda tradition
- Its naming after sage Tittiri
- The hierarchical organization structure

---

## Navigation System

### Hierarchical Structure

The Taittiriya Samhita follows a four-level hierarchy:

```
काण्डम् (Kanda) - 7 major divisions
  └── प्रश्नः (Prasna) - Chapters within each Kanda
       └── अनुवाकः (Anuvaka) - Sections within each Prasna
            └── पञ्चाशत् (Panchasat) - Individual verse groups
```

### Breadcrumb Navigation
Every page includes contextual breadcrumbs showing:
- Current position in the hierarchy
- Clickable links to parent levels
- Example: मुख्यपृष्ठम् › काण्डम् 1 › प्रश्नः 1 › अनुवाकः 1

### Navigation Bar
Sticky navigation bar with quick access to:
- मुख्यपृष्ठम् (Homepage)
- काण्डानि (Browse Kandas)
- अन्वेषणम् (Search)

---

## Kanda (Book) Pages

![Kanda Page](screenshots/02-kanda-page.png)

Each Kanda page provides an overview of a major division:

### Kanda Header
- Large Kanda number in gradient circle
- Sanskrit and English names
- Statistics: Total Prasnas and Anuvakas

### Prasna Grid
- All Prasnas displayed in a responsive grid
- Each Prasna card shows:
  - Prasna number prominently
  - Number of Anuvakas
  - Total Panchasat count
- Click to navigate to the Prasna page

### Inter-Kanda Navigation
- Previous/Next Kanda buttons at page bottom
- Seamless navigation between books

---

## Prasna (Chapter) Pages

![Prasna Page](screenshots/03-prasna-page.png)

Prasna pages are the primary reading interface, displaying all content within a chapter:

### Prasna Header
- Full reference: "काण्डम् X - प्रश्नः Y"
- English translation
- Statistics: Anuvaka and Panchasat counts

### Audio Player
- **Full Prasna recording** available for each chapter
- Located prominently at the top of the content
- Professional Vedic recitation audio
- Standard HTML5 controls: Play/Pause, seeking, volume

### Anuvaka Sections
Content organized by Anuvaka with:
- **Sticky section headers** showing Anuvaka number and verse count
- Clear visual separation between Anuvakas
- All Panchasats listed sequentially within each Anuvaka

### Verse Cards
Each Panchasat (verse group) displays:
- **Verse ID** (e.g., "TS 1.1.1.1") - clickable link to detail page
- **Samhita Patha** - the continuous Sanskrit text
- Collapsible **पदपाठः** (Pada Patha) - word-by-word analysis
- **Metadata footer** showing Rishi, Devata, Chandas (placeholders for now)
- Pada count when available

### Inter-Prasna Navigation
- Previous/Next Prasna buttons
- Links back to parent Kanda

---

## Panchasat (Verse) Detail Pages

![Panchasat Detail](screenshots/04-panchasat-detail.png)

Individual verse pages provide the most comprehensive view:

### Verse Display
- Large, clear Sanskrit text for Samhita Patha
- Full Pada Patha available in collapsible section
- Reference ID prominently displayed (e.g., "TS 1.1.1.1")

### Audio Player with Time Markers
The audio player supports **start and end time markers**:
- Currently plays the full Prasna recording
- Infrastructure ready for segment-specific playback
- When markers are added, will play only the relevant portion
- Automatic stop at end marker
- Automatic seek to start marker on load

### Commentaries (Bhashya)
Two traditional commentaries when available:

**सायणभाष्यम् (Sayana Bhashya)**
- 14th century commentary by Sayana
- Collapsible section for detailed study
- Full Sanskrit text

**भट्टभास्करभाष्यम् (Bhatta Bhaskara Bhashya)**
- 10th century commentary by Bhatta Bhaskara
- Collapsible section
- Provides alternative interpretations

### Classification Details
- काण्डम् (Kanda)
- प्रश्नः (Prasna)
- अनुवाकः (Anuvaka)
- पञ्चाशत् (Panchasat)

### Attribute Placeholders
Space reserved for future addition of:
- ऋषिः (Rishi)
- देवता (Devata)
- छन्दः (Chandas)

---

## Search Functionality

![Search Page](screenshots/05-search-page.png)

### Full-Text Search
- **2,198 Panchasats** indexed for instant search
- Search across Samhita Patha and Pada Patha
- Reference-based search (e.g., "1.1.1.1")

### Features
- Debounced input for performance
- Results limited to 50 for quick display
- Each result shows:
  - Verse ID (clickable link)
  - Preview of Samhita text
- Powered by Fuse.js for fuzzy matching

### Search Results
- Card-based result display
- Hover effects for interactivity
- Direct links to verse detail pages

---

## Audio Streaming

### Organization
Audio files are organized by **Prasna** (chapter):
- One MP3 file per Prasna
- Naming convention: `KYS_K{kanda}_P{prasna}.mp3`
- Example: `KYS_K01_P01.mp3` for Kanda 1, Prasna 1

### Current Implementation
- **44 Prasna recordings** available
- Full chapter playback on Prasna pages
- Complete recording accessible on individual verse pages

### Time Marker Support
The audio player is built with future time markers in mind:
```typescript
interface AudioMarker {
  anuvaka: number;
  panchasat: number;
  startTime: number;  // in seconds
  endTime: number;    // in seconds
}
```

When timing data is added:
- Verse pages will auto-seek to correct position
- Playback will stop at verse end
- Seamless listening experience for individual verses

### Hosting
- Currently served locally via symlink
- Ready for migration to Cloudflare R2 CDN
- Configuration in `src/lib/config.ts`

---

## Commentaries

### Sayana Bhashya (सायणभाष्यम्)

**14th Century Commentary**
- Written by Sayana, minister in the Vijayanagara Empire
- Most widely referenced traditional commentary
- Provides:
  - Word-by-word meanings
  - Grammatical analysis
  - Ritual context
  - Philosophical interpretations

### Bhatta Bhaskara Bhashya (भट्टभास्करभाष्यम्)

**10th Century Commentary**
- Written by Bhatta Bhaskara Mishra
- Predates Sayana's commentary
- Notable features:
  - Alternative interpretations
  - Different grammatical analyses
  - Valuable for comparative study

### Availability
- Not all Kandas have complete commentary coverage
- Commentary shown when available for the Anuvaka
- Collapsible sections to avoid overwhelming the reader

---

## Mobile Accessibility

![Mobile Homepage](screenshots/07-mobile-homepage.png)

The site is fully responsive and optimized for mobile devices:

### Responsive Layout
- Single-column layout on small screens
- Touch-friendly tap targets (44px minimum)
- Readable typography that scales appropriately

### Mobile-Optimized Features
- Collapsible sections reduce scrolling
- Optimized audio player controls
- Readable Sanskrit text at smaller sizes
- Full navigation functionality preserved

### Performance
- Static site generation for instant loading
- Optimized fonts and styles
- Efficient search index loading

---

## Planned Features

### Coming Soon

**Rishi, Devata, Chandas Information**
- Currently showing "अज्ञात" (Unknown) placeholders
- Will be populated with accurate attribution data
- Index pages for browsing by attribute

**Audio Time Markers**
- Individual verse timing within Prasna recordings
- Automatic segment playback
- Karaoke-style highlighting (future)

**Additional Patha Forms**
- Krama Patha markers
- Jata Patha markers
- Ghana Patha markers
- Data structure already supports these forms

**Enhanced Search**
- Phonetic matching for Sanskrit
- Advanced filters by Kanda, Prasna, etc.
- Highlighted search results

**Ashtaka Classification**
- Alternative organizational system
- Cross-reference navigation

---

## Technical Specifications

### Content Statistics
| Category | Count |
|----------|-------|
| Kandas | 7 |
| Prasnas | 44 |
| Anuvakas | 651 |
| Panchasats | 2,198 |
| Total Pages | 2,252 |

### Typography
- **AdiShila Vedic** font for authentic Sanskrit rendering
- Proper Devanagari display
- Optimized line height for Sanskrit text (2x)

### Color Scheme
Distinctive deep blue/teal palette:
- Primary: `#0d6e6e` (Deep teal)
- Accent: `#2e8b8b` (Light teal)
- Indigo: `#0a3d62` (Deep blue)
- Golden: `#c9a227` (Accent gold)

### Data Sources
- Samhita and Pada Patha from structured JSON
- Sayana Bhashya from traditional sources
- Bhatta Bhaskara Bhashya from traditional sources
- Audio from professional Vedic reciters

### Reference Format
Verses are referenced as **TS K.P.A.Ps** where:
- **K** = Kanda number (1-7)
- **P** = Prasna number
- **A** = Anuvaka number
- **Ps** = Panchasat number

Example: **TS 1.1.1.1** = Kanda 1, Prasna 1, Anuvaka 1, Panchasat 1

---

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome for Android)

---

## Differences from Rigveda Site

| Feature | Rigveda | Yajurveda |
|---------|---------|-----------|
| Structure | Mandala > Sukta > Rik | Kanda > Prasna > Anuvaka > Panchasat |
| Color Scheme | Saffron/Maroon | Deep Blue/Teal |
| Audio Organization | Per Rik | Per Prasna |
| Samanapada Section | Yes | No |
| Commentaries | Sayana | Sayana + Bhatta Bhaskara |
| Rishi/Devata/Chandas | Complete | Placeholders (coming soon) |

---

*ॐ सह नाववतु ।*
*सह नौ भुनक्तु ।*
*सह वीर्यं करवावहै ।*
*तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥*
*ॐ शान्तिः शान्तिः शान्तिः ॥*

---

© Yajurveda Sanatana - Preserving Ancient Wisdom
