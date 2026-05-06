import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'app_settings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('text_color').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('text_color')
    })
  }
}
