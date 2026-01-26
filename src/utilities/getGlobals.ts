import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type TenantGlobal = 'header' | 'footer'

async function getTenantGlobal(slug: TenantGlobal, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  // For tenant-specific globals (which are actually collections with isGlobal: true),
  // we query the collection and get the first document for the current tenant
  const result = await payload.find({
    collection: slug,
    depth,
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: TenantGlobal, depth = 0) =>
  unstable_cache(async () => getTenantGlobal(slug, depth), [slug], {
    tags: [`global_${slug}`],
  })
