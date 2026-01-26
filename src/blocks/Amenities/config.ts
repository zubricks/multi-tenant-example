import type { Block } from 'payload'

export const AmenitiesBlock: Block = {
  slug: 'amenities',
  interfaceName: 'AmenitiesBlock',
  labels: {
    singular: 'Amenities Block',
    plural: 'Amenities Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Amenities',
      admin: {
        description: 'Heading displayed above the amenities grid',
      },
    },
    {
      name: 'amenities',
      type: 'relationship',
      relationTo: 'amenities',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select the amenities offered at this location',
      },
    },
  ],
}
