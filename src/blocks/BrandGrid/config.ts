import type { Block } from 'payload'

export const BrandGridBlock: Block = {
  slug: 'brandGrid',
  interfaceName: 'BrandGridBlock',
  labels: {
    singular: 'Brand Grid',
    plural: 'Brand Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Portfolio of Brands',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'From luxury escapes to comfortable business stays, discover the perfect brand for your travel needs.',
    },
    {
      name: 'brands',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
