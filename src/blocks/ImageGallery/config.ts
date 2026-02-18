import type { Block } from 'payload'

export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: {
    singular: 'Image Gallery',
    plural: 'Image Galleries',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional heading displayed above the gallery',
      },
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          admin: {
            description: 'Optional caption for this image',
          },
        },
      ],
      admin: {
        description: 'Add images to display in the gallery slider',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Automatically advance slides',
      },
    },
    {
      name: 'autoplaySpeed',
      type: 'number',
      defaultValue: 5000,
      admin: {
        description: 'Time between slides (in milliseconds)',
        condition: (_, siblingData) => siblingData?.autoplay === true,
      },
    },
  ],
}
