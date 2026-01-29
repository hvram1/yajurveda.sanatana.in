# Cloudflare R2 Audio Hosting Setup for Yajurveda

This guide covers setting up private R2 storage for Yajurveda audio files with a Worker proxy.

## Overview

- **R2 Bucket**: Stores 44 MP3 files (~500MB) - remains private
- **Worker**: Proxies requests, validates referer, serves audio
- **Cost**: Free tier covers ~10GB storage + 10M requests/month

## Prerequisites

1. Cloudflare account (free)
2. `wrangler` CLI installed: `npm install -g wrangler`
3. Logged in: `wrangler login`

---

## Step 1: Create R2 Bucket

```bash
# Create the bucket
wrangler r2 bucket create yajurveda-audio

# Verify
wrangler r2 bucket list
```

---

## Step 2: Upload Audio Files

**NOTE: Audio files have already been uploaded to R2 under the `MP3/` directory.**

The R2 bucket structure is:
```
yajurveda-audio/
└── MP3/
    ├── k1p1.mp3
    ├── k1p2.mp3
    └── ... (44 files total)
```

The Worker automatically maps requests:
- Website requests: `audio/k1p1.mp3`
- R2 path: `MP3/k1p1.mp3`

### If you need to re-upload files

Using wrangler:
```bash
cd /Users/hvina/Downloads/kymp3

# Upload all files to MP3/ folder in bucket
for file in *.mp3; do
  echo "Uploading $file..."
  wrangler r2 object put "yajurveda-audio/MP3/$file" --file="$file"
done

# Verify
wrangler r2 object list yajurveda-audio --prefix="MP3/"
```

---

## Step 3: Get R2 API Credentials (for rclone/AWS CLI)

1. Go to Cloudflare Dashboard > **R2 Object Storage**
2. Click **Manage R2 API Tokens**
3. Click **Create API token**
4. Name: `yajurveda-upload`
5. Permissions: **Object Read & Write**
6. Specify bucket: `yajurveda-audio`
7. Click **Create API Token**
8. Save the **Access Key ID** and **Secret Access Key**

Your Account ID is shown in the R2 dashboard URL or overview page.

---

## Step 4: Deploy the Worker

```bash
cd /Users/hvina/projects/yajurveda-sanatana/yajurveda-app/cloudflare

# Install dependencies
npm install

# Deploy
wrangler deploy
```

After deployment, you'll get a URL like:
```
https://yajurveda-audio.<your-subdomain>.workers.dev
```

---

## Step 5: Configure Allowed Domains

Edit `cloudflare/src/index.ts` and update the `ALLOWED_DOMAINS` array:

```typescript
const ALLOWED_DOMAINS = [
  'yajurveda.sanatana.in',     // Production domain
  'hvram1.github.io',          // GitHub Pages
  'localhost',                 // Local development
  '127.0.0.1'
];
```

Redeploy after changes:
```bash
wrangler deploy
```

---

## Step 6: Update Your Site Configuration

Edit `src/lib/config.ts`:

```typescript
export const AUDIO_CONFIG = {
  source: 'cloudflare' as const,  // Change from 'local' to 'cloudflare'
  cloudflareBaseUrl: 'https://yajurveda-audio.<your-subdomain>.workers.dev',
  localBasePath: '/audio',
};
```

Edit `src/lib/utils.ts` - update `getAudioUrl`:

```typescript
export function getAudioUrl(kanda: number, prasna: number): string {
  const filename = `k${kanda}p${prasna}.mp3`;
  
  if (AUDIO_CONFIG.source === 'cloudflare') {
    return `${AUDIO_CONFIG.cloudflareBaseUrl}/audio/${filename}`;
  }
  
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${AUDIO_CONFIG.localBasePath}/${filename}`;
}
```

Then rebuild your site:
```bash
npm run build
```

---

## Verification

Test the worker:

```bash
# Should return 403 (no referer)
curl -I https://yajurveda-audio.<your-subdomain>.workers.dev/audio/k1p1.mp3

# Should return 200 (with valid referer)
curl -I -H "Referer: https://yajurveda.sanatana.in/" \
  https://yajurveda-audio.<your-subdomain>.workers.dev/audio/k1p1.mp3
```

---

## Audio File Structure

| Kanda | Prasnas | Files |
|-------|---------|-------|
| 1 | 8 | k1p1.mp3 - k1p8.mp3 |
| 2 | 6 | k2p1.mp3 - k2p6.mp3 |
| 3 | 5 | k3p1.mp3 - k3p5.mp3 |
| 4 | 7 | k4p1.mp3 - k4p7.mp3 |
| 5 | 7 | k5p1.mp3 - k5p7.mp3 |
| 6 | 6 | k6p1.mp3 - k6p6.mp3 |
| 7 | 5 | k7p1.mp3 - k7p5.mp3 |

**Total: 44 MP3 files**

---

## Cost Estimate

| Resource | Free Tier | Your Usage | Cost |
|----------|-----------|------------|------|
| Storage | 10 GB | ~500 MB | $0 |
| Class A ops (writes) | 1M/month | ~44 (one-time) | $0 |
| Class B ops (reads) | 10M/month | varies | $0* |
| Egress | Unlimited | - | $0 |

*If you exceed 10M reads/month, it's $0.36 per million.

---

## Troubleshooting

### CORS Errors
The worker includes CORS headers. If issues persist, check browser console for specific errors.

### 403 Forbidden
- Check that your site's domain is in `ALLOWED_DOMAINS`
- Verify the referer header is being sent (some privacy extensions block it)

### Audio Not Loading
- Check browser network tab for the actual error
- Verify the file exists: `wrangler r2 object get yajurveda-audio/audio/k1p1.mp3 --file=/tmp/test.mp3`

### Worker Not Responding
- Check worker logs: `wrangler tail`
- Verify deployment: `wrangler deployments list`

---

## Rollback to Local Audio

1. Update `src/lib/config.ts`:
```typescript
source: 'local' as const,
```

2. Ensure symlink exists:
```bash
cd yajurveda-app/public
ln -sf /Users/hvina/Downloads/kymp3 audio
```

3. Rebuild the site

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Bucket Name | `yajurveda-audio` |
| Worker URL | `https://yajurveda-audio.<subdomain>.workers.dev` |
| Audio Path | `/audio/k{kanda}p{prasna}.mp3` |
| Total Files | 44 MP3 files |
| Config File | `src/lib/config.ts` |
| Worker Source | `cloudflare/src/index.ts` |
