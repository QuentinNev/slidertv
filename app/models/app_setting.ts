import { AppSettingSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'

export default class AppSetting extends AppSettingSchema {
  @column()
  declare textColor: string | null

  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>
}
