import type { HttpContext } from '@adonisjs/core/http'
import eventBus from '#services/event_bus'

export default class TenantEventsController {
  async index({ response, tenant }: HttpContext) {
    const res = response.response
    const slug = tenant!.slug
    // Uses tenant slug to create tenant-specific event channel; SSE clients subscribe only to updates for their tenant
    const event = `settings:updated:${slug}`

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    })
    // SSE comment `:ok` confirms to client that the connection is established and ready for events
    res.write(':ok\n\n')

    const send = () => res.write('data: update\n\n')
    // Subscribes to tenant-specific event; when dashboard settings change, all connected TV screens are notified
    eventBus.on(event, send)

    // Proxies may close idle connections; pings every 30s keep the connection alive across network boundaries
    const keepAlive = setInterval(() => res.write(':ping\n\n'), 30_000)

    await new Promise<void>((resolve) => {
      res.on('close', () => {
        // Cleans up event listener and interval when client disconnects to prevent memory leaks
        eventBus.off(event, send)
        clearInterval(keepAlive)
        resolve()
      })
    })
  }
}
