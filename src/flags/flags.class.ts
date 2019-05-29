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
   * Remove flags by name
   */
  public remove(name: string|string[]) {
    if(typeof name == 'string') name = [ name ];

    for(let i in name) {
      this.container_flags = this.container_flags.filter(e => e.getAllNames().indexOf(name[i]) === -1)
    }
  }

  /**
   * Register flag
   */
  public push(instance: Flag) {
    this.container_flags.push(instance)
    return this
  }

  /**
   * Flag exists
   */
  public exists(name: string) {
    return this.getByName(name).length
  }

  /**
   * Get all flags
   */
  public getAll() {
    return this.container_flags
  }

  /**
   * Get flag by name
   */
  public getByName(name: string) {
    return this.container_flags.filter(e => e.getAllNames().indexOf(name) !== -1)
  }

}
