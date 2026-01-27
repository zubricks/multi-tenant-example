import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'brands',
]

const tenantGlobalCollections: CollectionSlug[] = ['header', 'footer']

// Unsplash image IDs for hotel/travel themed images
const unsplashImageSets = [
  ['KtOid0FLjqU', 'HQaZKCDaax0', '0qvBNep1Y04', 'yGPxCYPS8H4'], // Luxe
  ['W49tMyNy4uk', 'D5nh6mCW52c', 'HH4WBGNyltc', 'Xq1ntWruZQI'], // Budget
  ['kDpT8DalqXs', 'e3OUQGT9bWU', 'yCW4nEm7gRg', 'MdJq0zFUwrw'], // Comfort
]

// Define 3 hotel brands with unique colors and characteristics
const tenantData = [
  {
    name: 'Luxe Hotels',
    slug: 'luxe-hotels',
    domain: 'luxe-hotels.local',
    tagline: 'Where luxury meets elegance',
    imageSet: 0,
    logoFile: 'luxe.svg',
    colors: {
      primaryColor: '#D4AF37', // Gold
      secondaryColor: '#1A1A1A', // Black
      accentColor: '#8B7355', // Bronze
      backgroundColor: '#FFFFFF',
      foregroundColor: '#1A1A1A',
      borderColor: '#D4AF37',
    },
    fonts: {
      headingFont: 'playfair-display',
      bodyFont: 'lato',
    },
  },
  {
    name: 'Budget Inn',
    slug: 'budget-inn',
    domain: 'budget-inn.local',
    tagline: 'Affordable stays, great memories',
    imageSet: 1,
    logoFile: 'budget.svg',
    colors: {
      primaryColor: '#28A745', // Green
      secondaryColor: '#FF6B35', // Orange
      accentColor: '#FFC107', // Yellow
      backgroundColor: '#FFFFFF',
      foregroundColor: '#333333',
      borderColor: '#28A745',
    },
    fonts: {
      headingFont: 'montserrat',
      bodyFont: 'roboto',
    },
  },
  {
    name: 'Comfort Stays',
    slug: 'comfort-stays',
    domain: 'comfort-stays.local',
    tagline: 'Comfort for every journey',
    imageSet: 2,
    logoFile: 'comfort.svg',
    colors: {
      primaryColor: '#0078D4', // Blue
      secondaryColor: '#FFFFFF', // White
      accentColor: '#50E3C2', // Turquoise
      backgroundColor: '#F5F5F5',
      foregroundColor: '#212121',
      borderColor: '#0078D4',
    },
    fonts: {
      headingFont: 'inter',
      bodyFont: 'open-sans',
    },
  },
]

