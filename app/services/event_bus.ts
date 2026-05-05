import { EventEmitter } from 'node:events'

class EventBus extends EventEmitter {}

const eventBus = new EventBus()
eventBus.setMaxListeners(500)

export default eventBus
