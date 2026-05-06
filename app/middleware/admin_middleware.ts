import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Ensures user is authenticated before checking role; handles session validation
    await ctx.auth.authenticate()

    // Restricts access to admin-only endpoints; non-admin authenticated users get 403 Forbidden
    if (ctx.auth.user!.role !== 'admin') {
      return ctx.response.status(403).send('Forbidden')
    }

    return next()
  }
}
