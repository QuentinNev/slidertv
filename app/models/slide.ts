import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'

export default class Slide extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tenantId: number

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

  @column({ columnName: 'title_color' })
  declare titleColor: string | null

  @column({ columnName: 'content_color' })
  declare contentColor: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>
}
