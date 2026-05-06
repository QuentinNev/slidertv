/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  home: typeof routes['home']
  events: typeof routes['events']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard'] & {
    update: typeof routes['dashboard.update']
    colors: typeof routes['dashboard.colors']
  }
  slide: {
    show: typeof routes['slide.show']
    create: typeof routes['slide.create']
    update: typeof routes['slide.update']
  }
}
