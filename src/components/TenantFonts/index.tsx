import React from 'react'
import { generateGoogleFontsUrl, type FontSlug } from '@/utilities/fontMapping'
import type { Tenant } from '@/providers/Tenant/types'

interface TenantFontsProps {
  tenant: Tenant | null
}

/**
 * Server component that injects Google Fonts link based on tenant typography settings
 */
export function TenantFonts({ tenant }: TenantFontsProps) {
  if (!tenant?.typography) {
    return null
  }

  const { headingFont, bodyFont } = tenant.typography

  // Collect unique fonts to load
  const fontsToLoad: FontSlug[] = []

  if (headingFont && isValidFontSlug(headingFont)) {
    fontsToLoad.push(headingFont as FontSlug)
  }

  if (bodyFont && isValidFontSlug(bodyFont)) {
    // Only add if different from heading font
    if (bodyFont !== headingFont) {
      fontsToLoad.push(bodyFont as FontSlug)
    }
  }

  // If no fonts selected, don't inject anything
  if (fontsToLoad.length === 0) {
    return null
  }

  const googleFontsUrl = generateGoogleFontsUrl(fontsToLoad)

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={googleFontsUrl} rel="stylesheet" />
    </>
  )
}

/**
 * Type guard to check if a string is a valid FontSlug
 */
function isValidFontSlug(slug: string): boolean {
  const validSlugs = [
    'inter',
    'playfair-display',
    'montserrat',
    'raleway',
    'poppins',
    'open-sans',
    'lato',
    'roboto',
    'source-sans-3',
  ]
  return validSlugs.includes(slug)
}
