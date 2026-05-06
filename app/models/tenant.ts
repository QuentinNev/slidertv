import { TenantSchema } from '#database/schema'
import { hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Slide from '#models/slide'
import AppSetting from '#models/app_setting'
import WeatherLocation from '#models/weather_location'
import User from '#models/user'

export default class Tenant extends TenantSchema {
  @hasMany(() => Slide)
  declare slides: HasMany<typeof Slide>

  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasOne(() => AppSetting)
  declare appSetting: HasOne<typeof AppSetting>

  @hasOne(() => WeatherLocation)
  declare weatherLocation: HasOne<typeof WeatherLocation>
}
