import type { HttpContext } from '@adonisjs/core/http'
import eventBus from '#services/event_bus'

export default class TenantEventsController {
  async index({ response, tenant }: HttpContext) {
    const res = response.response
    const slug = tenant!.slug
    const event = `settings:updated:${slug}`

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write(':ok\n\n')

    const send = () => res.write('data: update\n\n')
    eventBus.on(event, send)

    const keepAlive = setInterval(() => res.write(':ping\n\n'), 30_000)

    await new Promise<void>((resolve) => {
      res.on('close', () => {
        eventBus.off(event, send)
        clearInterval(keepAlive)
        resolve()
      })
    })
  }
}
