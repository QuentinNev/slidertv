import DashboardLayout from '~/components/dashboard/Layout'
import ColorSection from '~/components/dashboard/ColorSection'
import MeteoSection from '~/components/dashboard/MeteoSection'
import SlideSection from '~/components/dashboard/SlideSection'

import {useState} from 'react'

export default function Dashboard({location, colors}:{
  
}) {
  const [section, setSection] = useState('colors')

  return (
    <DashboardLayout section={section} setSection={setSection}>
      {section === 'colors' && <ColorSection colors={colors} />}
      {section === 'meteo' && <MeteoSection location={location} />}
      {section === 'slide' && <SlideSection />}
    </DashboardLayout>
  )
}