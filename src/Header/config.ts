import type { CollectionConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: CollectionConfig = {
  slug: 'header',
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
      defaultValue: 'Header',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'link',
          options: [
            {
              label: 'Link',
              value: 'link',
            },
            {
              label: 'Dropdown',
              value: 'dropdown',
            },
          ],
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        {
          name: 'dropdownLabel',
          type: 'text',
          label: 'Dropdown Label',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
          },
        },
        {
          name: 'dropdownType',
          type: 'radio',
          label: 'Dropdown Content',
          defaultValue: 'clients',
          options: [
            {
              label: 'All Clients',
              value: 'clients',
            },
            {
              label: 'Custom Links',
              value: 'custom',
            },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'dropdown',
            description:
              'Choose "All Clients" to automatically list all clients/tenants, or "Custom Links" for manual links',
          },
        },
        {
          name: 'dropdownLinks',
          type: 'array',
          label: 'Dropdown Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            condition: (_, siblingData) =>
              siblingData?.type === 'dropdown' && siblingData?.dropdownType === 'custom',
          },
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
