import type { CollectionSlug, PayloadRequest } from 'payload'
import type { Brand } from '@/payload-types'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  data?: {
    tenant?: string | Brand | null
  }
}

export const generatePreviewPath = async ({ collection, slug, req, data }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Get tenant domain from the data
  let tenantDomain: string | null = null

  if (data?.tenant) {
    // If tenant is already populated as an object, use its domain
    if (typeof data.tenant === 'object' && data.tenant.domain) {
      tenantDomain = data.tenant.domain
    }
    // Otherwise, it's an ID - fetch the brand to get the domain
    else if (typeof data.tenant === 'string') {
      try {
        const brand = await req.payload.findByID({
          collection: 'brands',
          id: data.tenant,
        })
        tenantDomain = brand?.domain || null
      } catch (error) {
        req.payload.logger.error({ err: error, msg: 'Error fetching brand for preview path' })
      }
    }
  }

  // If we can't determine tenant, return null to avoid showing wrong content
  if (!tenantDomain) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // Determine if we're using domain-based routing (hosts file) or path-based routing (localhost)
  const host = req.headers.get('host') || ''
  const isLocalhost = host.startsWith('localhost')

  // Build the full path and preview URL based on routing approach
  let fullPath: string
  let previewUrl: string

  if (isLocalhost) {
    // Path-based routing: include tenant in the path
    fullPath = `/${tenantDomain}${collectionPrefixMap[collection]}/${encodedSlug}`
    previewUrl = `/${tenantDomain}/next/preview`
  } else {
    // Domain-based routing: tenant is in the domain, not the path
    fullPath = `${collectionPrefixMap[collection]}/${encodedSlug}`
    previewUrl = '/next/preview'
  }

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: fullPath,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  return `${previewUrl}?${encodedParams.toString()}`
}
