import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AmenitiesBlock } from '@/blocks/Amenities/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BrandGridBlock } from '@/blocks/BrandGrid/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MediaContentBlock } from '@/blocks/MediaContent/Component'

const blockComponents = {
  amenities: AmenitiesBlock,
  archive: ArchiveBlock,
  brandGrid: BrandGridBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  mediaContent: MediaContentBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  tenantDomain?: string
}> = (props) => {
  const { blocks, tenantDomain } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer tenantDomain={tenantDomain} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
