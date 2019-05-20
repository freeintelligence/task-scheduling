import { Scheduler } from './../scheduler.class'

/*
 * Settings
 * */
export interface Settings {
  strict_mode?: boolean,
  strict_mode_on_commands?: boolean,
  strict_mode_on_flags?: boolean,
  global_help?: boolean,
  exit_on_help?: boolean,
  catch?: (err: Error) => any,
}

/*
 * Configure scheduler instance
 * */
export class Configure implements Settings {

  /*
   * Settings
   * */
  strict_mode?: boolean
  strict_mode_on_commands?: boolean
  strict_mode_on_flags?: boolean
  global_help?: boolean
  exit_on_help?: boolean
  catch?: (err: Error) => any

  /*
   * Scheduler instance
   * */
  scheduler: Scheduler

  /*
   * Constructor
   * */
  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler

    this.strict_mode = true
    this.strict_mode_on_commands = true
    this.strict_mode_on_flags = true
    this.global_help = true
    this.exit_on_help = true
    this.catch = (err) => { throw err }
  }

}
