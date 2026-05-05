import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { updateSlideValidator } from '#validators/slide'

export default class SlideController {
  async show({ view, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    return view.render('pages/slide/show', { user })
  }

  async updateSlide({ request, auth, response, session }: HttpContext) {
    const slide = auth.getUserOrFail()
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
    slide.media_type = mime
    slide.media_name = media.clientName
    await slide.save()

    session.flash('success', 'Media updated successfully!')
    return response.redirect().back()
  }
}