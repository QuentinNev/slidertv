import vine from '@vinejs/vine'

export const updateSlideValidator = vine.compile(
  vine.object({
    media: vine.file({
      size: '50mb',
      extnames: [
        'jpg', 'jpeg', 'png', 'webp',
        'mp4', 'webm',
        'pdf'
      ],
    }),
  })
)