/**
 * Converts a hex color to HSL format for Tailwind CSS variables
 * @param hex - Hex color code (e.g., "#D4AF37" or "D4AF37")
 * @returns HSL string in Tailwind format (e.g., "47 96% 53%") or null if invalid
 */
export function hexToHsl(hex: string | null | undefined): string | null {
  if (!hex) return null

  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn(`Invalid hex color: ${hex}`)
    return null
  }

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // Find min and max values
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // Calculate lightness
  let l = (max + min) / 2

  // Calculate saturation
  let s = 0
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  }

  // Calculate hue
  let h = 0
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6
    } else {
      h = ((r - g) / delta + 4) / 6
    }
  }

  // Convert to degrees and percentages
  const hDeg = Math.round(h * 360)
  const sPercent = Math.round(s * 100)
  const lPercent = Math.round(l * 100)

  // Return in Tailwind format (no hsl() wrapper, space-separated)
  return `${hDeg} ${sPercent}% ${lPercent}%`
}
