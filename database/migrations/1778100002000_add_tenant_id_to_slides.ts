import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slides'

  async up() {
    await this.db.rawQuery(
      `INSERT OR IGNORE INTO tenants (name, slug, created_at, updated_at) VALUES ('Default', 'default', datetime('now'), datetime('now'))`
    )

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tenant_id').unsigned().nullable().references('id').inTable('tenants').onDelete('cascade')
    })

    this.defer(async (db) => {
      await db.rawQuery(
        `UPDATE slides SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default') WHERE tenant_id IS NULL`
      )
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tenant_id')
    })
  }
}
