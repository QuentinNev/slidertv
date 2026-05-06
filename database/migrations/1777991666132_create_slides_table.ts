import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'slides'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.string('media').nullable()
      table.string('mediaType').nullable()
      table.string('mediaName').nullable()
      table.integer('order').notNullable().defaultTo(0)
      table.integer('duration').notNullable().defaultTo(30)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
