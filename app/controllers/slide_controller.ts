import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { updateSlideValidator } from '#validators/slide'
import Slide from '#models/slide'
import { convertPdfToImage } from '#services/pdf_converter'
import fs from 'fs/promises'
import path from 'path'

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
        mediaName: s.media ? `/storage/${s.media}` : undefined,
      },
    })
  }

  async updateSlide({ request, response, session }: HttpContext) {
    const { media, ...data } = await request.validateUsing(updateSlideValidator)
    const isUpdate = request.method() === 'PUT'
    const slideId = isUpdate ? request.param('id') : null

    const slide = isUpdate ? await Slide.findOrFail(slideId) : new Slide()

    if (!isUpdate) {
      slide.fill(data)
    } else {
      slide.merge(data)
    }

    if (!media) {
      await slide.save()
      session.flash('success', isUpdate ? 'Slide updated successfully!' : 'Slide created successfully!')
      return response.redirect().toRoute('dashboard')
    }

    const mime = media.headers['content-type']

    let folder = 'files'
    let extension = media.extname ?? 'bin'
    let finalMime = mime

    if (mime.startsWith('image/')) {
      folder = 'slides/images'
    } else if (mime.startsWith('video/')) {
      folder = 'slides/videos'
    } else if (mime === 'application/pdf') {
      folder = 'slides/images'
      extension = 'png'
      finalMime = 'image/png'
    } else {
      session.flash('error', 'File type not supported')
      return response.redirect().back()
    }

    const filename = `${string.uuid()}.${extension}`
    const key = `${folder}/${filename}`

    if (mime === 'application/pdf') {
      const tempDir = path.join('storage', 'temp')
      const tempPdfName = `${string.uuid()}.pdf`
      const tempPdfPath = path.join(tempDir, tempPdfName)

      await fs.mkdir(tempDir, { recursive: true })
      await media.moveToDisk(`temp/${tempPdfName}`)

      try {
        console.log('Converting PDF:', tempPdfPath)
        const outputPath = path.join('storage', key)
        const outputDir = path.dirname(outputPath)
        await fs.mkdir(outputDir, { recursive: true })
        console.log('Output path:', outputPath)

        await convertPdfToImage(tempPdfPath, outputPath)
        console.log('Conversion completed')

        const exists = await fs.access(outputPath).then(() => true).catch(() => false)
        console.log('File exists after conversion:', exists)

        await fs.rm(tempPdfPath)
      } catch (error) {
        console.error('PDF conversion error:', error)
        session.flash('error', `Failed to convert PDF: ${error instanceof Error ? error.message : String(error)}`)
        return response.redirect().back()
      }
    } else {
      await media.moveToDisk(key)
    }

    slide.media = key
    slide.mediaType = finalMime
    slide.mediaName = media.clientName
    await slide.save()

    session.flash('success', isUpdate ? 'Slide updated successfully!' : 'Slide created successfully!')
    return response.redirect().toRoute('dashboard')
  }
}
