import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Apex Hospitality Group',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A portfolio of distinctive hotel brands, each offering unique experiences tailored to every traveler.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  meta: {
    description:
      'Multi-tenant Payload CMS example - manage 10 hotel brands from a single codebase with Next.js.',
    title: 'Multi-Tenant Demo - Payload + Next.js',
  },
  title: 'Home',
  layout: [
    {
      blockType: 'content',
      columns: [
        {
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Benefits of Payload Multi-tenant for parent companies & brands',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h2',
                  version: 1,
                },
                {
                  type: 'list',
                  children: [
                    {
                      type: 'listitem',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: '10 websites using a single Payload instance',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                    {
                      type: 'listitem',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'NextJS app facilitates routing to different pages or domains per tenant',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                    {
                      type: 'listitem',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Payload stores color palette, metadata, logo, etc. per tenant',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                    {
                      type: 'listitem',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Deploy once and all 10 websites go live simultaneously',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                    {
                      type: 'listitem',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Add a feature once, all 10 websites get access to the feature',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  listType: 'bullet',
                  start: 1,
                  tag: 'ul',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'full',
        },
      ],
    },
    {
      blockType: 'brandGrid',
      heading: 'Our Portfolio of Brands',
      description:
        'From luxury escapes to comfortable business stays, discover the perfect brand for your travel needs.',
      brands: [
        {
          name: 'Luxe Hotels',
          tagline: 'Where luxury meets elegance',
          url: 'http://luxe-hotels.local:3000',
        },
        {
          name: 'Comfort Stays',
          tagline: 'Comfort for every journey',
          url: 'http://comfort-stays.local:3000',
        },
        {
          name: 'Budget Inn',
          tagline: 'Affordable stays, great memories',
          url: 'http://budget-inn.local:3000',
        },
        {
          name: 'Grand Plaza Suites',
          tagline: 'Experience grandeur and sophistication',
          url: 'http://grand-plaza.local:3000',
        },
        {
          name: 'Coastal Resort & Spa',
          tagline: 'Beachfront paradise and relaxation',
          url: 'http://coastal-retreat.local:3000',
        },
        {
          name: 'Urban Lofts',
          tagline: 'Modern living in the heart of the city',
          url: 'http://urban-loft.local:3000',
        },
        {
          name: 'Mountain Lodge Retreats',
          tagline: 'Alpine serenity and adventure',
          url: 'http://mountain-view.local:3000',
        },
        {
          name: 'Metro Business Hotel',
          tagline: 'Professional accommodations for business travelers',
          url: 'http://metro-business.local:3000',
        },
        {
          name: 'Family Inn & Suites',
          tagline: 'Perfect for family vacations and gatherings',
          url: 'http://family-inn.local:3000',
        },
        {
          name: 'Boutique Central',
          tagline: 'Unique experiences, personal touch',
          url: 'http://boutique-central.local:3000',
        },
      ],
    },
    {
      blockType: 'content',
      columns: [
        {
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  children: [
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Get Started',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  tag: 'h2',
                  version: 1,
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'link',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Visit the admin dashboard',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      fields: {
                        linkType: 'custom',
                        newTab: false,
                        url: '/admin',
                      },
                      format: '',
                      indent: 0,
                      version: 2,
                    },
                    {
                      type: 'text',
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: ' to seed the database with all 10 demo brands and explore the multi-tenant setup.',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  textFormat: 0,
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
          size: 'full',
        },
      ],
    },
  ],
}
