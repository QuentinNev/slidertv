/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  home: typeof routes['home']
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  admin: typeof routes['admin'] & {
    tenants: {
      store: typeof routes['admin.tenants.store']
      destroy: typeof routes['admin.tenants.destroy']
    }
  }
  dashboard: typeof routes['dashboard'] & {
    update: typeof routes['dashboard.update']
    colors: typeof routes['dashboard.colors']
  }
  slide: {
    show: typeof routes['slide.show']
    create: typeof routes['slide.create']
    update: typeof routes['slide.update']
    destroy: typeof routes['slide.destroy']
  }
  slides: {
    reorder: typeof routes['slides.reorder']
  }
  events: typeof routes['events']
  tenant: {
    home: typeof routes['tenant.home']
    events: typeof routes['tenant.events']
  }
}
