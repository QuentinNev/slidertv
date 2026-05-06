import vine from '@vinejs/vine'

const hexColor = vine.string().regex(/^#[0-9a-fA-F]{6}$/)

export const updateSlideValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(1),
    content: vine.string().optional(),
    titleColor: hexColor.optional(),
    contentColor: hexColor.optional(),
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