import vine from '@vinejs/vine'
import type { HttpContext } from '@adonisjs/core/http'
import Tenant from '#models/tenant'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import string from '@adonisjs/core/helpers/string'

const tenantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    slug: vine
      .string()
      .trim()
      .minLength(2)
      .regex(/^[a-z0-9-]+$/)
      .unique(async (_db, value) => {
        const existing = await Tenant.findBy('slug', value)
        return !existing
      }),
    email: vine.string().trim().email(),
  })
)

export default class AdminController {
  async index({ inertia, session }: HttpContext) {
    const tenants = await Tenant.query().orderBy('created_at', 'desc')
    const newTenant = session.flashMessages.has('newTenant') ? session.flashMessages.get('newTenant') : null
    return inertia.render('admin/index', { tenants, newTenant })
  }

  async store({ request, response, session }: HttpContext) {
    const { name, slug, email } = await request.validateUsing(tenantValidator)

    const tenant = await Tenant.create({ name, slug })

    const password = string.random(16)
    await User.create({
      email,
      password,
      role: 'tenant',
      tenantId: tenant.id,
    })

    session.flash('success', `Tenant "${name}" créé.`)
    session.flash('newTenant', { email, password, name })
    return response.redirect().toRoute('admin')
  }

  async destroy({ params, response, session }: HttpContext) {
    const tenant = await Tenant.findOrFail(params.id)
    await tenant.delete()
    session.flash('success', `Tenant "${tenant.name}" supprimé`)
    return response.redirect().toRoute('admin')
  }
}
