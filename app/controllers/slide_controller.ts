import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { updateSlideValidator, reorderSlidesValidator } from '#validators/slide'
import Slide from '#models/slide'
import Tenant from '#models/tenant'
import { convertPdfToImage } from '#services/pdf_converter'
import fs from 'fs/promises'
import path from 'path'

export default class SlideController {
  async show({ params, inertia, auth }: HttpContext) {
    const tenantId = auth.user!.tenantId!
    // Fetches slide and tenant in parallel; the WHERE clause on tenantId in slide query ensures tenant isolation
    const [slide, tenant] = await Promise.all([
      Slide.query().where('id', params.id).where('tenantId', tenantId).first(),
      Tenant.find(tenantId),
    ])

    if (!slide || !tenant) {
      return inertia.render('errors/server_error', { status: 404, message: 'Slide or tenant not found' })
    }

    const s = slide

    return inertia.render('slide/show', {
      tenantSlug: tenant.slug,
      slide: {
        id: s.id,
        title: s.title,
        content: s.content,
        media: s.media,
        mediaType: s.mediaType,
        order: s.order,
        duration: s.duration,
        isActive: s.isActive,
        // Prepends /storage/ prefix for client-side file access from public storage disk
        mediaName: s.media ? `/storage/${s.media}` : undefined,
      },
    })
  }

  async updateSlide({ request, response, session, auth }: HttpContext) {
    const { media, ...data } = await request.validateUsing(updateSlideValidator)
    // Route can handle both POST (create) and PUT (update) by checking HTTP method
    const isUpdate = request.method() === 'PUT'
    const slideId = isUpdate ? request.param('id') : null
    const tenantId = auth.user!.tenantId!

    // Ensures tenant isolation by filtering on tenantId for updates; creates new instance for inserts
    const slide = isUpdate
      ? await Slide.query().where('id', slideId).where('tenantId', tenantId).firstOrFail()
      : new Slide()

    if (!isUpdate) {
      // fill() sets multiple attributes at once; merge() is used for updates to only set provided fields
      slide.fill({ ...data, tenantId })
    } else {
      slide.merge(data)
    }

    if (!media) {
      // Allows slide updates without changing media; early return saves the slide without file operations
      await slide.save()
      session.flash('success', isUpdate ? 'Slide updated successfully!' : 'Slide created successfully!')
      return response.redirect().toRoute('dashboard')
    }

    const mime = media.headers['content-type']

    // Folder structure organizes different media types to aid in storage management and cleanup
    let folder = 'files'
    let extension = media.extname ?? 'bin'
    let finalMime = mime

    if (mime.startsWith('image/')) {
      folder = 'slides/images'
    } else if (mime.startsWith('video/')) {
      folder = 'slides/videos'
    } else if (mime === 'application/pdf') {
      // PDFs must be converted to images since the video player on TV displays images as-is
      folder = 'slides/images'
      extension = 'png'
      finalMime = 'image/png'
    } else {
      session.flash('error', 'File type not supported')
      return response.redirect().back()
    }

    // UUID filenames prevent collisions and strip any directory traversal or special characters from uploaded names
    const filename = `${string.uuid()}.${extension}`
    const key = `${folder}/${filename}`

    if (mime === 'application/pdf') {
      // PDF conversion requires temporary storage and async processing before moving to final location
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

        // External service converts first page of PDF to PNG for display on TV screen
        await convertPdfToImage(tempPdfPath, outputPath)
        console.log('Conversion completed')

        const exists = await fs.access(outputPath).then(() => true).catch(() => false)
        console.log('File exists after conversion:', exists)

        // Cleans up temporary file after successful conversion
        await fs.rm(tempPdfPath)
      } catch (error) {
        console.error('PDF conversion error:', error)
        session.flash('error', `Failed to convert PDF: ${error instanceof Error ? error.message : String(error)}`)
        return response.redirect().back()
      }
    } else {
      // Non-PDF files move directly to their final storage location
      await media.moveToDisk(key)
    }

    // Stores the path and MIME type separately; mediaName is the original filename for display purposes
    slide.media = key
    slide.mediaType = finalMime
    slide.mediaName = media.clientName
    await slide.save()

    session.flash('success', isUpdate ? 'Slide updated successfully!' : 'Slide created successfully!')
    return response.redirect().toRoute('dashboard')
  }

  async reorder({ request, response, auth }: HttpContext) {
    const { orders } = await request.validateUsing(reorderSlidesValidator)
    const tenantId = auth.user!.tenantId!

    await Promise.all(
      orders.map(({ id, order }) =>
        Slide.query()
          .where('id', id)
          .where('tenantId', tenantId)
          .update({ order })
      )
    )

    return response.redirect().toRoute('dashboard')
  }
}
