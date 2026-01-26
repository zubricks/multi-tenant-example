import React from 'react'
import type { AmenitiesBlock as AmenitiesBlockProps } from '@/payload-types'
import { AmenityIcon, type IconName } from './icons'

export const AmenitiesBlock: React.FC<AmenitiesBlockProps> = ({ heading, amenities }) => {
  if (!amenities || amenities.length === 0) {
    return null
  }

  return (
    <div className="container my-16">
      {heading && <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{heading}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {amenities.map((amenity) => {
          if (typeof amenity === 'string') return null

          return (
            <div
              key={amenity.id}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 p-4 rounded-full bg-primary/10">
                <AmenityIcon name={amenity.icon as IconName} className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{amenity.title}</h3>
              {amenity.description && (
                <p className="text-sm text-muted-foreground">{amenity.description}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
