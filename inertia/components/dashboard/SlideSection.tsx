import { useForm } from '@inertiajs/react'
import { useState } from 'react'

export default function SlideSection({ slide }) {
  const form = useForm({
    media: null as File | null,
  })

  const [preview, setPreview] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/dashboard/slide', {
      forceFormData: true,
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null

    if (!file) return

    form.setData('media', file)

    // preview simple (image uniquement)
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
    } else {
      setPreview(null)
    }
  }

  return (
    <section className="db-card">
      <h2>Slide média</h2>

      <form onSubmit={submit} className="db-form">
        <div className="db-field">
          <label>Fichier (image / vidéo / pdf)</label>

          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*,video/*,application/pdf"
          />

          {form.errors.media && (
            <div className="db-error">{form.errors.media}</div>
          )}
        </div>

        {/* Preview image */}
        {preview && (
          <div className="db-preview">
            <img src={preview} alt="preview" />
          </div>
        )}

        {/* Existing media */}
        {!preview && slide?.media_url && (
          <div className="db-preview">
            <p>Media actuel :</p>
            <img src={slide.media_url} alt="current media" />
          </div>
        )}

        <button
          type="submit"
          disabled={form.processing}
          className="db-submit"
        >
          {form.processing ? 'Upload…' : 'Mettre à jour la slide'}
        </button>
      </form>
    </section>
  )
}