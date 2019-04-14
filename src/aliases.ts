import { Scheduler } from './scheduler'

export const task = Scheduler.registerSimpleCommand.bind(Scheduler)
