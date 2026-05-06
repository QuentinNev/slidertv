import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import ColorPicker from '~/components/ColorPicker'
import type { Slide } from '~/types'

export default function SlideSection({ slide }: { slide?: Slide }) {
  const form = useForm({
    title: slide?.title ?? '',
    content: slide?.content ?? '',
    titleColor: slide?.titleColor ?? '#ffffff',
    contentColor: slide?.contentColor ?? '#ffffff',
    order: slide?.order ?? 0,
    duration: slide?.duration ?? 30,
    isActive: slide?.isActive ?? true,
    media: null as File | null,
  })

  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)

  useEffect(() => {
    form.setData({
      title: slide?.title ?? '',
      content: slide?.content ?? '',
      titleColor: slide?.titleColor ?? '#ffffff',
      contentColor: slide?.contentColor ?? '#ffffff',
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

    processFile(file)
  }

  function processFile(file: File) {
    form.setData('media', file)

    const url = URL.createObjectURL(file)
    setPreview({ url, type: file.type })
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const file = e.dataTransfer.files?.[0] ?? null
    if (!file) return

    processFile(file)
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ marginBottom: 0 }}>{slide ? 'Modifier la slide' : 'Créer une slide'}</h2>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.data.isActive}
            onChange={(e) => form.setData('isActive', e.target.checked)}
            style={{ width: 'auto', height: 'auto' }}
          />
          Visible
        </label>
      </div>

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

        {/* COLORS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="db-field">
            <label className="db-color-label">Couleur du titre</label>
            <ColorPicker
              value={form.data.titleColor}
              onChange={(hex) => form.setData('titleColor', hex)}
            />
            {form.errors.titleColor && <div className="db-error">{form.errors.titleColor}</div>}
          </div>

          <div className="db-field">
            <label className="db-color-label">Couleur du texte</label>
            <ColorPicker
              value={form.data.contentColor}
              onChange={(hex) => form.setData('contentColor', hex)}
            />
            {form.errors.contentColor && <div className="db-error">{form.errors.contentColor}</div>}
          </div>
        </div>

        {/* DURATION */}
        <div className="db-field">
          <label>Durée (sec)</label>
          <input
            type="number"
            value={form.data.duration}
            onChange={(e) => form.setData('duration', Number(e.target.value))}
          />
          {form.errors.duration && <div className="db-error">{form.errors.duration}</div>}
        </div>

        {/* MEDIA WITH PREVIEW */}
        <div className="db-field">
          <label>Média</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  minHeight: '200px',
                  border: '2px dashed',
                  borderColor: isDragActive ? '#1971c2' : 'var(--gray-4)',
                  borderRadius: '6px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: isDragActive ? 'rgba(25, 113, 194, 0.05)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*,application/pdf"
                  style={{ display: 'none' }}
                  id="media-input"
                />
                <label
                  htmlFor="media-input"
                  style={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: isDragActive ? '#1971c2' : 'var(--gray-7)',
                  }}
                >
                  <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                    {isDragActive ? 'Déposez votre fichier' : 'Glissez-déposez un fichier'}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--gray-6)' }}>ou cliquez pour parcourir</div>
                </label>
              </div>
              {form.errors.media && <div className="db-error">{form.errors.media}</div>}
            </div>

            <div style={{ minHeight: '200px' }}>
              {preview && (
                <div className="db-preview">
                  <p style={{ marginTop: 0 }}>Aperçu :</p>
                  {preview.type.startsWith('image/') && <img src={preview.url} alt="preview" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />}
                  {preview.type.startsWith('video/') && <video src={preview.url} controls style={{ maxWidth: '100%', maxHeight: '300px' }} />}
                  {preview.type === 'application/pdf' && (
                    <a href={preview.url} target="_blank" rel="noreferrer">
                      Voir PDF
                    </a>
                  )}
                </div>
              )}

              {!preview && slide?.media && (
                <div className="db-preview">
                  <p style={{ marginTop: 0 }}>Média actuel :</p>
                  {slide.mediaType?.startsWith('image/') && <img src={`/storage/${slide.media}`} style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />}
                  {slide.mediaType?.startsWith('video/') && <video src={`/storage/${slide.media}`} controls style={{ maxWidth: '100%', maxHeight: '300px' }} />}
                  {slide.mediaType === 'application/pdf' && (
                    <a href={`/storage/${slide.media}`} target="_blank">
                      Voir PDF
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button type="submit" disabled={form.processing}>
          {form.processing ? 'Sauvegarde...' : slide ? 'Mettre à jour' : 'Créer'}
        </button>
      </form>
    </section>
  )
}
