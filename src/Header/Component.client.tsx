'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Media } from '@/payload-types'
import type { Tenant } from '@/providers/Tenant/types'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  tenant: Tenant | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, tenant }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // Get tenant logo URL if available
  const logoUrl =
    tenant?.logo && typeof tenant.logo !== 'string' ? (tenant.logo as Media).url : null

  return (
    <header
      className="relative z-20 bg-primary border-b border-primary"
      {...(mounted && theme ? { 'data-theme': theme } : {})}
    >
      <div className="container py-4 flex justify-between items-center">
        <Link href="/">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${tenant?.name} Logo`}
              className="max-w-[9.375rem] w-full h-[34px] object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          ) : (
            <img
              src="/svg/apex-logo.svg"
              alt="Apex Logo"
              className="max-w-[9.375rem] w-full h-[34px] object-contain"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          )}
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}
