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

router.get('/', [controllers.Home, 'index']).as('home')
router.get('/events', [controllers.Events, 'index']).as('events')

router.get('slide/:id', [controllers.Slide, 'show'])
router.post('slide', [controllers.Slide, 'updateSlide'])

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
  })
  .use(middleware.auth())
