import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Payload Multi-Tenant Demo</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {
            ' to populate the database with 3 demo hotel brands (Luxe Hotels, Budget Inn, and Comfort Stays). Each tenant will get unique branding, pages, posts, and images.'
          }
        </li>
        <li>
          {
            'After seeding, visit each tenant site by updating your hosts file or using the domain switching functionality to see how each brand has its own unique look and content.'
          }
        </li>
        <li>
          {'Explore the '}
          <a
            href="https://payloadcms.com/docs/configuration/collections"
            rel="noopener noreferrer"
            target="_blank"
          >
            multi-tenant architecture
          </a>
          {
            ' to understand how tenant isolation works. Each collection is filtered by tenant, and globals (header/footer) are tenant-specific.'
          }
        </li>
      </ul>
      {'Pro Tip: This block is a '}
      <a
        href="https://payloadcms.com/docs/custom-components/overview"
        rel="noopener noreferrer"
        target="_blank"
      >
        custom component
      </a>
      , you can remove it at any time by updating your <strong>payload.config</strong>.
    </div>
  )
}

export default BeforeDashboard
