# Payload Multi-Tenant Example

This is a complete multi-tenant website example built with [Payload CMS](https://payloadcms.com) and the official [@payloadcms/plugin-multi-tenant](https://payloadcms.com/docs/plugins/multi-tenant) plugin. Use it to power multi-brand websites, white-label platforms, or any application that needs to serve different content and styling based on custom domains.

This example demonstrates:

- **Domain-based tenant routing** - Serve different brands on different domains
- **Per-tenant branding** - Custom colors, typography, logos, and styling for each brand
- **Tenant-scoped content** - Pages, posts, and media isolated per tenant
- **Shared amenities** - Reusable content across tenants
- **Role-based access control** - Super admins can manage all tenants, regular users see only their assigned tenants

## Core Features

- [Multi-Tenant Plugin](#multi-tenant-architecture)
- [Domain-Based Routing](#domain-based-routing)
- [Custom Branding Per Tenant](#tenant-branding)
- [Tenant-Scoped Collections](#collections)
- [Role-Based Access Control](#access-control)
- [Layout Builder](#layout-builder)
- [Draft Preview & Live Preview](#draft-preview)
- [SEO & Search](#seo-and-search)

## Quick Start

To spin up this example locally, follow these steps:

### Prerequisites

- Node.js ^18.20.2 || >=20.9.0
- pnpm ^9 || ^10
- MongoDB (local or remote instance)

### Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd multi-tenant-example
   ```

2. Copy the environment variables:

   ```bash
   cp .env.example .env
   ```

3. Update your `.env` file with your MongoDB connection string:

   ```
   DATABASE_URI=mongodb://localhost:27017/multi-tenant-example
   PAYLOAD_SECRET=your-secret-here
   ```

4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open `http://localhost:3000` in your browser

7. Create your first admin user through the on-screen instructions

### Setting Up Tenants

After logging in, you'll need to create at least one tenant (brand):

1. Navigate to the **Clients** collection in the admin panel
2. Create a new client with:

   - **Name**: Your brand name (e.g., "Luxe Hotels")
   - **Slug**: URL-friendly identifier (e.g., "luxe-hotels")
   - **Domain**: The domain for this brand (e.g., "luxe-hotels.local" for local development)
   - **Brand Colors**: Customize primary, secondary, accent colors
   - **Typography**: Choose heading and body fonts
   - **Logo**: Upload a brand logo
   - **SEO Metadata**: Set site title, description, and default OG image

3. For local development, add the domain to your `/etc/hosts` file:

   ```bash
   sudo echo "127.0.0.1 luxe-hotels.local" >> /etc/hosts
   ```

4. Access your tenant at `http://luxe-hotels.local:3000`

Alternatively, for quick testing, use the tenant query parameter: `http://localhost:3000?tenant=luxe-hotels`

## Multi-Tenant Architecture

This example is built on Payload's official multi-tenant plugin, which provides:

### Tenant Configuration

The multi-tenant plugin is configured in [src/payload.config.ts](src/payload.config.ts):

```typescript
multiTenantPlugin<Config>({
  tenantsSlug: 'clients',
  tenantSelectorLabel: 'Brand',
  collections: {
    pages: {
      /* tenant-scoped */
    },
    posts: {
      /* tenant-scoped */
    },
    header: { isGlobal: true },
    footer: { isGlobal: true },
  },
  userHasAccessToAllTenants: (user) => {
    return user?.roles?.includes('super-admin') || false
  },
})
```

### Domain-Based Routing

This example uses Next.js rewrites to transform domain-based requests into path-based routes. The configuration in [next.config.js](next.config.js) extracts the domain from the request and rewrites it internally:

**How it works:**
1. A request to `luxe-hotels.local/about` is internally rewritten to `/luxe-hotels.local/about`
2. Next.js matches this against the `[tenant]` dynamic route in `src/app/(frontend)/[tenant]`
3. The tenant domain is passed as a route parameter to page components
4. Pages query Payload using `'tenant.domain': { equals: tenant }` to filter content

**Benefits:**
- No middleware or custom headers required
- Native Next.js functionality using rewrites
- Supports static generation with `generateStaticParams`

The rewrite excludes admin, API, and static asset routes, ensuring they function normally.

## Collections

### Clients (Tenants)

The `clients` collection ([src/collections/Clients/index.ts](src/collections/Clients/index.ts)) stores tenant configuration:

**General Settings:**

- Name, slug, and domain
- Logo and tagline

**Brand Colors:**

- Primary, secondary, and accent colors
- Background, foreground, and border colors

**Typography:**

- Heading font (Inter, Playfair Display, Montserrat, Raleway, Poppins)
- Body font (Inter, Open Sans, Lato, Roboto, Source Sans 3)

**SEO & Metadata:**

- Site title and description
- Open Graph image
- Custom favicon

**Contact Information:**

- Email and phone

### Pages

Tenant-scoped pages with layout builder blocks. Each tenant can have their own unique pages with custom layouts.

### Posts

Tenant-scoped blog posts and articles. Content is isolated per tenant.

### Media

Upload collection for images, videos, and other assets. Supports:

- Multiple image sizes
- Focal point selection
- Manual resizing

### Amenities

A shared collection for reusable amenities (e.g., "Free WiFi", "Swimming Pool") that can be referenced across tenants. This demonstrates how to have both tenant-scoped and shared content in the same application.

Icons available: WiFi, Parking, Pool, Gym, Restaurant, Room Service, Spa, Pet Friendly, Air Conditioning, Conference Room, Bar, Laundry, Airport Shuttle, Concierge, Safe.

### Categories

Taxonomy for grouping posts. Supports nested categories using the [Nested Docs Plugin](https://payloadcms.com/docs/plugins/nested-docs).

### Users

Auth-enabled collection with role support:

- **Regular users**: Access only their assigned tenant(s)
- **Super admins**: Access all tenants

## Globals

### Header

Tenant-scoped global for navigation and header content. Each tenant can customize their navigation menu.

### Footer

Tenant-scoped global for footer content. Each tenant can customize their footer links and information.

## Tenant Branding

Each tenant can customize their brand appearance:

- **Colors**: 6 customizable color values (primary, secondary, accent, background, foreground, border)
- **Typography**: Separate font choices for headings and body text
- **Logo**: Custom logo per tenant
- **Favicon**: Custom favicon per tenant
- **SEO**: Default meta information per tenant

The frontend can access this branding information and apply it dynamically using CSS custom properties or Tailwind configuration.

## Access Control

The example implements role-based access control:

### Super Admin Role

Users with the `super-admin` role can:

- Access all tenants
- Create and manage tenants
- View and edit content across all brands

### Regular Users

Regular users can only:

- Access tenants they're assigned to
- Create and manage content within their tenant(s)
- Cannot see other tenants' content

### Public Access

- Published pages and posts are publicly accessible
- Media files are publicly accessible
- Tenant (client) configuration is readable (for domain lookup)
- Amenities are publicly readable

## Layout Builder

Pages and posts use Payload's layout builder with pre-configured blocks:

- **Hero** - Eye-catching header sections
- **Content** - Rich text content with Lexical editor
- **Media** - Image and video blocks
- **Call To Action** - Conversion-focused sections
- **Archive** - Dynamic content listings

Each block is designed to work with tenant branding.

## Draft Preview

All pages and posts support draft previews with [Versions](https://payloadcms.com/docs/configuration/collections#versions):

- Create drafts without publishing
- Preview unpublished changes
- Automatic revalidation on publish

## SEO and Search

### SEO Plugin

Uses the [Payload SEO Plugin](https://payloadcms.com/docs/plugins/seo) for complete SEO control:

- Meta titles and descriptions
- Open Graph tags
- Twitter Card support
- Automatic sitemap generation

### Search Plugin

Implements the [Payload Search Plugin](https://payloadcms.com/docs/plugins/search) for full-text search:

- Search across pages and posts
- Tenant-scoped search results
- SSR search functionality

### Seeding Data

You can seed the database with demo data:

1. Click the "Seed Database" button in the admin panel, or
2. Run the seed script programmatically

This will create:

- Demo clients/tenants
- Sample pages and posts
- Demo user accounts
- Example amenities

> **NOTICE**: Seeding is destructive and will drop your current database. Only run this on a fresh project.

## Use Cases

This example is ideal for:

- **Multi-brand websites** - Manage multiple brands from a single CMS
- **White-label platforms** - Offer customized sites to different clients
- **Agency portfolios** - Manage multiple client sites
- **Franchise systems** - Individual sites for each franchise location
- **Multi-region sites** - Different content/branding per region
- **SaaS platforms** - Provide branded customer portals

## Questions

If you have any issues or questions, reach out to us on:

- [Discord](https://discord.com/invite/payload)
- [GitHub Discussions](https://github.com/payloadcms/payload/discussions)

## License

MIT
