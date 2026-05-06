import DashboardLayout from '~/components/dashboard/Layout'
import ColorSection from '~/components/dashboard/ColorSection'
import MeteoSection from '~/components/dashboard/MeteoSection'
import SlideSection from '~/components/dashboard/SlideSection'
import { useState } from 'react'
import type { DashboardSection, Colors, Location, Slide } from '~/types'

export default function Dashboard({
  location,
  colors,
  slides = [],
}: {
  location?: Location
  colors?: Colors
  slides?: Slide[]
}) {
  const [section, setSection] = useState<DashboardSection>('colors')
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null)

  const handleSlideSelect = (slide: Slide) => {
    setSelectedSlide(slide)
    setSection('slide')
  }

  const handleCreateSlide = () => {
    setSelectedSlide(null)
    setSection('slide')
  }

  return (
    <DashboardLayout
      section={section}
      setSection={setSection}
      slides={slides}
      onSlideSelect={handleSlideSelect}
      onCreateSlide={handleCreateSlide}
      selectedSlideId={selectedSlide?.id}
    >
      {section === 'colors' && <ColorSection colors={colors} />}
      {section === 'meteo' && <MeteoSection location={location} />}
      {section === 'slide' && <SlideSection slide={selectedSlide} />}
    </DashboardLayout>
  )
}