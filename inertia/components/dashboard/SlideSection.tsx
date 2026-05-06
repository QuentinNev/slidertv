import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import type { Slide } from '~/types'

export default function SlideSection({ slide }: { slide?: Slide }) {
  const form = useForm({
    title: slide?.title ?? '',
    content: slide?.content ?? '',
    order: slide?.order ?? 0,
    duration: slide?.duration ?? 30,
    isActive: slide?.isActive ?? true,
    media: null as File | null,
  })

  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null)

  useEffect(() => {
    form.setData({
      title: slide?.title ?? '',
      content: slide?.content ?? '',
      order: slide?.order ?? 0,
      duration: slide?.duration ?? 30,
      isActive: slide?.isActive ?? true,
      media: null,
    })
    setPreview(null)
  }, [slide?.id])

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.data.title.trim()) {
      return
    }

    if (slide) {
      form.put(`/slide/${slide.id}`, { forceFormData: true })
    } else {
      form.post('/slide', { forceFormData: true })
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (!file) return

    form.setData('media', file)

    const url = URL.createObjectURL(file)
    setPreview({ url, type: file.type })
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [preview])

  useEffect(() => {
    if (slide?.mediaName) {
      setPreview(null)
    }
  }, [slide])

  return (
    <section className="db-card">
      <h2>{slide ? 'Modifier la slide' : 'Créer une slide'}</h2>

      <form onSubmit={submit} className="db-form">
        {/* TITLE */}
        <div className="db-field">
          <label>Titre</label>
          <input
            type="text"
            value={form.data.title}
            onChange={(e) => form.setData('title', e.target.value)}
          />
          {form.errors.title && <div className="db-error">{form.errors.title}</div>}
        </div>

        {/* CONTENT */}
        <div className="db-field">
          <label>Texte</label>
          <textarea
            value={form.data.content}
            onChange={(e) => form.setData('content', e.target.value)}
          />
          {form.errors.content && <div className="db-error">{form.errors.content}</div>}
        </div>

        {/* DURATION */}
        <div className="db-row">
          <div className="db-field">
            <label>Durée (sec)</label>
            <input
              type="number"
              value={form.data.duration}
              onChange={(e) => form.setData('duration', Number(e.target.value))}
            />
            {form.errors.duration && <div className="db-error">{form.errors.duration}</div>}
          </div>
        </div>

        {/* VISIBLE */}
        <div className="db-field">
          <label>
            <input
              type="checkbox"
              checked={form.data.isActive}
              onChange={(e) => form.setData('isActive', e.target.checked)}
            />
            Visible
          </label>
          {form.errors.isActive && <div className="db-error">{form.errors.isActive}</div>}
        </div>

        {/* MEDIA */}
        <div className="db-field">
          <label>Média</label>

          <input type="file" onChange={handleFileChange} accept="image/*,video/*,application/pdf" />

          {form.errors.media && <div className="db-error">{form.errors.media}</div>}
        </div>

        {/* PREVIEW */}
        {preview && (
          <div className="db-preview">
            <p>Aperçu :</p>
            {preview.type.startsWith('image/') && <img src={preview.url} alt="preview" />}
            {preview.type.startsWith('video/') && <video src={preview.url} controls />}
            {preview.type === 'application/pdf' && (
              <a href={preview.url} target="_blank" rel="noreferrer">
                Voir PDF
              </a>
            )}
          </div>
        )}

        {/* EXISTING MEDIA */}
        {!preview && slide?.mediaName && (
          <div className="db-preview">
            <p>Média actuel :</p>

            {slide.mediaType?.startsWith('image/') && <img src={slide.mediaName} />}

            {slide.mediaType?.startsWith('video/') && <video src={slide.mediaName} controls />}

            {slide.mediaType === 'application/pdf' && (
              <a href={slide.mediaName} target="_blank">
                Voir PDF
              </a>
            )}
          </div>
        )}

        {/* SUBMIT */}
        <button type="submit" disabled={form.processing}>
          {form.processing ? 'Sauvegarde...' : slide ? 'Mettre à jour' : 'Créer'}
        </button>
      </form>
    </section>
  )
}
