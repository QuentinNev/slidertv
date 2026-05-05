import type { HttpContext } from '@adonisjs/core/http'
import eventBus from '#services/event_bus'

export default class EventsController {
  async index({ response }: HttpContext) {
    const res = response.response

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    res.write(':ok\n\n')

    const send = () => res.write('data: update\n\n')
    eventBus.on('settings:updated', send)

    const keepAlive = setInterval(() => res.write(':ping\n\n'), 30_000)

    await new Promise<void>((resolve) => {
      res.on('close', () => {
        eventBus.off('settings:updated', send)
        clearInterval(keepAlive)
        resolve()
      })
    })
  }
}
