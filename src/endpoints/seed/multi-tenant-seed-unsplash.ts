import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
  'brands',
]

const tenantGlobalCollections: CollectionSlug[] = ['header', 'footer']

// Unsplash image IDs for hotel/travel themed images
// Using specific image IDs ensures consistency across seeds
const unsplashImageSets = [
  ['KtOid0FLjqU', 'HQaZKCDaax0', '0qvBNep1Y04', 'yGPxCYPS8H4'],
  ['kDpT8DalqXs', 'e3OUQGT9bWU', 'yCW4nEm7gRg', 'MdJq0zFUwrw'],
  ['W49tMyNy4uk', 'D5nh6mCW52c', 'HH4WBGNyltc', 'Xq1ntWruZQI'],
  ['whJ8wT-fYkw', 'Mv9hjnEUHR4', 'uRUrNsuoGbA', 'kMr7DKRd-vw'],
  ['NodtnCsLdTE', 'qfjX4SBTX2U', 'S-YssWw00G0', 'yBzrPGLjMQw'],
  ['G4xM8nPmKEQ', 'bjhrzvzZMa0', 'WEQbe2jBg40', 'KZNTEn2r9Gw'],
  ['73F4pKoUkM0', 'sfL_QOnmy00', 'eOpewngf68w', 'K2td5hI-5-8'],
  ['Pse8xc8wvuo', 'sO-JmQj95ec', 'TrhLCn1abMU', 'pYWuOMhtc6k'],
  ['t20pc32VbrU', 'bku_bxGBcdI', 'zzFRvHHxJCc', 'lV6NRy0EpXE'],
  ['vUNQaTtZeOo', 'lMzaKx-xYO0', 'BNvk1zqEAjc', 'JvA4fYmM3kM'],
]
