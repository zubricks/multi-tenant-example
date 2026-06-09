'use client'

import React from 'react'
import type { Brand } from '@/payload-types'

interface TenantCellProps {
  cellData?: string | Brand | null
  [key: string]: unknown
}

export const TenantCell: React.FC<TenantCellProps> = (props) => {
  const { cellData } = props
  const [tenantData, setTenantData] = React.useState<Brand | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchTenantData() {
      // Handle case where tenant is already populated as an object
      if (typeof cellData === 'object' && cellData !== null) {
        setTenantData(cellData)
        setLoading(false)
        return
      }

      // If cellData is just an ID, fetch the full tenant data
      if (typeof cellData === 'string') {
        try {
          const response = await fetch(`/api/brands/${cellData}`, {
            credentials: 'include',
          })
          if (response.ok) {
            const data = await response.json()
            setTenantData(data)
          }
        } catch (error) {
          console.error('Error fetching tenant:', error)
        }
      }
      setLoading(false)
    }

    fetchTenantData()
  }, [cellData])

  if (loading) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        Loading...
      </span>
    )
  }

  if (!tenantData) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        No Tenant
      </span>
    )
  }

  // Get the tenant's primary color or use a default
  const primaryColor = tenantData.brandColors?.primaryColor || '#3B82F6'

  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: primaryColor,
        color: 'white',
        borderRadius: '9999px',
        textAlign: 'center',
      }}
    >
      {tenantData.name}
    </span>
  )
}
