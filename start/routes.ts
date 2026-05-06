/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

import fs from 'fs/promises'
import path from 'path'

router.get('/storage/*', async ({ params, response }) => {
  const filePath = path.join(process.cwd(), 'storage', params['*'])
  try {
    await fs.access(filePath)
    response.download(filePath)
  } catch {
    response.status(404).send('File not found')
  }
})

router.get('/', async ({ auth, response }) => {
  if (auth.isAuthenticated) {
    if (auth.user!.role === 'admin') {
      return response.redirect().toRoute('admin')
    }
    return response.redirect().toRoute('dashboard')
  }
  return response.redirect().toRoute('session.create')
}).as('home')

router
  .group(() => {
    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('admin', [controllers.Admin, 'index']).as('admin')
    router.post('admin/tenants', [controllers.Admin, 'store']).as('admin.tenants.store')
    router.delete('admin/tenants/:id', [controllers.Admin, 'destroy']).as('admin.tenants.destroy')
  })
  .use(middleware.admin())

router
  .group(() => {
    router.get('dashboard', [controllers.Dashboard, 'index']).as('dashboard')
    router.post('dashboard', [controllers.AppSetting, 'updateLocation']).as('dashboard.update')
    router.post('dashboard/colors', [controllers.AppSetting, 'updateColors']).as('dashboard.colors')

    router.get('slide/:id', [controllers.Slide, 'show']).as('slide.show')
    router.post('slide', [controllers.Slide, 'updateSlide']).as('slide.create')
    router.put('slide/:id', [controllers.Slide, 'updateSlide']).as('slide.update')
    router.patch('slides/reorder', [controllers.Slide, 'reorder']).as('slides.reorder')
  })
  .use(middleware.auth())

router.get('/events', [controllers.Events, 'index']).as('events')

// Tenant public routes — must be last to avoid shadowing other routes
router.get('/:slug', [controllers.TenantHome, 'index']).use(middleware.loadTenant()).as('tenant.home')
router.get('/:slug/events', [controllers.TenantEvents, 'index']).use(middleware.loadTenant()).as('tenant.events')
