'use client'

import React, { createContext, useContext } from 'react'
import type { Tenant } from './types'

interface TenantContextValue {
  tenant: Tenant | null
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
})

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

interface TenantProviderProps {
  tenant: Tenant | null
  children: React.ReactNode
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ tenant, children }) => {
  return <TenantContext.Provider value={{ tenant }}>{children}</TenantContext.Provider>
}
