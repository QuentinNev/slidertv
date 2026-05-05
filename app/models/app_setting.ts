import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class AppSetting extends BaseModel {
  static table = 'app_settings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare backgroundColor: string | null

  @column()
  declare accentColor: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
