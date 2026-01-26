import type { CollectionConfig, TextField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { AmenitiesBlock } from '../../blocks/Amenities/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { BrandGridBlock } from '../../blocks/BrandGrid/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MediaContent } from '../../blocks/MediaContent/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // Compound unique index for slug + tenant (allows same slug across different tenants)
  indexes: [
    {
      fields: ['slug', 'tenant'],
      unique: true,
    },
  ],
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'tenant', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, MediaContent, AmenitiesBlock, BrandGridBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField({
      overrides: (field) => {
        // Remove global unique constraint - use compound index instead
        const slugTextField = field.fields[1] as TextField
        slugTextField.unique = false
        return field
      },
    }),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    beforeValidate: [
      async ({ data, operation, req }) => {
        // When creating a new page (duplicate operation)
        if (operation === 'create' && data?.slug) {
          // Check if slug already exists for this tenant
          const existingPage = await req.payload.find({
            collection: 'pages',
            where: {
              slug: { equals: data.slug },
              tenant: { equals: data.tenant },
            },
            limit: 1,
          })

          // If duplicate found, append -copy (and increment if needed)
          if (existingPage.docs.length > 0) {
            let newSlug = `${data.slug}-copy`
            let counter = 1

            // Keep checking until we find a unique slug
            while (true) {
              const check = await req.payload.find({
                collection: 'pages',
                where: {
                  slug: { equals: newSlug },
                  tenant: { equals: data.tenant },
                },
                limit: 1,
              })

              if (check.docs.length === 0) break
              newSlug = `${data.slug}-copy-${counter}`
              counter++
            }

            data.slug = newSlug
          }
        }
        return data
      },
    ],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
