import { BaseCommand } from './../commands'
import { Flag } from './../flags'
import { Extra, Extras } from './../extras'

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
   * Constructor
   * */
  constructor() {
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

    const command = class extends BaseCommand {
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
    return this
  }

  /**
   * Register (simple) default command
   */
  public defaultSimple(run: Function) {
    const command = class extends BaseCommand {
      async run(data) {
        return await run(data)
      }
    }

    return this.default(new command())
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
      const data = Extras.extrasByName(instance.name)
      instance.name = data.name
      instance.extras = Object.keys(data.extras).length ? data.extras : instance.extras
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
   * Get all commands (except default not found commands)
   */
  public getAll() {
    return this.container_commands
  }

  /**
   * Get default commands
   */
  public getDefaults() {
    return this.container_default
  }

  /**
   * Get commands by name
   */
  public getByName(name: string, limit?: number) {
    let result: BaseCommand[]

    if(typeof name == 'undefined' || name == '') {
      result = this.container_commands.filter(e => !e.name.length)
    }
    else {
      result = this.container_commands.filter(e => e.name.indexOf(name) !== -1)
    }

    result = result.length ? result : this.container_default

    return typeof limit == 'number' && limit > 0 ? result.slice(0, limit) : result
  }

}
