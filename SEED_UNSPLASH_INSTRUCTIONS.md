# Adding Unsplash Images to Multi-Tenant Seed

## Changes Needed to `/src/endpoints/seed/multi-tenant-seed.ts`

### 1. Add Unsplash image sets at the top (after globals definition, around line 17):

```typescript
// Unsplash image IDs for hotel/travel themed images
const unsplashImageSets = [
  ['KtOid0FLjqU', 'HQaZKCDaax0', '0qvBNep1Y04', 'yGPxCYPS8H4'], // Luxe
  ['kDpT8DalqXs', 'e3OUQGT9bWU', 'yCW4nEm7gRg', 'MdJq0zFUwrw'], // Comfort
  ['W49tMyNy4uk', 'D5nh6mCW52c', 'HH4WBGNyltc', 'Xq1ntWruZQI'], // Budget
  ['whJ8wT-fYkw', 'Mv9hjnEUHR4', 'uRUrNsuoGbA', 'kMr7DKRd-vw'], // Grand Plaza
  ['NodtnCsLdTE', 'qfjX4SBTX2U', 'S-YssWw00G0', 'yBzrPGLjMQw'], // Coastal
  ['G4xM8nPmKEQ', 'bjhrzvzZMa0', 'WEQbe2jBg40', 'KZNTEn2r9Gw'], // Urban
  ['73F4pKoUkM0', 'sfL_QOnmy00', 'eOpewngf68w', 'K2td5hI-5-8'], // Mountain
  ['Pse8xc8wvuo', 'sO-JmQj95ec', 'TrhLCn1abMU', 'pYWuOMhtc6k'], // Metro
  ['t20pc32VbrU', 'bku_bxGBcdI', 'zzFRvHHxJCc', 'lV6NRy0EpXE'], // Family
  ['vUNQaTtZeOo', 'lMzaKx-xYO0', 'BNvk1zqEAjc', 'JvA4fYmM3kM'], // Boutique
]
```

### 2. Add `imageSet` property to each tenant in `tenantData`:

Add `imageSet: 0` to Luxe Hotels
Add `imageSet: 1` to Comfort Stays  
Add `imageSet: 2` to Budget Inn
... and so on for all 10 tenants (0-9)

### 3. Replace the image fetching section (around line 260-290):

FIND the section that looks like:
```typescript
  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    // ... more fetchFileByURL calls
  ])
```

REPLACE with:
```typescript
  // This section moves inside the tenant loop - remove it from here
```

### 4. Update the tenant creation loop (around line 310):

FIND:
```typescript
  for (const tenant of tenantData) {
    payload.logger.info(`  → Creating tenant: ${tenant.name}`)
```

REPLACE with:
```typescript
  for (let i = 0; i < tenantData.length; i++) {
    const tenant = tenantData[i]
    payload.logger.info(`  → Creating tenant ${i + 1}/${tenantData.length}: ${tenant.name}`)

    // Fetch unique images for this tenant
    payload.logger.info(`    → Fetching images for ${tenant.name}`)
    const imageIds = unsplashImageSets[tenant.imageSet]
    
    const [heroBuffer, image1Buffer, image2Buffer, image3Buffer] = await Promise.all([
      fetchUnsplashImage(imageIds[0], 1920, 1080),
      fetchUnsplashImage(imageIds[1], 1200, 800),
      fetchUnsplashImage(imageIds[2], 1200, 800),
      fetchUnsplashImage(imageIds[3], 1200, 800),
    ])

    const [heroImage, image1Doc, image2Doc, image3Doc] = await Promise.all([
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Hero` },
        file: heroBuffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Image 1` },
        file: image1Buffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Image 2` },
        file: image2Buffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Image 3` },
        file: image3Buffer,
      }),
    ])

    // Continue with client creation...
```

### 5. Replace the old `fetchFileByURL` function at the end:

FIND:
```typescript
async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })
  // ...
}
```

REPLACE with:
```typescript
async function fetchUnsplashImage(imageId: string, width: number, height: number): Promise<File> {
  const url = `https://source.unsplash.com/${imageId}/${width}x${height}`
  
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch image from Unsplash: ${imageId}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: `${imageId}.jpg`,
    data: Buffer.from(data),
    mimetype: 'image/jpeg',
    size: data.byteLength,
  }
}
```

### 6. Update hero image references in page creation:

FIND (in the home page creation):
```typescript
media: imageHomeDoc.id,
```

REPLACE with:
```typescript
media: heroImage.id,
```

And in meta:
```typescript
image: heroImage.id,
```

## Result

Each of the 10 brands will now have 4 unique images:
- 1 hero image (1920x1080)
- 3 post/content images (1200x800)

Total: 40 unique hotel/travel images across all brands!
