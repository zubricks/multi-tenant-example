import type { Media } from '@/payload-types'

export interface TenantColors {
  primaryColor?: string | null
  secondaryColor?: string | null
  accentColor?: string | null
  backgroundColor?: string | null
  foregroundColor?: string | null
  borderColor?: string | null
}

export interface TenantMetadata {
  siteTitle: string
  siteDescription?: string | null
  ogImage?: string | Media | null
  favicon?: string | Media | null
}

export interface TenantContactInfo {
  contactEmail?: string | null
  contactPhone?: string | null
}

export interface TenantTypography {
  headingFont?: string | null
  bodyFont?: string | null
}

export interface Tenant {
  id: string
  name: string
  slug: string
  domain: string
  logo?: string | Media | null
  tagline?: string | null
  brandColors?: TenantColors | null
  typography?: TenantTypography | null
  seoMetadata?: TenantMetadata | null
  contactInfo?: TenantContactInfo | null
}
