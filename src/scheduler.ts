import { ParameterDecorator } from 'ts-ext-decorators'
import { BaseCommand } from './command'
import { Flag } from './flag'
import { Flags } from './types'

export interface DataInterface {
  type?: 'flag'|'command',
  name?: string,
  value?: string,
}

/*
 * Scheduler
 * */
export class Scheduler {

  private static commands: BaseCommand[] = [] // Commands container
  private static flags: Flag[] = [] // Flags container
  private static default: BaseCommand

  /*
   * Register a command
   * */
  static registerCommand(command: BaseCommand) {
    this.commands.push(command)
  }

  /*
   * Register a simple command
   * */
  static registerSimpleCommand(name: string, description: string, flags: Flag[], run: Function) {
    const command = class extends BaseCommand {
      name = name
      description = description
      flags = flags

      async run() {
        await run()
      }
    }

    this.commands.push(new command())
  }

  /*
   * Register default command (not found)
   * */
  static registerDefault(command: BaseCommand) {
    this.default = command
  }

  /*
   * Register simple default command (not found)
   * */
  static registerSimpleDefault(run: Function) {
    const command = class extends BaseCommand {
      async run() {
        await run()
      }
    }

    this.registerDefault(new command())
  }

  /*
   * Register a flag
   * */
  static registerFlag(flag: Flag) {
    this.flags.push(flag)
  }

  /*
   * Get the data
   * */
  static getData(tasks: string[]): DataInterface[] {
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

      data.push(tmp)
    }

    return data
  }

  /*
   * Get the virtual command
   * */
  static getVirtualCommand(tasks: string[]): string {
    let tasks_data = this.getData(tasks)
    let command_name = tasks_data.find(e => e.type == 'command')

    return command_name && command_name.name ? command_name.name : null
  }

  /*
   * Get the command
   * */
  static getCommand(tasks: string[]): BaseCommand {
    let virtual = this.getVirtualCommand(tasks)
    let command: BaseCommand

    if(!virtual) command = this.commands.find(e => (e as any).name == '' || typeof (e as any).name == 'undefined')
    else command = this.commands.find(e => (e as any).name == virtual)

    return command ? command : this.default
  }

  /*
   * Get the flags and their values by string
   * */
  static getVirtualFlags(tasks: string[]) {
    return this.getData(tasks).filter(e => e.type == 'flag')
  }

  /*
   * Get flags by container
   * */
  static getSpecificFlags(tasks: string[], flags: Flag[]) {
    const container: Flag[] = []
    const virtual = this.getVirtualFlags(tasks)

    for(let i = 0; i < flags.length; i++) {
      const flag = flags[i]
      const virtual_data = virtual.find(e => e.name.replace(/^[-]+/, '') == flag.name || e.name.replace(/^[-]+/, '') == flag.options.alias)

      if(virtual_data) {
        flag.value = virtual_data.value

        if(flag.options.type == Boolean && (flag.value == 'false' || flag.value == 'FALSE' || flag.value === '0')) flag.value = false
        if(flag.options.type == Boolean && (typeof flag.value == 'string')) flag.value = true
        if(flag.options.type == Number) flag.value = Number(flag.value)
        if(flag.options.type == Object) flag.value = JSON.parse(flag.value)
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
  static getGlobalFlags(tasks: string[]): Flag[] {
    return this.getSpecificFlags(tasks, this.flags)
  }

  /*
   * Get the flags of a command
   * */
  static getCommandFlags(tasks: string[], command: BaseCommand): Flag[] {
    return this.getSpecificFlags(tasks, command && command.flags ? command.flags : [])
  }

  /*
   * Flags to simple object
   * */
  static flagsToSimple(flags: Flag[]): Flags {
    const simple: Flags = { }

    for(let i = 0; i < flags.length; i++) {
      simple[flags[i].name] = flags[i]
    }

    return simple
  }

  /*
   * Is flag (complete name or alias)
   * */
  static isFlag(task: string): boolean {
    if(task == '--' || task == '-') return false

    return /^(\-{1,2})(.+)$/g.test(task)
  }

  /*
   * Is flag alias (only alias)
   **/
  static isFlagAlias(task: string): boolean {
    return /^\-([^\-])+$/g.test(name)
  }

  /*
   * Is flag (complete name or alias) with value (in the same line)
   * */
  static isFlagWithValue(task: string): boolean {
    if(!this.isFlag(task)) return false

    return task.indexOf('=') !== -1
  }

  /*
   * Execute a command
   * */
  static async execute(tasks: string[]) {
    const command = this.getCommand(tasks)

    console.log(this.getVirtualFlags(tasks))

    if(command) {
      const gflags = this.getGlobalFlags(tasks)
      const cflags = this.getCommandFlags(tasks, command)
      const sflags = this.flagsToSimple(gflags.concat(cflags))

      const method = ParameterDecorator.method(command, 'run')

      if(method) {
        await command[method]({ flags: sflags })
      }
    }
  }

  /*
   * Execute a command by process argv
   * */
  static async executeByProcess() {
    const command = process.argv.length > 2 ? process.argv.slice(2) : []
    return await this.execute(command)
  }

}
