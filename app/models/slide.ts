import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Slide extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare media: string | null

  @column({ columnName: 'media_type' })
  declare mediaType: string | null

  @column({ columnName: 'media_name' })
  declare mediaName: string | null

  @column()
  declare order: number

  @column()
  declare duration: number

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
