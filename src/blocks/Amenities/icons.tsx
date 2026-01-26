import React from 'react'
import {
  Wifi,
  Car,
  Waves,
  Dumbbell,
  UtensilsCrossed,
  ConciergeBell,
  Sparkles,
  PawPrint,
  Wind,
  Presentation,
  Wine,
  WashingMachine,
  Plane,
  Briefcase,
  ShieldCheck,
} from 'lucide-react'

export const iconMap = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  gym: Dumbbell,
  restaurant: UtensilsCrossed,
  'room-service': ConciergeBell,
  spa: Sparkles,
  'pet-friendly': PawPrint,
  'air-conditioning': Wind,
  'conference-room': Presentation,
  bar: Wine,
  laundry: WashingMachine,
  'airport-shuttle': Plane,
  concierge: Briefcase,
  safe: ShieldCheck,
} as const

export type IconName = keyof typeof iconMap

interface AmenityIconProps {
  name: IconName
  className?: string
}

export const AmenityIcon: React.FC<AmenityIconProps> = ({ name, className }) => {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} />
}
