import { ParameterDecorator } from 'ts-ext-decorators'
import { BaseCommand } from './command'
import { Flag } from './flag'
import { Flags } from './interfaces'
import { Configure } from './configure'
import { Helper } from './helper'
import { CommandNotFoundError, FlagNotFoundError, InvalidFlagValueError } from './errors'

/*
 *
 * */
export interface DataInterface {
  type?: 'flag'|'command',
  name?: string,
  value?: string,
  remaining?: any[],
}

/*
 * Scheduler
 * */
export class Scheduler {

  public configure: Configure = new Configure(this)

  private commands: BaseCommand[] = [] // Commands container
  private flags: Flag[] = [] // Flags container
  private default: BaseCommand

  /*
   * Register a command
   * */
  registerCommand(command: BaseCommand) {
    this.commands.push(command)
  }

  /*
   * Register a simple command
   * */
  registerSimpleCommand(name: string, description: string, flags: Flag[], run: Function) {
    const command = class extends BaseCommand {
      name = name
      description = description
      flags = flags

      async run(data) {
        await run(data)
      }
    }

    this.commands.push(new command())
  }

  /*
   * Register default command (not found)
   * */
  registerDefault(command: BaseCommand) {
    this.default = command
  }

  /*
   * Register simple default command (not found)
   * */
  registerSimpleDefault(run: Function) {
    const command = class extends BaseCommand {
      async run(data) {
        await run(data)
      }
    }

    this.registerDefault(new command())
  }

  /*
   * Register a flag
   * */
  registerFlag(flag: Flag) {
    this.flags.push(flag)
  }

  /*
   * Get the data
   * */
  getData(tasks: string[]): DataInterface[] {
    let data: DataInterface[] = []

    for(let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      const old = i > 0 ? tasks[i-1] : undefined
      const tmp: DataInterface = {}

      if(this.isFlag(task)) {
        tmp.type = 'flag'

        if(this.isFlagWithValue(task)) {
          const data = task.split('=')

          tmp.name = data[0]
          tmp.value = data[1]
        }
        else {
          tmp.name = task

          const next = tasks.length > i-1 ? tasks[i+1] : undefined

          if(next && !this.isFlag(next)) {
            tmp.value = next
            i++
          }
          else {
            tmp.value = ''
          }
        }
      }
      else {
        tmp.type = 'command'
        tmp.name = task.trim()
      }

      tmp.remaining = tasks.slice(i)
      data.push(tmp)
    }

    return data
  }

  /*
   * Get the virtual command
   * */
  getVirtualCommand(tasks: string[]): string {
    let tasks_data = this.getData(tasks)
    let command_name = tasks_data.find(e => e.type == 'command')

    return command_name && command_name.name ? command_name.name : null
  }

  /*
   * Get the commands (all)
   * */
  getGlobalCommands(): BaseCommand[] {
    return this.commands
  }

  /*
   * Get the commands
   * */
  getCommands(tasks: string[]): BaseCommand[] {
    let virtual = this.getVirtualCommand(tasks)
    let commands: BaseCommand[] = []

    if(!virtual) commands = this.commands.filter(e => (e as any).name == '' || typeof (e as any).name == 'undefined')
    else commands = this.commands.filter(e => (e as any).name == virtual)

    if(!commands.length && !this.default && this.configure.getConfig().strict_mode_on_commands) {
      throw new CommandNotFoundError(virtual)
    }

    if(commands.length) return commands;
    if(this.default) return [this.default];

    return []
  }

  /*
   * Fix flag name (remove -)
   * */
  fixFlagName(name: string): string {
    return name.replace(/^[-]+/, '')
  }

  /*
   * Parse flags value
   * */
  parseFlagsValue(flag: Flag, type: 'string'|'boolean'|'object'|'number'|'array', subtype: 'string'|'boolean'|'object'|'number', value: string, remaining?: any[]) {
    if(type == 'string') return value
    else if(type == 'boolean') {
      const val = value.toLowerCase()

      if(val == 'false' || val === '0') return false
      else if(val == '' || val == 'true' || val === '1') return true
    }
    else if(type == 'number') {
      const val = Number(value)

      if(!isNaN(val)) return val
    }
    else if(type == 'object') {
      try {
        const val = JSON.parse(value)
        return val
      }
      catch(_err) { }
    }
    else if(type == 'array') {
      const val: any[] = []

      for(let i = 0; i < remaining.length; i++) {
        val.push(this.parseFlagsValue(flag, subtype, null, remaining[i]))
      }
      return val
    }

    throw new InvalidFlagValueError(flag)
  }

  /*
   * Get the flags and their values by string
   * */
  getVirtualFlags(tasks: string[]) {
    return this.getData(tasks).filter(e => e.type == 'flag')
  }

