import { AppSettingSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Tenant from '#models/tenant'

export default class AppSetting extends AppSettingSchema {
  @belongsTo(() => Tenant)
  declare tenant: BelongsTo<typeof Tenant>
}
