import React from 'react'
import type { Tenant } from '@/providers/Tenant/types'
import { hexToHsl } from '@/utilities/hexToHsl'
import { fontMapping, type FontSlug } from '@/utilities/fontMapping'

interface TenantStylesProps {
  tenant: Tenant | null
}

export const TenantStyles: React.FC<TenantStylesProps> = ({ tenant }) => {
  if (!tenant?.brandColors && !tenant?.typography) {
    return null
  }

  const { brandColors, typography } = tenant

  // Build CSS variable overrides, converting hex to HSL
  const cssVariables: string[] = []

  // Brand colors
  if (brandColors) {
    const primaryHsl = hexToHsl(brandColors.primaryColor)
    if (primaryHsl) {
      cssVariables.push(`--primary: ${primaryHsl};`)
      // Set primary-foreground to white for better contrast on buttons
      cssVariables.push(`--primary-foreground: 0 0% 100%;`)
    }

    const secondaryHsl = hexToHsl(brandColors.secondaryColor)
    if (secondaryHsl) {
      cssVariables.push(`--secondary: ${secondaryHsl};`)
    }

    const accentHsl = hexToHsl(brandColors.accentColor)
    if (accentHsl) {
      cssVariables.push(`--accent: ${accentHsl};`)
    }

    const backgroundHsl = hexToHsl(brandColors.backgroundColor)
    if (backgroundHsl) {
      cssVariables.push(`--background: ${backgroundHsl};`)
    }

    const foregroundHsl = hexToHsl(brandColors.foregroundColor)
    if (foregroundHsl) {
      cssVariables.push(`--foreground: ${foregroundHsl};`)
    }

    // Note: We intentionally don't override --border to keep borders neutral
    // Branded borders don't look good on all components
  }

  // Typography fonts
  if (typography) {
    if (typography.headingFont && fontMapping[typography.headingFont as FontSlug]) {
      const headingFontConfig = fontMapping[typography.headingFont as FontSlug]
      cssVariables.push(`--font-heading: ${headingFontConfig.cssVariable};`)
    }

    if (typography.bodyFont && fontMapping[typography.bodyFont as FontSlug]) {
      const bodyFontConfig = fontMapping[typography.bodyFont as FontSlug]
      cssVariables.push(`--font-body: ${bodyFontConfig.cssVariable};`)
    }
  }

  if (cssVariables.length === 0) {
    return null
  }

  // Generate the style tag with CSS variables for both light and dark themes
  const cssContent = `:root {\n  ${cssVariables.join('\n  ')}\n}\n\n[data-theme='dark'] {\n  ${cssVariables.join('\n  ')}\n}`

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: cssContent,
      }}
    />
  )
}
