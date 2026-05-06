import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.authenticate()

    if (ctx.auth.user!.role !== 'admin') {
      return ctx.response.status(403).send('Forbidden')
    }

    return next()
  }
}
