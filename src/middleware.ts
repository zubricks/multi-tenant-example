import { NextRequest, NextResponse } from 'next/server'

// In-memory cache for tenant lookups to reduce API calls
const tenantCache = new Map<string, { slug: string; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes

async function fetchTenantByDomain(domain: string, requestUrl: string): Promise<{ slug: string } | null> {
  // Check cache first
  const cached = tenantCache.get(domain)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return { slug: cached.slug }
  }

  try {
    // Build the API URL - use the same origin as the request to handle .local domains
    const url = new URL(requestUrl)
    const apiUrl = `${url.protocol}//${url.host}`

    const response = await fetch(
      `${apiUrl}/api/clients?where[domain][equals]=${encodeURIComponent(domain)}&limit=1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      console.error('Failed to fetch tenant:', response.statusText)
      return null
    }

    const data = await response.json()

    if (data.docs && data.docs.length > 0) {
      const tenant = data.docs[0]
      // Cache the result
      tenantCache.set(domain, {
        slug: tenant.slug,
        timestamp: Date.now(),
      })
      return { slug: tenant.slug }
    }

    return null
  } catch (error) {
    console.error('Error fetching tenant by domain:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Extract domain (remove port for localhost)
  const domain = hostname.split(':')[0]

  console.log(`[Middleware] Request for: ${request.url}, hostname: ${hostname}, domain: ${domain}`)

  // Handle localhost development - support query param for testing
  if (domain === 'localhost' || domain === '127.0.0.1') {
    // Check for tenant query param: localhost:3000?tenant=luxe-hotels
    const tenantParam = request.nextUrl.searchParams.get('tenant')

    if (tenantParam) {
      const response = NextResponse.next()
      response.headers.set('x-tenant-slug', tenantParam)
      return response
    }

    // Default to first tenant for localhost (you can change this logic)
    // For now, we'll let it pass through without a tenant
    return NextResponse.next()
  }

  // Fetch tenant from Payload API
  const tenant = await fetchTenantByDomain(domain, request.url)

  console.log(`[Middleware] Tenant lookup for domain "${domain}":`, tenant)

  if (tenant) {
    console.log(`[Middleware] Setting x-tenant-slug header to: ${tenant.slug}`)
    const response = NextResponse.next()
    response.headers.set('x-tenant-slug', tenant.slug)
    response.headers.set('x-tenant-domain', domain)
    return response
  }

  // No tenant found - you can customize this behavior:
  // Option 1: Allow request to proceed (default tenant or 404 handling in app)
  // Option 2: Redirect to a default domain
  // Option 3: Return a 404 page

  console.warn(`No tenant found for domain: ${domain}`)
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|admin).*)',
  ],
}
