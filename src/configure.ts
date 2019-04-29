import { Scheduler } from './scheduler.class'
import { Flag } from './flag'

/*
 * Config options
 * */
export interface ConfigInterface {
  strict_mode?: boolean,
  strict_mode_on_commands?: boolean,
  strict_mode_on_flags?: boolean,
  global_help?: boolean,
  exit_on_help?: boolean,
  catch?: (err: Error) => any,
}

/*
 * Configure package
 * */
export class Configure {

  private config: ConfigInterface = { } // Config data
  private scheduler: Scheduler // Scheduler instance

  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler
  }

  /*
   * Set configuration
   * */
  setConfig(config: ConfigInterface = {}) {
    this.config.strict_mode = typeof config.strict_mode == 'boolean' ? config.strict_mode : true
    this.config.global_help = typeof config.global_help == 'boolean' ? config.global_help : true
    this.config.exit_on_help = typeof config.exit_on_help == 'boolean' ? config.exit_on_help : true
    this.config.catch = typeof config.catch == 'function' ? config.catch : (err) => { throw err }

    if(this.config.strict_mode) {
      this.config.strict_mode_on_commands = true
      this.config.strict_mode_on_flags = true
    }
    else {
      this.config.strict_mode_on_commands = typeof config.strict_mode_on_commands == 'boolean' ? config.strict_mode_on_commands : true
      this.config.strict_mode_on_flags = typeof config.strict_mode_on_flags == 'boolean' ? config.strict_mode_on_flags : true
    }

    if(this.config.global_help) {
      this.scheduler.registerFlag(new Flag('help', { alias: 'h', description: 'Show help', default: false, type: 'boolean' }))
    }
  }

  /*
   * Get configuration
   * */
  getConfig(): ConfigInterface {
    return this.config
  }

}
