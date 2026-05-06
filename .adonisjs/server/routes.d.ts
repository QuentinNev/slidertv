import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'admin.tenants.store': { paramsTuple?: []; params?: {} }
    'admin.tenants.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'dashboard.update': { paramsTuple?: []; params?: {} }
    'dashboard.colors': { paramsTuple?: []; params?: {} }
    'slide.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'slide.create': { paramsTuple?: []; params?: {} }
    'slide.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events': { paramsTuple?: []; params?: {} }
    'tenant.home': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'tenant.events': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'slide.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events': { paramsTuple?: []; params?: {} }
    'tenant.home': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'tenant.events': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'slide.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'events': { paramsTuple?: []; params?: {} }
    'tenant.home': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'tenant.events': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.tenants.store': { paramsTuple?: []; params?: {} }
    'dashboard.update': { paramsTuple?: []; params?: {} }
    'dashboard.colors': { paramsTuple?: []; params?: {} }
    'slide.create': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'admin.tenants.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'slide.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}