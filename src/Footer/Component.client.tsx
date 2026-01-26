'use client'

import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'
import type { Tenant } from '@/providers/Tenant/types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Media } from '@/components/Media'
import { hexToHsl } from '@/utilities/hexToHsl'

interface FooterClientProps {
  data: Footer
  tenant: Tenant | null
}

export const FooterClient: React.FC<FooterClientProps> = ({ data, tenant }) => {
  const navItems = data?.navItems || []

  // Get tenant primary color in HSL format
  const primaryColorHex = tenant?.brandColors?.primaryColor
  const primaryColorHsl = primaryColorHex ? hexToHsl(primaryColorHex) : null
  const backgroundColor = primaryColorHsl ? `hsl(${primaryColorHsl})` : undefined

  // Get tenant logo if available
  const tenantLogo = tenant?.logo

  return (
    <footer
      className="mt-auto border-t border-border dark:bg-card text-white"
      style={{ backgroundColor }}
    >
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          {tenantLogo && typeof tenantLogo === 'object' ? (
            <Media
              resource={tenantLogo}
              className="max-w-[9.375rem] h-[34px]"
              imgClassName="w-full h-full object-contain"
            />
          ) : (
            <Logo />
          )}
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
