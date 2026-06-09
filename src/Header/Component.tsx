import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'
import type { Tenant } from '@/providers/Tenant/types'

export async function Header({ tenant }: { tenant: Tenant | null }) {
  const headerData: Header | null = await getCachedGlobal('header', 1)()

  if (!headerData) return null

  return <HeaderClient data={headerData} tenant={tenant} />
}
