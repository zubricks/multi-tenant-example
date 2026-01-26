import type { CollectionConfig } from 'payload'

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  access: {
    read: () => true, // Public read access for frontend
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'icon', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Name of the amenity (e.g., "Free WiFi", "Swimming Pool")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this amenity',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: [
        { label: 'WiFi', value: 'wifi' },
        { label: 'Parking', value: 'parking' },
        { label: 'Pool', value: 'pool' },
        { label: 'Gym', value: 'gym' },
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Room Service', value: 'room-service' },
        { label: 'Spa', value: 'spa' },
        { label: 'Pet Friendly', value: 'pet-friendly' },
        { label: 'Air Conditioning', value: 'air-conditioning' },
        { label: 'Conference Room', value: 'conference-room' },
        { label: 'Bar', value: 'bar' },
        { label: 'Laundry', value: 'laundry' },
        { label: 'Airport Shuttle', value: 'airport-shuttle' },
        { label: 'Concierge', value: 'concierge' },
        { label: 'Safe', value: 'safe' },
      ],
      admin: {
        description: 'Icon representation for this amenity',
      },
    },
  ],
}
