import { BaseCommand } from './../interfaces'
import { Flag } from './../flags'

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
   * Reset
   * */
  public reset(only?: 'commands'|'default') {
    if(only == 'commands' || !only) this.container_commands = [];
    if(only == 'default' || !only) this.container_default = [];

    return this
  }

  /*
   * Register command
   * */
  public push(instance: BaseCommand) {
    this.container_commands.push(this.fixCommand(instance))
    return this
  }

  /**
   * Register a command in a simple way (inline)
   * @param name name for the command
   * @param description a description that will appear in the general help
   * @param flags array of flags that the command will occupy
   * @param run function to be executed when the command corresponds to the one in need
   * @return this
   */
  public pushSimple(name: string, run?: Function): this;
  public pushSimple(run: Function): this;
  public pushSimple(flags: Flag[], run?: Function): this;
  public pushSimple(name: string, description?: string, run?: Function): this;
  public pushSimple(name: string, flags?: Flag[], run?: Function): this;
  public pushSimple(name: string, run?: Function): this;
  public pushSimple(name: string | Flag[] | Function, description?: string | Flag[] | Function, flags?: Flag[] | Function, run?: Function): this {
    let _name: string
    let _description: string
    let _flags: Flag[]
    let _run: Function

    if(typeof name == 'function') _run = name;
    else if(name instanceof Array) _flags = name
    else if(typeof name == 'string' && name.length) _name = name;

    if(typeof description == 'function') _run = description;
    else if(typeof description == 'string' && description.length) _description = description;
    else if(description instanceof Array) _flags = description;

    if(typeof flags == 'function') _run = flags;
    else if(flags instanceof Array) _flags = flags;

    if(typeof run == 'function') _run = run;

    const command = class implements BaseCommand {
      public name: string = _name
      public description: string = _description
      public flags = _flags

      async run(data) {
        return typeof _run === 'function' ? await _run(data) : null
      }
    }

    return this.push(new command())
  }

  /*
   * Register default command
   * */
  public default(instance: BaseCommand) {
    this.container_default.push(this.fixCommand(instance))
  }

  /*
   * Register (simple) default command
   * */
  public defaultSimple(run: Function) {
    const command = class implements BaseCommand {
      async run(data) {
        return await run(data)
      }
    }

    this.default(new command())
  }

  /*
   * Fix command instance
   * */
  private fixCommand(instance: BaseCommand) {
    if(typeof instance.name !== 'string' || !instance.name.length) {
      instance.name = undefined
    }
    else {

    }

    if(typeof instance.description !== 'string' || !instance.description.length) {
      instance.description = undefined
    }
    if(typeof instance.flags !== 'object' || instance.flags == null || !(instance instanceof Object)) {
      instance.flags = { }
    }
    if(typeof instance.run !== 'function') {
      instance.run = async () => { }
    }
    return instance
  }

  /*
   * Get commands by tasks
   * */
  public async getByTasks(tasks: string[]) {

  }

}
