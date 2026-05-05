type Props = {
  slide: {
    id: number
    title: string | null
    content: string
    media: string | null
    mediaType: string | null
    mediaUrl?: string
    order: number
    duration: number
    isActive: boolean
  }
}

export default function Slide({ slide }: Props) {
  return (
    <div className="db-page">
      <header className="db-header">
        <h1>{slide.title ?? `Slide #${slide.id}`}</h1>
      </header>

      <div className="db-content">
        {/* META */}
        <div className="db-card">
          <p>
            <strong>Ordre :</strong> {slide.order}
          </p>
          <p>
            <strong>Durée :</strong> {slide.duration}s
          </p>
          <p>
            <strong>Statut :</strong> {slide.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>

        {/* CONTENT */}
        <div className="db-card">
          <h2>Contenu</h2>
          <p>{slide.content}</p>
        </div>

        {/* MEDIA */}
        {slide.mediaUrl && (
          <div className="db-card">
            <h2>Média</h2>

            {slide.mediaType?.startsWith('image/') && (
              <img src={slide.mediaUrl} alt="slide media" />
            )}

            {slide.mediaType?.startsWith('video/') && <video src={slide.mediaUrl} controls />}

            {slide.mediaType === 'application/pdf' && (
              <a href={slide.mediaUrl} target="_blank">
                Ouvrir le PDF
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
