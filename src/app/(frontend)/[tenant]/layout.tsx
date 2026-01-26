import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { TenantStyles } from '@/components/TenantStyles'
import { TenantFonts } from '@/components/TenantFonts'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { TenantProvider } from '@/providers/Tenant'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{
    tenant: string
  }>
}

export default async function RootLayout({ children, params: paramsPromise }: LayoutProps) {
  const { isEnabled } = await draftMode()
  const { tenant: tenantDomain } = await paramsPromise

  // Fetch tenant data
  const payload = await getPayload({ config: configPromise })
  const tenantResult = await payload.find({
    collection: 'clients',
    where: {
      domain: {
        equals: tenantDomain,
      },
    },
    limit: 1,
  })

  const tenant = tenantResult.docs?.[0]
    ? {
        id: tenantResult.docs[0].id,
        name: tenantResult.docs[0].name,
        slug: tenantResult.docs[0].slug,
        domain: tenantResult.docs[0].domain,
        logo: tenantResult.docs[0].logo,
        tagline: tenantResult.docs[0].tagline,
        brandColors: tenantResult.docs[0].brandColors,
        typography: tenantResult.docs[0].typography,
        seoMetadata: tenantResult.docs[0].seoMetadata,
        contactInfo: tenantResult.docs[0].contactInfo,
      }
    : null

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <TenantFonts tenant={tenant} />
        <TenantStyles tenant={tenant} />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <TenantProvider tenant={tenant}>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header tenant={tenant} />
            {children}
            <Footer tenant={tenant} />
          </TenantProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
