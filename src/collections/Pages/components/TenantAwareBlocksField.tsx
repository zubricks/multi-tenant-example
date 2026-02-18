'use client'
import type { BlocksFieldClientComponent } from 'payload'

import { BlocksField, useFormFields } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

export const TenantAwareBlocksField: BlocksFieldClientComponent = (props) => {
  const tenant = useFormFields(([fields]) => fields?.tenant?.value)
  const [allowedBlocks, setAllowedBlocks] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAllowedBlocks = async () => {
      if (!tenant) {
        setAllowedBlocks(null)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/brands/${tenant}`)
        if (response.ok) {
          const brand = await response.json()
          // If no allowedBlocks set, allow all (null means no restrictions)
          setAllowedBlocks(brand.allowedBlocks?.length > 0 ? brand.allowedBlocks : null)
        } else {
          setAllowedBlocks(null)
        }
      } catch (error) {
        console.error('Error fetching brand blocks:', error)
        setAllowedBlocks(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllowedBlocks()
  }, [tenant])

  // If no restrictions or still loading, show all blocks
  if (allowedBlocks === null || isLoading) {
    return <BlocksField {...props} />
  }

  // Filter blocks based on allowed blocks
  const filteredBlocks = props.field.blocks.filter((block) => allowedBlocks.includes(block.slug))

  return <BlocksField {...props} field={{ ...props.field, blocks: filteredBlocks }} />
}