export const seedMultiTenant = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding multi-tenant database...')

  payload.logger.info(`— Clearing collections and globals...`)

  // Clear the database
  await Promise.all(
    [...collections, ...tenantGlobalCollections].map((collection) =>
      payload.db.deleteMany({ collection, req, where: {} }),
    ),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@example.com',
      password: 'password',
      roles: ['user'],
    },
  })

  payload.logger.info(`— Seeding categories...`)

  const categoryNames = ['Destinations', 'Travel Tips', 'Hotel News', 'Events', 'Offers', 'Guides']
  const categories = await Promise.all(
    categoryNames.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category.toLowerCase().replace(/\s+/g, '-'),
        },
        draft: false,
      }),
    ),
  )

  payload.logger.info(`— Seeding tenants and their content...`)

  // Create each tenant with their content
  for (let i = 0; i < tenantData.length; i++) {
    const tenant = tenantData[i]
    payload.logger.info(`  → Creating tenant ${i + 1}/${tenantData.length}: ${tenant.name}`)

    // Fetch unique images for this tenant (sequentially to avoid rate limiting)
    payload.logger.info(`    → Fetching images and logo for ${tenant.name}`)
    const imageIds = unsplashImageSets[tenant.imageSet]

    // Load logo from public/svg folder
    const logoBuffer = await fetchLogoFromPublicFolder(tenant.logoFile)
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms delay

    // Fetch images one at a time with delays to avoid 503 errors
    const heroBuffer = await fetchUnsplashImage(imageIds[0], 1920, 1080)
    await new Promise((resolve) => setTimeout(resolve, 500)) // 500ms delay
    const image1Buffer = await fetchUnsplashImage(imageIds[1], 1200, 800)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const image2Buffer = await fetchUnsplashImage(imageIds[2], 1200, 800)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const image3Buffer = await fetchUnsplashImage(imageIds[3], 1200, 800)

    const [logoDoc, heroImage, image1Doc, image2Doc, image3Doc] = await Promise.all([
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Logo` },
        file: logoBuffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Hero` },
        file: heroBuffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Image 1` },
        file: image1Buffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Image 2` },
        file: image2Buffer,
      }),
      payload.create({
        collection: 'media',
        data: { alt: `${tenant.name} Image 3` },
        file: image3Buffer,
      }),
    ])

    // Create tenant/brand
    const brand = await payload.create({
      collection: 'brands',
      data: {
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain,
        tagline: tenant.tagline,
        logo: logoDoc.id,
        brandColors: tenant.colors,
        typography: {
          headingFont: tenant.fonts.headingFont as 'inter' | 'playfair-display' | 'montserrat' | 'raleway' | 'poppins',
          bodyFont: tenant.fonts.bodyFont as 'inter' | 'open-sans' | 'lato' | 'roboto' | 'source-sans-3',
        },
        seoMetadata: {
          siteTitle: `${tenant.name} - ${tenant.tagline}`,
          siteDescription: `Experience exceptional hospitality at ${tenant.name}. ${tenant.tagline}`,
        },
        contactInfo: {
          contactEmail: `info@${tenant.slug}.com`,
          contactPhone: '1-800-HOTELS',
        },
      },
    })

    // Create 3 posts for this tenant
    payload.logger.info(`    → Creating posts for ${tenant.name}`)

    const post1 = await payload.create({
      collection: 'posts',
      data: {
        title: `Welcome to ${tenant.name}`,
        slug: `welcome`,
        tenant: brand.id,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        authors: [demoAuthor.id],
        categories: [categories[0].id],
        heroImage: image1Doc.id,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: `Discover the unique experience that ${tenant.name} has to offer. ${tenant.tagline}`,
                  },
                ],
              },
            ],
          },
        },
        meta: {
          title: `Welcome to ${tenant.name}`,
          description: `Learn more about ${tenant.name} and what makes us special.`,
          image: image1Doc.id,
        },
      },
    })

    const post2 = await payload.create({
      collection: 'posts',
      data: {
        title: `Top Amenities at ${tenant.name}`,
        slug: `amenities`,
        tenant: brand.id,
        _status: 'published',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        authors: [demoAuthor.id],
        categories: [categories[1].id],
        heroImage: image2Doc.id,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: `Explore the exceptional amenities available at ${tenant.name}. From world-class facilities to personalized services, we ensure your stay is comfortable and memorable.`,
                  },
                ],
              },
            ],
          },
        },
        meta: {
          title: `Top Amenities at ${tenant.name}`,
          description: `Discover all the amenities we offer at ${tenant.name}.`,
          image: image2Doc.id,
        },
        relatedPosts: [post1.id],
      },
    })

    const post3 = await payload.create({
      collection: 'posts',
      data: {
        title: `Special Offers from ${tenant.name}`,
        slug: `offers`,
        tenant: brand.id,
        _status: 'published',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        authors: [demoAuthor.id],
        categories: [categories[4].id],
        heroImage: image3Doc.id,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: `Don't miss out on our exclusive offers and packages at ${tenant.name}. Book now and experience luxury at unbeatable prices.`,
                  },
                ],
              },
            ],
          },
        },
        meta: {
          title: `Special Offers from ${tenant.name}`,
          description: `Check out the latest deals and offers from ${tenant.name}.`,
          image: image3Doc.id,
        },
        relatedPosts: [post1.id, post2.id],
      },
    })

    // Update posts with related posts
    await payload.update({
      id: post1.id,
      collection: 'posts',
      data: {
        relatedPosts: [post2.id, post3.id],
      },
    })

    // Create contact form for this tenant
    const contactForm = await payload.create({
      collection: 'forms',
      depth: 0,
      data: contactFormData,
    })

    // Create pages for this tenant
    payload.logger.info(`    → Creating pages for ${tenant.name}`)

    // Home page
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: `home`,
        tenant: brand.id,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        hero: {
          type: 'highImpact',
          media: heroImage.id,
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [
                    {
                      type: 'text',
                      text: `Large hero heading for ${tenant.name}`,
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: tenant.tagline,
                    },
                  ],
                },
              ],
            },
          },
          links: [
            {
              link: {
                type: 'custom',
                label: 'View Rooms',
                url: '#rooms',
                appearance: 'default',
              },
            },
            {
              link: {
                type: 'custom',
                label: 'Contact Us',
                url: '/contact',
                appearance: 'outline',
              },
            },
          ],
        },
        layout: [
          {
            blockType: 'content',
            blockName: 'Welcome',
            columns: [
              {
                size: 'full',
                textAlign: 'center',
                richText: {
                  root: {
                    type: 'root',
                    children: [
                      {
                        type: 'heading',
                        tag: 'h2',
                        children: [
                          {
                            type: 'text',
                            text: `Welcome to ${tenant.name}`,
                          },
                        ],
                      },
                      {
                        type: 'paragraph',
                        children: [
                          {
                            type: 'text',
                            text: `Experience hospitality at its finest. ${tenant.tagline}`,
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            blockType: 'mediaContent',
            blockName: 'About Us - Content + Media',
            alignment: 'contentMedia',
            media: image1Doc.id,
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'Exceptional Service',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Our dedicated team ensures every guest receives personalized attention and care.',
                      },
                    ],
                  },
                ],
              },
            },
            links: [
              {
                link: {
                  type: 'custom',
                  label: 'Learn More',
                  url: '/about',
                  appearance: 'default',
                },
              },
            ],
          },
          {
            blockType: 'mediaContent',
            blockName: 'Our Facilities - Media + Content',
            alignment: 'mediaContent',
            media: image2Doc.id,
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'World-Class Amenities',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'From spa services to fine dining, we offer everything you need for a perfect stay.',
                      },
                    ],
                  },
                ],
              },
            },
            links: [
              {
                link: {
                  type: 'custom',
                  label: 'Explore Amenities',
                  url: '/posts/amenities',
                  appearance: 'default',
                },
              },
            ],
          },
          {
            blockType: 'archive',
            blockName: 'Latest News',
            populateBy: 'collection',
            relationTo: 'posts',
            limit: 3,
            categories: [],
            introContent: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'Latest from Our Blog',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Stay updated with the latest news, offers, and travel tips from our team.',
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            blockType: 'cta',
            blockName: 'Book Now CTA',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'Ready to Book Your Stay?',
                      },
                    ],
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Contact us today to reserve your room and experience the best hospitality.',
                      },
                    ],
                  },
                ],
              },
            },
            links: [
              {
                link: {
                  type: 'custom',
                  label: 'Contact Us',
                  url: '/contact',
                  appearance: 'default',
                },
              },
            ],
          },
        ],
        meta: {
          title: `${tenant.name} - ${tenant.tagline}`,
          description: `Experience exceptional hospitality at ${tenant.name}. ${tenant.tagline}`,
          image: heroImage.id,
        },
      },
    })

    // Contact page
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Contact',
        slug: `contact`,
        tenant: brand.id,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        hero: {
          type: 'lowImpact',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [
                    {
                      type: 'text',
                      text: 'Contact Us',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: `Get in touch with ${tenant.name}. We're here to help!`,
                    },
                  ],
                },
              ],
            },
          },
        },
        layout: [
          {
            blockType: 'formBlock',
            blockName: 'Contact Form',
            form: contactForm.id,
          },
        ],
        meta: {
          title: `Contact ${tenant.name}`,
          description: `Get in touch with ${tenant.name} for reservations, inquiries, or any assistance.`,
        },
      },
    })

    // Posts page
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Posts',
        slug: `posts`,
        tenant: brand.id,
        _status: 'published',
        publishedAt: new Date().toISOString(),
        hero: {
          type: 'lowImpact',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h1',
                  children: [
                    {
                      type: 'text',
                      text: 'Our Blog',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Latest news, tips, and updates from our team.',
                    },
                  ],
                },
              ],
            },
          },
        },
        layout: [
          {
            blockType: 'archive',
            blockName: 'All Posts',
            populateBy: 'collection',
            relationTo: 'posts',
            limit: 10,
            categories: [],
          },
        ],
        meta: {
          title: `Blog - ${tenant.name}`,
          description: `Read the latest posts from ${tenant.name}.`,
        },
      },
    })

    // Create tenant-specific header
    await payload.create({
      collection: 'header',
      data: {
        tenant: brand.id,
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Contact',
              url: '/contact',
            },
          },
        ],
      },
    })

    // Create tenant-specific footer
    await payload.create({
      collection: 'footer',
      data: {
        tenant: brand.id,
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Contact',
              url: '/contact',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
        ],
      },
    })

    payload.logger.info(`  ✓ Completed tenant: ${tenant.name}`)
  }

  payload.logger.info('Seeded database successfully!')
  payload.logger.info(`Created ${tenantData.length} tenants with:`)
  payload.logger.info(`  - 3 blog posts each`)
  payload.logger.info(`  - Home, Contact, and Posts pages`)
  payload.logger.info(`  - Unique branding and colors`)
}

