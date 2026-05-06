import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tenant from '#models/tenant'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    const existingTenant = await Tenant.findBy('slug', 'default')
    if (!existingTenant) {
      const tenant = await Tenant.create({
        name: 'Default',
        slug: 'default',
      })
      console.log('Default tenant created')

      const existingUser = await User.findBy('email', 'user@slidertv.local')
      if (!existingUser) {
        await User.create({
          email: 'user@slidertv.local',
          password: await hash.make('user1234'),
          fullName: 'User',
          role: 'tenant',
          tenantId: tenant.id,
        })
        console.log('Test tenant user created: user@slidertv.local / user1234')
      }
      return
    }

    const existingUser = await User.findBy('email', 'user@slidertv.local')
    if (!existingUser) {
      await User.create({
        email: 'user@slidertv.local',
        password: await hash.make('user1234'),
        fullName: 'User',
        role: 'tenant',
        tenantId: existingTenant.id,
      })
      console.log('Test tenant user created: user@slidertv.local / user1234')
    } else {
      await existingUser.merge({ role: 'tenant', tenantId: existingTenant.id }).save()
      console.log('Test tenant user updated')
    }
  }
}
