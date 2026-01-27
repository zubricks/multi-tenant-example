import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: {
    // Allow public read access so middleware can look up tenants by domain
    // This is safe because we're only exposing basic branding info, not sensitive data
    read: () => true,
    // Restrict write operations to authenticated users only
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              index: true,
            },
            {
              name: 'domain',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                description:
                  'The domain for this brand (e.g., luxe-hotels.com or luxe-hotels.local for development)',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'Brand tagline or slogan',
              },
            },
          ],
        },
        {
          label: 'Brand Colors',
          fields: [
            {
              type: 'group',
              name: 'brandColors',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  admin: {
                    description: 'Primary brand color in hex format (e.g., "#D4AF37")',
                    placeholder: '#D4AF37',
                  },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  admin: {
                    description: 'Secondary brand color in hex format',
                    placeholder: '#0078D4',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  admin: {
                    description: 'Accent/highlight color in hex format',
                    placeholder: '#FF6B35',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  admin: {
                    description: 'Page background color in hex format',
                    placeholder: '#FFFFFF',
                  },
                },
                {
                  name: 'foregroundColor',
                  type: 'text',
                  admin: {
                    description: 'Text/foreground color in hex format',
                    placeholder: '#1A1A1A',
                  },
                },
                {
                  name: 'borderColor',
                  type: 'text',
                  admin: {
                    description: 'Border color in hex format',
                    placeholder: '#E5E7EB',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Typography',
          fields: [
            {
              type: 'group',
              name: 'typography',
              fields: [
                {
                  name: 'headingFont',
                  type: 'select',
                  defaultValue: 'inter',
                  options: [
                    { label: 'Inter', value: 'inter' },
                    { label: 'Playfair Display', value: 'playfair-display' },
                    { label: 'Montserrat', value: 'montserrat' },
                    { label: 'Raleway', value: 'raleway' },
                    { label: 'Poppins', value: 'poppins' },
                  ],
                  admin: {
                    description: 'Font family for headings (h1, h2, h3, etc.)',
                  },
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  defaultValue: 'inter',
                  options: [
                    { label: 'Inter', value: 'inter' },
                    { label: 'Open Sans', value: 'open-sans' },
                    { label: 'Lato', value: 'lato' },
                    { label: 'Roboto', value: 'roboto' },
                    { label: 'Source Sans 3', value: 'source-sans-3' },
                  ],
                  admin: {
                    description: 'Font family for body text and paragraphs',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              type: 'group',
              name: 'seoMetadata',
              fields: [
                {
                  name: 'siteTitle',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'The site title used in browser tabs and SEO',
                  },
                },
                {
                  name: 'siteDescription',
                  type: 'textarea',
                  admin: {
                    description: 'Default meta description for SEO',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Default Open Graph image for social sharing',
                  },
                },
                {
                  name: 'favicon',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Custom favicon for this brand',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact Information',
          fields: [
            {
              type: 'group',
              name: 'contactInfo',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