async function fetchLogoFromPublicFolder(logoFileName: string): Promise<File> {
  const fs = await import('fs/promises')
  const path = await import('path')

  // Construct path to logo file in public/svg folder
  const logoPath = path.join(process.cwd(), 'public', 'svg', logoFileName)

  try {
    const data = await fs.readFile(logoPath)

    return {
      name: logoFileName,
      data: data as Buffer,
      mimetype: 'image/svg+xml',
      size: data.length,
    }
  } catch (error) {
    throw new Error(`Failed to load logo from ${logoPath}: ${error}`)
  }
}

async function fetchUnsplashImage(
  imageId: string,
  width: number,
  height: number,
  retries = 3,
): Promise<File> {
  // Use Lorem Picsum instead of Unsplash (more reliable)
  // Convert imageId to a seed number for consistent images per tenant
  const seed = imageId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      })

      if (!res.ok) {
        if (attempt < retries) {
          const delay = 1000 * attempt
          console.log(
            `Picsum returned ${res.status} for seed ${seed}, retrying in ${delay}ms (attempt ${attempt}/${retries})`,
          )
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }
        throw new Error(`Failed to fetch image from Picsum: seed ${seed}, status: ${res.status}`)
      }

      const data = await res.arrayBuffer()

      return {
        name: `${seed}-${width}x${height}.jpg`,
        data: Buffer.from(data),
        mimetype: 'image/jpeg',
        size: data.byteLength,
      }
    } catch (error) {
      if (attempt === retries) {
        throw error
      }
      const delay = 1000 * attempt
      console.log(`Network error fetching seed ${seed}, retrying in ${delay}ms (attempt ${attempt}/${retries})`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error(`Failed to fetch image after ${retries} attempts: seed ${seed}`)
}
