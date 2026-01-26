import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCurrentTenant } from '@/utilities/getTenant'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()
  const tenant = await getCurrentTenant()

  return <HeaderClient data={headerData} tenant={tenant} />
}
