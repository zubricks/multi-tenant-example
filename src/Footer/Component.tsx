import { FooterClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'
import type { Tenant } from '@/providers/Tenant/types'

export async function Footer({ tenant }: { tenant: Tenant | null }) {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()

  return <FooterClient data={footerData} tenant={tenant} />
}
