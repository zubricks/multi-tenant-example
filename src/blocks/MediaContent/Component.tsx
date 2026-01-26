import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { MediaContentBlock as MediaContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'

export const MediaContentBlock: React.FC<MediaContentBlockProps> = (props) => {
  const { alignment, enableLink, link, media, richText } = props

  const isContentFirst = alignment === 'contentMedia'

  return (
    <div className="container my-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {isContentFirst ? (
          // Content + Media layout
          <>
            <div className="lg:col-span-5">
              {richText && <RichText data={richText} enableGutter={false} />}
              {enableLink && link && (
                <div className="mt-6">
                  <CMSLink {...link} />
                </div>
              )}
            </div>
            <div className="lg:col-span-7">
              {media && typeof media === 'object' && (
                <Media
                  resource={media}
                  className="rounded-lg overflow-hidden"
                  imgClassName="w-full h-auto"
                />
              )}
            </div>
          </>
        ) : (
          // Media + Content layout
          <>
            <div className="lg:col-span-7">
              {media && typeof media === 'object' && (
                <Media
                  resource={media}
                  className="rounded-lg overflow-hidden"
                  imgClassName="w-full h-auto"
                />
              )}
            </div>
            <div className="lg:col-span-5">
              {richText && <RichText data={richText} enableGutter={false} />}
              {enableLink && link && (
                <div className="mt-6">
                  <CMSLink {...link} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
