import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })

// 1. Ensure a super-admin (sees all tenants) for the test
const email = 'superadmin@example.com'
const password = 'test12345'
const existing = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
})
if (existing.docs.length === 0) {
  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Super Admin', roles: ['super-admin'] },
  })
  console.log('CREATED_SUPER_ADMIN', email)
} else {
  console.log('SUPER_ADMIN_EXISTS', email)
}

// 2. Configure three tenants to exercise the lenient allowlist:
const brands = await payload.find({ collection: 'brands', limit: 3, depth: 0 })
const [a, b, c] = brands.docs

// a: explicit list WITHOUT posts → Posts hidden, Categories visible
await payload.update({ collection: 'brands', id: a.id, data: { enabledCollections: ['categories'] } })
// b: explicit list WITH posts → Posts visible
await payload.update({ collection: 'brands', id: b.id, data: { enabledCollections: ['posts'] } })
// c: empty/unset → lenient: everything visible
await payload.update({ collection: 'brands', id: c.id, data: { enabledCollections: [] } })

console.log('TENANT_NO_POSTS', a.id, a.name)
console.log('TENANT_WITH_POSTS', b.id, b.name)
console.log('TENANT_LENIENT_ALL', c.id, c.name)

process.exit(0)
