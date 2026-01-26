'use client'

import React, { useState, useEffect } from 'react'
import type { BrandGridBlock as BrandGridBlockProps } from '@/payload-types'

export const BrandGridBlock: React.FC<BrandGridBlockProps> = ({ heading, description, brands }) => {
  const [currentPort, setCurrentPort] = useState('3000')

  useEffect(() => {
    // Only run on client side after mount
    if (typeof window !== 'undefined') {
      setCurrentPort(window.location.port || '3000')
    }
  }, [])

  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <div className="container my-16">
      {heading && <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{heading}</h2>}
      {description && (
        <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
          {description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand, index) => {
          if (typeof brand === 'string') return null

          // Replace the port in the URL with the current port
          const adjustedUrl = brand.url?.replace(/:3000/, currentPort ? `:${currentPort}` : '') || '#'

          return (
            <a
              key={index}
              href={adjustedUrl}
              className="group flex flex-col p-8 rounded-lg border border-border bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            >
              <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                {brand.name}
              </h3>
              <p className="text-muted-foreground mb-6 flex-grow">{brand.tagline}</p>
              <div className="flex items-center text-primary font-medium">
                Visit Site
                <svg
                  className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
