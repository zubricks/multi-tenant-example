import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Tenant } from '@/providers/Tenant/types'

export async function getCurrentTenant(): Promise<Tenant | null> {
  const headersList = await headers()
  const tenantSlug = headersList.get('x-tenant-slug')

  if (!tenantSlug) {
    return null
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'clients',
      where: {
        slug: {
          equals: tenantSlug,
        },
      },
      limit: 1,
    })

    if (result.docs && result.docs.length > 0) {
      const client = result.docs[0]

      return {
        id: client.id,
        name: client.name,
        slug: client.slug,
        domain: client.domain,
        logo: client.logo,
        tagline: client.tagline,
        brandColors: client.brandColors,
        typography: client.typography,
        seoMetadata: client.seoMetadata,
        contactInfo: client.contactInfo,
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return null
  }
}
