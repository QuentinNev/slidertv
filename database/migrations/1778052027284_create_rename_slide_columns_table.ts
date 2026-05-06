import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slides'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('mediaType', 'media_type')
      table.renameColumn('mediaName', 'media_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('media_type', 'mediaType')
      table.renameColumn('media_name', 'mediaName')
    })
  }
}