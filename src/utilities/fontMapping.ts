/**
 * Maps font slugs to Google Font family names and CSS variable names
 */

export type FontSlug =
  | 'inter'
  | 'playfair-display'
  | 'montserrat'
  | 'raleway'
  | 'poppins'
  | 'open-sans'
  | 'lato'
  | 'roboto'
  | 'source-sans-3'

export interface FontConfig {
  family: string // Google Font family name
  weights: number[] // Font weights to load
  cssVariable: string // CSS font-family value
}

export const fontMapping: Record<FontSlug, FontConfig> = {
  inter: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    cssVariable: "'Inter', sans-serif",
  },
  'playfair-display': {
    family: 'Playfair Display',
    weights: [400, 500, 600, 700],
    cssVariable: "'Playfair Display', serif",
  },
  montserrat: {
    family: 'Montserrat',
    weights: [400, 500, 600, 700],
    cssVariable: "'Montserrat', sans-serif",
  },
  raleway: {
    family: 'Raleway',
    weights: [400, 500, 600, 700],
    cssVariable: "'Raleway', sans-serif",
  },
  poppins: {
    family: 'Poppins',
    weights: [400, 500, 600, 700],
    cssVariable: "'Poppins', sans-serif",
  },
  'open-sans': {
    family: 'Open Sans',
    weights: [400, 500, 600, 700],
    cssVariable: "'Open Sans', sans-serif",
  },
  lato: {
    family: 'Lato',
    weights: [400, 700],
    cssVariable: "'Lato', sans-serif",
  },
  roboto: {
    family: 'Roboto',
    weights: [400, 500, 700],
    cssVariable: "'Roboto', sans-serif",
  },
  'source-sans-3': {
    family: 'Source Sans 3',
    weights: [400, 600, 700],
    cssVariable: "'Source Sans 3', sans-serif",
  },
}

/**
 * Generates a Google Fonts URL for the given font slugs
 */
export function generateGoogleFontsUrl(fontSlugs: FontSlug[]): string {
  const uniqueFonts = [...new Set(fontSlugs)]
  const fontParams = uniqueFonts
    .map((slug) => {
      const config = fontMapping[slug]
      if (!config) return null

      const weightsString = config.weights.join(';')
      // Format: family:wght@400;500;600;700
      return `family=${encodeURIComponent(config.family)}:wght@${weightsString}`
    })
    .filter(Boolean)
    .join('&')

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`
}
