import ColorPicker from '~/components/ColorPicker'
import { useForm } from '@inertiajs/react'

export  default function ColorSection({colors}){
  
  function submitColors(e: React.FormEvent) {
    e.preventDefault()
    colorForm.post('/dashboard/colors')
  }
  

  const colorForm = useForm({
    backgroundColor: colors?.$attributes.backgroundColor ?? '#0d0d14',
    accentColor: colors?.$attributes.accentColor ?? '#e53e3e',
  })

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
      </div>
      <button type="submit" disabled={colorForm.processing} className="db-submit">
        {colorForm.processing ? 'Enregistrement…' : 'Enregistrer les couleurs'}
      </button>
    </form>
  </section>
)}