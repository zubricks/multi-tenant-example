'use client'

import React, { useState, useRef, useEffect } from 'react'

import type { Header as HeaderType, Client } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon, ChevronDown } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map((item, i) => {
        if (item.type === 'dropdown') {
          return <NavDropdown key={i} item={item} />
        }
        return <CMSLink key={i} {...item.link} appearance="link" className="text-primary-foreground hover:text-primary-foreground/80" />
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary-foreground" />
      </Link>
    </nav>
  )
}

const NavDropdown: React.FC<{ item: any }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (item.dropdownType === 'clients' && isOpen && clients.length === 0) {
      fetch('/api/clients?limit=100')
        .then(res => res.json())
        .then(data => setClients(data.docs || []))
        .catch(err => console.error('Failed to fetch clients:', err))
    }
  }, [isOpen, item.dropdownType, clients.length])

  const links = item.dropdownType === 'clients'
    ? clients.map(client => {
        const port = typeof window !== 'undefined' ? window.location.port : '3000'
        return {
          label: client.name,
          url: `http://${client.domain}${port ? `:${port}` : ''}`,
          newTab: true,
        }
      })
    : item.dropdownLinks?.map((linkItem: any) => ({
        ...linkItem.link,
      })) || []

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-primary-foreground hover:text-primary-foreground/80"
      >
        {item.dropdownLabel}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <ul className="py-2">
            {links.length === 0 && item.dropdownType === 'clients' && (
              <li className="px-4 py-2 text-sm text-gray-500">Loading...</li>
            )}
            {links.length === 0 && item.dropdownType !== 'clients' && (
              <li className="px-4 py-2 text-sm text-gray-500">No links available</li>
            )}
            {links.map((link: any, idx: number) => (
              <li key={idx}>
                {link.url ? (
                  <a
                    href={link.url}
                    target={link.newTab ? '_blank' : '_self'}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <CMSLink
                    {...link}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
