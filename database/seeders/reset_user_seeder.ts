import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Tenant from '#models/tenant'
import hash from '@adonisjs/core/services/hash'

export default class extends BaseSeeder {
  async run() {
    // Delete existing users
    await User.query().delete()

    // Create default tenant
    let defaultTenant = await Tenant.findBy('slug', 'default')
    if (!defaultTenant) {
      defaultTenant = await Tenant.create({
        name: 'Default',
        slug: 'default',
      })
    }

    // Create admin
    const adminPassword = await hash.make('admin1234')
    await User.create({
      email: 'admin@slidertv.local',
      password: adminPassword,
      fullName: 'Admin',
      role: 'admin',
      tenantId: null,
    })
    console.log('Admin created: admin@slidertv.local / admin1234')

    // Create tenant user
    const userPassword = await hash.make('user1234')
    await User.create({
      email: 'user@slidertv.local',
      password: userPassword,
      fullName: 'User',
      role: 'tenant',
      tenantId: defaultTenant.id,
    })
    console.log('Tenant user created: user@slidertv.local / user1234')
  }
}
