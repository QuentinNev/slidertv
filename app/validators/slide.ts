import vine from '@vinejs/vine'

export const updateSlideValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1),
    content: vine.string().optional(),
    order: vine.number().optional(),
    duration: vine.number().min(1),
    isActive: vine.boolean().optional(),
    media: vine
      .file({
        size: '50mb',
        extnames: [
          'jpg', 'jpeg', 'png', 'webp',
          'mp4', 'webm',
          'pdf'
        ],
      })
      .optional(),
  })
)