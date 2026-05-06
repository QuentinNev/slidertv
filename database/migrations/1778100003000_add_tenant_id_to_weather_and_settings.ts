import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('weather_locations', (table) => {
      table.integer('tenant_id').unsigned().nullable().references('id').inTable('tenants').onDelete('cascade')
    })
    this.schema.alterTable('app_settings', (table) => {
      table.integer('tenant_id').unsigned().nullable().references('id').inTable('tenants').onDelete('cascade')
    })

    this.defer(async (db) => {
      await db.rawQuery(
        `UPDATE weather_locations SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default') WHERE tenant_id IS NULL`
      )
      await db.rawQuery(
        `UPDATE app_settings SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default') WHERE tenant_id IS NULL`
      )
    })
  }

  async down() {
    this.schema.alterTable('weather_locations', (table) => {
      table.dropColumn('tenant_id')
    })
    this.schema.alterTable('app_settings', (table) => {
      table.dropColumn('tenant_id')
    })
  }
}
