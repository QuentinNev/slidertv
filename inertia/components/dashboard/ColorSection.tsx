import ColorPicker from '~/components/ColorPicker'
import { useForm } from '@inertiajs/react'
import type { Colors } from '~/types'

export default function ColorSection({ colors }: { colors?: Colors }) {
  const getColor = (key: keyof Colors, defaultValue: string) => {
    return (colors?.[key] ?? (colors?.$attributes?.[key] as string)) ?? defaultValue
  }

  const colorForm = useForm({
    backgroundColor: getColor('backgroundColor', '#0d0d14'),
    accentColor: getColor('accentColor', '#e53e3e'),
    textColor: getColor('textColor', '#ffffff'),
  })

  function submitColors(e: React.FormEvent) {
    e.preventDefault()
    if (!colorForm.data.backgroundColor || !colorForm.data.accentColor || !colorForm.data.textColor) {
      return
    }
    colorForm.post('/dashboard/colors')
  }

  return (
  <section className="db-card">
    <h2>Palette de couleurs</h2>
    <form onSubmit={submitColors} className="db-form">
      <div className="db-colors-fields">
        <div className="db-field">
          <label className="db-color-label">Fond</label>
          <ColorPicker
            value={colorForm.data.backgroundColor}
            onChange={(hex) => colorForm.setData('backgroundColor', hex)}
          />
          {colorForm.errors.backgroundColor && (
            <div className="db-error">{colorForm.errors.backgroundColor}</div>
          )}
        </div>
        <div className="db-field">
          <label className="db-color-label">Accent</label>
          <ColorPicker
            value={colorForm.data.accentColor}
            onChange={(hex) => colorForm.setData('accentColor', hex)}
          />
          {colorForm.errors.accentColor && (
            <div className="db-error">{colorForm.errors.accentColor}</div>
          )}
        </div>
        <div className="db-field">
          <label className="db-color-label">Texte</label>
          <ColorPicker
            value={colorForm.data.textColor}
            onChange={(hex) => colorForm.setData('textColor', hex)}
          />
          {colorForm.errors.textColor && (
            <div className="db-error">{colorForm.errors.textColor}</div>
          )}
        </div>
      </div>
      <button type="submit" disabled={colorForm.processing} className="db-submit">
        {colorForm.processing ? 'Enregistrement…' : 'Enregistrer les couleurs'}
      </button>
    </form>
  </section>
)}