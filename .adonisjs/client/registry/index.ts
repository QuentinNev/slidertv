/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'drive.fs.serve': {
    methods: ["GET","HEAD"],
    pattern: '/uploads/*',
    tokens: [{"old":"/uploads/*","type":0,"val":"uploads","end":""},{"old":"/uploads/*","type":2,"val":"*","end":""}],
    types: placeholder as Registry['drive.fs.serve']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'admin': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin']['types'],
  },
  'admin.tenants.store': {
    methods: ["POST"],
    pattern: '/admin/tenants',
    tokens: [{"old":"/admin/tenants","type":0,"val":"admin","end":""},{"old":"/admin/tenants","type":0,"val":"tenants","end":""}],
    types: placeholder as Registry['admin.tenants.store']['types'],
  },
  'admin.tenants.destroy': {
    methods: ["DELETE"],
    pattern: '/admin/tenants/:id',
    tokens: [{"old":"/admin/tenants/:id","type":0,"val":"admin","end":""},{"old":"/admin/tenants/:id","type":0,"val":"tenants","end":""},{"old":"/admin/tenants/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['admin.tenants.destroy']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'dashboard.update': {
    methods: ["POST"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.update']['types'],
  },
  'dashboard.colors': {
    methods: ["POST"],
    pattern: '/dashboard/colors',
    tokens: [{"old":"/dashboard/colors","type":0,"val":"dashboard","end":""},{"old":"/dashboard/colors","type":0,"val":"colors","end":""}],
    types: placeholder as Registry['dashboard.colors']['types'],
  },
  'slide.show': {
    methods: ["GET","HEAD"],
    pattern: '/slide/:id',
    tokens: [{"old":"/slide/:id","type":0,"val":"slide","end":""},{"old":"/slide/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['slide.show']['types'],
  },
  'slide.create': {
    methods: ["POST"],
    pattern: '/slide',
    tokens: [{"old":"/slide","type":0,"val":"slide","end":""}],
    types: placeholder as Registry['slide.create']['types'],
  },
  'slide.update': {
    methods: ["PUT"],
    pattern: '/slide/:id',
    tokens: [{"old":"/slide/:id","type":0,"val":"slide","end":""},{"old":"/slide/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['slide.update']['types'],
  },
  'slides.reorder': {
    methods: ["PATCH"],
    pattern: '/slides/reorder',
    tokens: [{"old":"/slides/reorder","type":0,"val":"slides","end":""},{"old":"/slides/reorder","type":0,"val":"reorder","end":""}],
    types: placeholder as Registry['slides.reorder']['types'],
  },
  'slide.destroy': {
    methods: ["DELETE"],
    pattern: '/slide/:id',
    tokens: [{"old":"/slide/:id","type":0,"val":"slide","end":""},{"old":"/slide/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['slide.destroy']['types'],
  },
  'events': {
    methods: ["GET","HEAD"],
    pattern: '/events',
    tokens: [{"old":"/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['events']['types'],
  },
  'tenant.home': {
    methods: ["GET","HEAD"],
    pattern: '/:slug',
    tokens: [{"old":"/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['tenant.home']['types'],
  },
  'tenant.events': {
    methods: ["GET","HEAD"],
    pattern: '/:slug/events',
    tokens: [{"old":"/:slug/events","type":1,"val":"slug","end":""},{"old":"/:slug/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['tenant.events']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
