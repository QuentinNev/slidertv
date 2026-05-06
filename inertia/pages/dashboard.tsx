import DashboardLayout from '~/components/dashboard/Layout'
import ColorSection from '~/components/dashboard/ColorSection'
import MeteoSection from '~/components/dashboard/MeteoSection'
import SlideSection from '~/components/dashboard/SlideSection'
import { useState } from 'react'
import type { DashboardSection, Colors, Location } from '~/types'

export default function Dashboard({
  location,
  colors,
}: {
  location?: Location
  colors?: Colors
}) {
  const [section, setSection] = useState<DashboardSection>('colors')

  return (
    <DashboardLayout section={section} setSection={setSection}>
      {section === 'colors' && <ColorSection colors={colors} />}
      {section === 'meteo' && <MeteoSection location={location} />}
      {section === 'slide' && <SlideSection />}
    </DashboardLayout>
  )
}