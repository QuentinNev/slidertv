import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

export type DashboardSection = 'colors' | 'meteo' | 'slide'

export interface Colors {
  backgroundColor: string | null
  accentColor: string | null
}

export interface Location {
  name: string
  latitude: number
  longitude: number
  mediaName?: string
  $attributes?: {
    name: string
    latitude: number
    longitude: number
  }
}

export interface Slide {
  id: number
  title: string
  content: string
  order: number
  duration: number
  isActive: boolean
  mediaName?: string
  mediaType?: string
}

export interface GeoResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
}
