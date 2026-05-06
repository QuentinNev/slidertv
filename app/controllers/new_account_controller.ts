import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth }: HttpContext) {
    // signupValidator ensures email/password meet requirements; User.create() automatically hashes the password
    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({ ...payload })

    // Auto-login after signup provides seamless user experience; session is established immediately
    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard')
  }
}
