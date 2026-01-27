'use client'

import { Button } from '@payloadcms/ui'
import React, { useState } from 'react'

const SeedButton: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSeed = async () => {
    if (
      !confirm(
        'This will delete all existing data and create 3 new tenants with demo content. Are you sure?',
      )
    ) {
      return
    }

    setIsSeeding(true)
    setMessage(null)
    setError(null)

    try {
      const response = await fetch('/next/seed-multi-tenant', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        let errorText = await response.text()
        console.error('Seed response error:', response.status, errorText)

        // Try to extract more meaningful error
        try {
          const errorJson = JSON.parse(errorText)
          errorText = errorJson.message || errorText
        } catch {
          // Keep original text if not JSON
        }

        throw new Error(`Status ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      setMessage('Database seeded successfully! ✅ Created 3 hotel brands with pages and posts.')
      console.log('Seed result:', result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Error: ${errorMessage}`)
      console.error('Seed error details:', err)
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <Button onClick={handleSeed} disabled={isSeeding}>
        {isSeeding ? 'Seeding Database... (may take 1-2 minutes)' : '🌱 Seed Database'}
      </Button>

      {message && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            borderRadius: '4px',
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      {isSeeding && (
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          <p>Please wait... This will:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
            <li>Clear existing data</li>
            <li>Create 3 hotel brands (Luxe Hotels, Budget Inn, Comfort Stays)</li>
            <li>Load SVG logos and fetch unique images</li>
            <li>Create pages and posts for each brand</li>
          </ul>
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Expected time: 1-2 minutes</p>
        </div>
      )}
    </div>
  )
}

export default SeedButton