  /*
   * Get flags by container
   * */
  getSpecificFlags(tasks: string[], flags: Flag[]) {
    const container: Flag[] = []
    const virtual = this.getVirtualFlags(tasks)

    for(let i = 0; i < flags.length; i++) {
      const flag = flags[i]
      const virtual_data = virtual.find(e =>  this.isFlagAlias(e.name) ? this.fixFlagName(e.name) === flag.options.alias : this.fixFlagName(e.name) === flag.name)

      if(virtual_data) {
        flag.value = this.parseFlagsValue(flag, flag.options.type, flag.options.subtype, virtual_data.value, virtual_data.remaining)
      }
      else {
        flag.value = flag.options.default
      }

      container.push(flag)
    }

    return container
  }

  /*
   * Get the global flags
   * */
  getGlobalFlags(tasks: string[] = []): Flag[] {
    return this.getSpecificFlags(tasks, this.flags)
  }

  /*
   * Get the flags of a command
   * */
  getCommandFlags(tasks: string[], command: BaseCommand): Flag[] {
    return this.getSpecificFlags(tasks, command && command.flags ? command.flags : [])
  }

  /*
   * Get the "transparent" flags (that are not registered)
   * */
  getTransparentFlags(tasks: string[], command?: BaseCommand): Flag[] {
    const flags: Flag[] = []
    const virtual = this.getVirtualFlags(tasks)

    for(let i = 0; i < virtual.length; i++) {
      const current = virtual[i]
      const name = this.fixFlagName(current.name)

      // The flag is not registered in the global or command flags
      if(!this.flags.find(e => e.name == name || e.options.alias == name) && (command && !command.flags.find(e => e.name == name || e.options.alias == name))) {
        flags.push(new Flag(name))
      }
    }

    return this.getSpecificFlags(tasks, flags)
  }

  /*
   * Flags to simple object
   * */
  flagsToSimple(flags: Flag[]): Flags {
    const simple: Flags = { }

    for(let i = 0; i < flags.length; i++) {
      simple[flags[i].name] = flags[i]
    }

    return simple
  }

  /*
   * Is flag (complete name or alias)
   * */
  isFlag(task: string): boolean {
    if(task == '--' || task == '-') return false

    return /^(\-{1,2})(.+)$/g.test(task)
  }

  /*
   * Is flag alias (only alias)
   **/
  isFlagAlias(task: string): boolean {
    return /^\-([^\-])+$/g.test(task)
  }

  /*
   * Is flag (complete name or alias) with value (in the same line)
   * */
  isFlagWithValue(task: string): boolean {
    if(!this.isFlag(task)) return false

    return task.indexOf('=') !== -1
  }

  /*
   * Get help message
   * */
  help(): string {
    return new Helper().header().commands(this.getGlobalCommands()).flags(this.getGlobalFlags()).generate().getMessage()
  }

  /*
   * Execute a command
   * */
  async execute(tasks: string[]) {
    try {
      const commands = this.getCommands(tasks)

      const gflags = this.getGlobalFlags(tasks)

      for(let i = 0; i < commands.length; i++) {
        const command = commands[i]

        const cflags = this.getCommandFlags(tasks, command)
        const tflags = this.getTransparentFlags(tasks, command)
        const sflags = this.flagsToSimple(gflags.concat(cflags, tflags))

        if(this.configure.getConfig().global_help && sflags.help.value) {
          const helper: Helper = new Helper()

          if(command && typeof command.name == 'string' && command.name.length) {
            helper.header(command.name).flags(gflags.concat(cflags))
          }
          else {
            helper.header().commands(this.commands).flags(gflags)
          }

          helper.generate().print()

          if(this.configure.getConfig().exit_on_help) {
            process.exit()
          }
        }

        if(tflags.length && this.configure.getConfig().strict_mode_on_flags) {
          throw new FlagNotFoundError(tflags[0].name, tflags[0].value, command)
        }

        const method = ParameterDecorator.method(command, 'run')

        if(method) {
          try {
            await command[method]({ flags: sflags })

            return 1
          }
          catch(_err) {
            this.configure.getConfig().catch(_err)
          }
        }
      }

      return commands.length
    }
    catch(err) {
      if(err instanceof CommandNotFoundError) {
        new Helper().error(err.message).header().commands(this.commands).flags(this.getGlobalFlags(tasks)).generate().print()
      }
      else if(err instanceof FlagNotFoundError) {
        if(err.command && err.command.name) {
          new Helper().error(err.message).header(err.command.name).flags(this.getGlobalFlags(tasks).concat(err.command.flags)).generate().print()
        }
        else {
          new Helper().error(err.message).header().commands(this.commands).flags(this.getGlobalFlags(tasks)).generate().print()
        }
      }
      else if(err instanceof InvalidFlagValueError) {
        new Helper().error(err.message).generate().print()
      }
      else {
        console.error(err.stack)
      }
    }
  }

  /*
   * Execute a command by process argv
   * */
  async executeByProcess() {
    const command = process.argv.length > 2 ? process.argv.slice(2) : []
    return await this.execute(command)
  }

}
