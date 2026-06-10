import type { Access, CollectionConfig, PayloadRequest } from 'payload'

import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'

const TENANTS_SLUG = 'brands'

type TenantVisibilityDoc = { enabledCollections?: string[] | null } | null

// Dedupe the active-tenant lookup across every collection in a single request.
// Keyed by the req object (unique per request, GC'd afterwards) so 20 collections
// = 1 query, without relying on req.context write semantics.
const tenantCache = new WeakMap<PayloadRequest, Promise<TenantVisibilityDoc>>()

const getActiveTenant = (req: PayloadRequest, id: number | string): Promise<TenantVisibilityDoc> => {
  let promise = tenantCache.get(req)
  if (!promise) {
    promise = req.payload
      .findByID({
        collection: TENANTS_SLUG,
        id,
        depth: 0,
        select: { enabledCollections: true },
        req,
      })
      .then((doc) => doc as TenantVisibilityDoc)
      .catch(() => null)
    tenantCache.set(req, promise)
  }
  return promise
}

/**
 * Wraps a collection's `read` access so the collection is shown/hidden in the
 * admin nav based on the ACTIVE tenant (the tenant selector cookie), not the
 * user or the document.
 *
 * Why `read` and not `admin.hidden`: `admin.hidden` only receives `{ user }` —
 * no `req`, no cookies — so it can't see the active tenant. Read access gets the
 * full `req`, and Payload hides any collection the request can't read from the nav.
 *
 * Lenient semantics: a tenant with no `enabledCollections` (empty/unset) sees
 * everything. Only a tenant with an explicit, non-empty list that omits this
 * collection hides it.
 */
export const withActiveTenantVisibility =
  (slug: string, base?: Access): Access =>
  async (args) => {
    const { req } = args

    // Only the admin sets this cookie. No cookie (frontend) → defer to base access.
    const tenantID = getTenantFromCookie(req.headers, req.payload.db.defaultIDType)
    if (tenantID) {
      const tenant = await getActiveTenant(req, tenantID)
      const enabled = tenant?.enabledCollections

      if (enabled && enabled.length > 0 && !enabled.includes(slug)) {
        return false
      }
    }

    return base ? base(args) : true
  }

/**
 * Wraps `read` access for the given "optional" collections in one place, so you
 * never touch the individual collection files. Collections not listed are left
 * untouched (always visible).
 */
export const applyTenantVisibility = (
  collections: CollectionConfig[],
  optionalSlugs: string[],
): CollectionConfig[] => {
  const optional = new Set(optionalSlugs)
  return collections.map((collection) =>
    optional.has(collection.slug)
      ? {
          ...collection,
          access: {
            ...collection.access,
            read: withActiveTenantVisibility(collection.slug, collection.access?.read),
          },
        }
      : collection,
  )
}
