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

router.get('/', [controllers.Home, 'index']).as('home')
router.get('/events', [controllers.Events, 'index']).as('events')

router.get('/storage/*', async ({ params, response }) => {
  const filePath = path.join(process.cwd(), 'storage', params['*'])
  try {
    await fs.access(filePath)
    response.download(filePath)
  } catch (error) {
    response.status(404).send('File not found')
  }
})

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.get('dashboard', [controllers.Dashboard, 'index']).as('dashboard')
    router.post('dashboard', [controllers.Dashboard, 'update']).as('dashboard.update')
    router.post('dashboard/colors', [controllers.Dashboard, 'updateColors']).as('dashboard.colors')

    router.get('slide/:id', [controllers.Slide, 'show']).as('slide.show')
    router.post('slide', [controllers.Slide, 'updateSlide']).as('slide.create')
    router.put('slide/:id', [controllers.Slide, 'updateSlide']).as('slide.update')
  })
  .use(middleware.auth())
