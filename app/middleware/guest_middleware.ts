import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users.
 *
 * For example, the login page should not be accessible if the user
 * is already logged-in
 */
export default class GuestMiddleware {
  /**
   * The URL to redirect to when user is logged-in
   */
  redirectTo = '/dashboard'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    // Checks each auth guard (or default guard) to determine if user is logged in
    for (let guard of options.guards || [ctx.auth.defaultGuard]) {
      if (await ctx.auth.use(guard).check()) {
        // reflash() preserves flash data (success messages, etc) through the redirect
        ctx.session.reflash()
        // True parameter makes it a permanent redirect (301) instead of temporary (302)
        return ctx.response.redirect(this.redirectTo, true)
      }
    }

    return next()
  }
}
