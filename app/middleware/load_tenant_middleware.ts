import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tenant from '#models/tenant'

export default class LoadTenantMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Uses slug rather than ID to make URLs user-friendly (e.g., /hotel-ibis instead of /11)
    const slug = ctx.params.slug
    const tenant = await Tenant.findBy('slug', slug)

    if (!tenant) {
      return ctx.response.status(404).send('Tenant not found')
    }

    // Attaches tenant to HTTP context for access throughout the request
    ctx.tenant = tenant
    return next()
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    tenant?: Tenant
  }
}
