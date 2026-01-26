import { FooterClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getCurrentTenant } from '@/utilities/getTenant'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()
  const tenant = await getCurrentTenant()

  return <FooterClient data={footerData} tenant={tenant} />
}
