import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slides'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('title_color').nullable()
      table.string('content_color').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('title_color')
      table.dropColumn('content_color')
    })
  }
}
