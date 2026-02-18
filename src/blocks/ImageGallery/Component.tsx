'use client'
import type { ImageGalleryBlock as ImageGalleryBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import React, { useEffect, useState } from 'react'
import { Media } from '@/components/Media'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = ImageGalleryBlockProps & {
  className?: string
  enableGutter?: boolean
  disableInnerContainer?: boolean
}

export const ImageGalleryBlock: React.FC<Props> = (props) => {
  const { heading, images, autoplay, autoplaySpeed, className, enableGutter = true } = props

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (images?.length || 1))
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? (images?.length || 1) - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!autoplay || !images || images.length <= 1) return

    const interval = setInterval(() => {
      goToNext()
    }, autoplaySpeed || 5000)

    return () => clearInterval(interval)
  }, [autoplay, autoplaySpeed, images, currentIndex])

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        '',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      {heading && <h2 className="mb-8 text-3xl font-bold">{heading}</h2>}

      <div className="relative">
        {/* Main image display */}
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {images.map((item, index) => {
            const image = item.image

            if (typeof image !== 'object') return null

            return (
              <div
                key={index}
                className={cn(
                  'absolute inset-0 transition-opacity duration-500',
                  index === currentIndex ? 'opacity-100' : 'opacity-0',
                )}
              >
                <Media
                  resource={image}
                  className="h-full w-full object-cover"
                  imgClassName="h-full w-full object-cover"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2 text-sm text-white">
                    {item.caption}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  index === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30',
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
