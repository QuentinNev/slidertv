import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { updateSlideValidator } from '#validators/slide'
import Slide from '#models/slide'

export default class SlideController {
  async show({ params, inertia }: HttpContext) {
    const slide = await Slide.findOrFail(params.id)

    const s = slide

    return inertia.render('slide/show', {
      slide: {
        id: s.id,
        title: s.title,
        content: s.content,
        media: s.media,
        mediaType: s.mediaType,
        order: s.order,
        duration: s.duration,
        isActive: s.isActive,
        mediaUrl: s.media ? `/storage/${s.media}` : undefined,
      },
    })
  }

  async updateSlide({ request, auth, response, session }: HttpContext) {
    const slide = await Slide.findOrFail(auth.getUserOrFail().id)
    const { media } = await request.validateUsing(updateSlideValidator)

    const mime = media.headers['content-type']

    let folder = 'files'
    let extension = media.extname ?? 'bin'

    if (mime.startsWith('image/')) {
      folder = 'slides/images'
    } else if (mime.startsWith('video/')) {
      folder = 'slides/videos'
    } else if (mime === 'application/pdf') {
      folder = 'slides/pdfs'
      extension = 'pdf'
    } else {
      session.flash('error', 'File type not supported')
      return response.redirect().back()
    }

    const filename = `${string.uuid()}.${extension}`
    const key = `${folder}/${filename}`

    await media.moveToDisk(key)

    slide.media = key
    slide.mediaType = mime
    slide.mediaName = media.clientName
    await slide.save()

    session.flash('success', 'Media updated successfully!')
    return response.redirect().back()
  }
}
