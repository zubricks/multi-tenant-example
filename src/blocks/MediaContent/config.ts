import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const MediaContent: Block = {
  slug: 'mediaContent',
  interfaceName: 'MediaContentBlock',
  fields: [
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'contentMedia',
      options: [
        {
          label: 'Content + Media',
          value: 'contentMedia',
        },
        {
          label: 'Media + Content',
          value: 'mediaContent',
        },
      ],
      admin: {
        description: 'Choose how to align the content for this block.',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Content',
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Upload an image or video for this block.',
      },
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Enable Call to Action',
    },
    link({
      overrides: {
        admin: {
          condition: (_data, siblingData) => {
            return Boolean(siblingData?.enableLink)
          },
        },
      },
    }),
  ],
}
