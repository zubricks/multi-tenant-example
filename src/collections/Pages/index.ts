import type { CollectionConfig, TextField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { AmenitiesBlock } from '../../blocks/Amenities/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { BrandGridBlock } from '../../blocks/BrandGrid/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { ImageGalleryBlock } from '../../blocks/ImageGallery/config'
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
          data,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
        data,
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
              blocks: [CallToAction, Content, MediaBlock, MediaContent, AmenitiesBlock, BrandGridBlock, Archive, FormBlock, ImageGalleryBlock],
              required: true,
              admin: {
                initCollapsed: true,
                components: {
                  Field: '/collections/Pages/components/TenantAwareBlocksField#TenantAwareBlocksField',
                },
              },
              validate: async (value, { data, req }) => {
                const pageData = data as { tenant?: string | number }
                const blocksValue = value as Array<{ blockType: string }> | undefined

                // Skip validation if no tenant or no blocks
                if (!pageData?.tenant || !blocksValue || blocksValue.length === 0) {
                  return true
                }

                try {
                  // Fetch the brand/tenant to check allowed blocks
                  const brand = await req.payload.findByID({
                    collection: 'brands',
                    id: pageData.tenant,
                  })

                  // If allowedBlocks is not set or empty, allow all blocks
                  if (!brand.allowedBlocks || brand.allowedBlocks.length === 0) {
                    return true
                  }

                  // Check each block in the layout
                  const invalidBlocks: string[] = []
                  for (const block of blocksValue) {
                    if (!(brand.allowedBlocks as string[]).includes(block.blockType)) {
                      invalidBlocks.push(block.blockType)
                    }
                  }

                  if (invalidBlocks.length > 0) {
                    const blockNames = invalidBlocks.map(slug => {
                      // Map slugs to friendly names
                      const nameMap: Record<string, string> = {
                        cta: 'Call to Action',
                        content: 'Content',
                        mediaBlock: 'Media Block',
                        mediaContent: 'Media Content',
                        amenities: 'Amenities',
                        brandGrid: 'Brand Grid',
                        archive: 'Archive',
                        formBlock: 'Form',
                        imageGallery: 'Image Gallery',
                      }
                      return nameMap[slug] || slug
                    }).join(', ')

                    return `This brand does not have access to the following blocks: ${blockNames}`
                  }

                  return true
                } catch (error) {
                  // If we can't fetch the brand, allow the blocks (fail open)
                  console.error('Error validating blocks:', error)
                  return true
                }
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
