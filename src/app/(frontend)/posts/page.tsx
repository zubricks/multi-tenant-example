import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const tenantSlug = headersList.get('x-tenant-slug')

  // Get tenant ID if we have a tenant slug
  let tenantId: string | undefined
  if (tenantSlug) {
    const tenantResult = await payload.find({
      collection: 'clients',
      where: {
        slug: {
          equals: tenantSlug,
        },
      },
      limit: 1,
    })
    tenantId = tenantResult.docs?.[0]?.id
  }

  const whereClause: any = {}

  // Add tenant filter if we have a tenant ID
  if (tenantId) {
    whereClause.tenant = {
      equals: tenantId,
    }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: whereClause,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Posts</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
