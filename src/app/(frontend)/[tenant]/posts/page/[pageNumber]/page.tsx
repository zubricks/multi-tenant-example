import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    tenant: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { tenant, pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    where: {
      'tenant.domain': {
        equals: tenant,
      },
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
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Website Template Posts Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const tenants = await payload.find({
    collection: 'brands',
    limit: 1000,
  })

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      tenant: true,
    },
  })

  // Group posts by tenant domain
  const tenantPostCounts = new Map<string, number>()

  for (const post of posts.docs) {
    if (typeof post.tenant === 'object' && post.tenant?.domain) {
      const currentCount = tenantPostCounts.get(post.tenant.domain) || 0
      tenantPostCounts.set(post.tenant.domain, currentCount + 1)
    }
  }

  const pages: { tenant: string; pageNumber: string }[] = []

  // Generate pages for each tenant based on their post count
  for (const [domain, count] of tenantPostCounts.entries()) {
    const totalPages = Math.ceil(count / 12)
    for (let i = 1; i <= totalPages; i++) {
      pages.push({ tenant: domain, pageNumber: String(i) })
    }
  }

  return pages
}
