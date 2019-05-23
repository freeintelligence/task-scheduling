import { Scheduler } from './../scheduler.class'
import { BaseCommand } from './../interfaces'
import { Flag } from './../flags'
import { Extra } from './../extras'

/*
 * Commands instance
 * */
export class Commands {

  /*
   * Data
   * */
  private container_commands: BaseCommand[] = []
  private container_default: BaseCommand[] = []

  /*
   * Scheduler instance
   * */
  private scheduler: Scheduler

  /*
   * Constructor
   * */
  constructor(scheduler: Scheduler) {
    this.scheduler = scheduler
  }

  /*
   * Reset
   * */
  public reset(only?: 'commands'|'default') {
    if(only == 'commands' || !only) this.container_commands = [];
    if(only == 'default' || !only) this.container_default = [];

    return this
  }

  /**
   * Register command
   */
  public push(instance: BaseCommand) {
    this.container_commands.push(Commands.fixCommand(instance))
    return this
  }

  /**
   * Register a command in a simple way (inline)
   */
  public pushSimple(name: string, run?: Function): this;
  public pushSimple(run: Function): this;
  public pushSimple(flags: Flag[], run?: Function): this;
  public pushSimple(name: string, description?: string, run?: Function): this;
  public pushSimple(name: string, flags?: Flag[], run?: Function): this;
  public pushSimple(name: string, run?: Function): this;
  public pushSimple(name: string | Flag[] | Function, description?: string | Flag[] | Function, flags?: Flag[] | Function, run?: Function): this {
    let _name: string | string[]
    let _description: string
    let _flags: Flag[]
    let _run: Function

    if(typeof name == 'function') _run = name;
    else if(name instanceof Array && name.length) _flags = name;
    else if(typeof name == 'string' && name.length) _name = name;

    if(typeof description == 'function') _run = description;
    else if(typeof description == 'string' && description.length) _description = description;
    else if(description instanceof Array) _flags = description;

    if(typeof flags == 'function') _run = flags;
    else if(flags instanceof Array) _flags = flags;

    if(typeof run == 'function') _run = run;

    const command = class implements BaseCommand {
      public name: string | string[] = _name
      public description: string = _description
      public flags = _flags

      async run(data) {
        return typeof _run === 'function' ? await _run(data) : null
      }
    }

    return this.push(new command())
  }

  /**
   * Register default command
   */
  public default(instance: BaseCommand) {
    this.container_default.push(Commands.fixCommand(instance))
  }

  /**
   * Register (simple) default command
   */
  public defaultSimple(run: Function) {
    const command = class implements BaseCommand {
      async run(data) {
        return await run(data)
      }
    }

    this.default(new command())
  }

  /**
   * Fix command instance
   */
  private static fixCommand(instance: BaseCommand) {
    if(typeof instance.name == 'undefined' || (typeof instance.name == 'string' && !instance.name.length) || (instance.name instanceof Array && !instance.name.length)) {
      instance.name = [ ]
      instance.extras = { }
    }
    if(typeof instance.name == 'string' && instance.name.length) {
      this.extrasByName(instance)
    }
    if(typeof instance.description !== 'string' || !instance.description.length) {
      instance.description = undefined
    }
    if(typeof instance.flags !== 'object' || instance.flags == null || !(instance instanceof Object)) {
      instance.flags = { }
    }
    if(typeof instance.extras == 'undefined' || !(instance.extras instanceof Object)) {
      instance.extras = { }
    }
    if(typeof instance.run !== 'function') {
      instance.run = async () => { }
    }
    return instance
  }

  /**
   * Generate extras by name
   */
  private static extrasByName(instance: BaseCommand) {
    const parts = (instance.name as string).split(' ')

    instance.name = [ parts[0] ]
    parts.shift()

    if(parts.length) {
      instance.extras = { }

      parts.forEach(part => {
        const data = part.split('=', 2)
        instance.extras[data[0]] = new Extra(data[0], { default: data.length == 2 ? data[1] : undefined })
      })
    }
  }

  /**
   * Get commands by tasks
   */
  public getByName(name: string) {
    let result: BaseCommand[]

    if(typeof name == 'undefined' || name == '') {
      result = this.container_commands.filter(e => !e.name.length)
    }
    else {
      result = this.container_commands.filter(e => e.name == name)
    }

    return result.length ? result : this.container_default
  }

}
