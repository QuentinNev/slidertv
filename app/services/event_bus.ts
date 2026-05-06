import { EventEmitter } from 'node:events'

class EventBus extends EventEmitter {}

const eventBus = new EventBus()
// Increases listener limit as many screens/tenants may listen for settings changes
eventBus.setMaxListeners(500)

export default eventBus
