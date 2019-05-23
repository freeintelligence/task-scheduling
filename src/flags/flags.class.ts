import { Scheduler } from './../scheduler.class'
import { Flag } from './../flags'

/*
 * Flags instance (global flags)
 * */
export class Flags {

  /*
   * Data
   * */
  private container_flags: Flag[] = []

  /*
   * Constructor
   * */
  constructor() {
  }

  /*
   * Reset
   * */
  public reset() {
    this.container_flags = []

    return this
  }

  /**
   * Register flag
   */
  public push(instance: Flag) {
    this.container_flags.push(Flags.fixFlag(instance))
    return this
  }

  /**
   * Fix flag instance
   */
  private static fixFlag(instance: Flag) {
    if(typeof instance.options.alias == 'string') {
      instance.options.alias = [ instance.options.alias ]
    }
    if(typeof instance.options.alias == 'undefined') {
      instance.options.alias = [ ]
    }
    if(typeof instance.name == 'string') {
      instance.name = [ instance.name ]
    }
    if(instance.name instanceof Array) {
      instance.name = instance.name.concat(instance.options.alias)
      instance.options.alias = undefined
    }

    return instance
  }

  /**
   * Get flag by name
   */
  public getByName(name: string) {
    return this.container_flags.filter(e => e.name.indexOf(name) !== -1)
  }

}
