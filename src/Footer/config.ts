import type { CollectionConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: CollectionConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Navigation',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Footer',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
