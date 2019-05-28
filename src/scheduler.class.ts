import { Helper } from './helper'
import { Configure, Settings } from './configure'
import { Inspector } from './inspector'
import { Commands } from './commands'
import { Flags } from './flags'
import { Middletasks } from './middletasks'
import { CommandNotFoundError } from './errors'

/**
 * Scheduler
 */
export class Scheduler {

  /**
   * Instance data
   */
  public tasks: string[]
  public helper: Helper
  public inspector: Inspector
  public config: Configure
  public commands: Commands
  public flags: Flags
  public middletasks: Middletasks

  /**
   * Constructor
   */
  constructor(settings?: Settings);
  constructor(tasks?: string[] | Settings, settings?: Settings) {
    let _tasks: string[]
    let _settings: Settings

    if(tasks instanceof Array) _tasks = tasks;
    else if(typeof tasks == 'object' && tasks !== null) _settings = tasks;
    if(typeof settings == 'object' && settings !== null) _settings = settings;

    this.tasks = _tasks ? _tasks : this.processArgv()
    this.inspector = new Inspector(_tasks)
    this.commands = new Commands()
    this.flags = new Flags()
    this.config = new Configure(this.flags)
    this.helper = new Helper()

    if(_settings) {
      for(let i in _settings) {
        this.config[i] = _settings[i]
      }
    }
  }

  /**
   * Execute scheduler
   */
  public async execute(tasks?: string[], limit?: number) {
    const result = []
    const inspector = this.inspector.thisOr(tasks)
    const inspector_command = inspector.getCommand()
    const inspector_extras = inspector.getExtras()
    const inspector_flags = inspector.getFlags()
    const commands = await this.commands.getByName(inspector_command.value, limit)
    const global_flags = this.flags.getAll()
    const global_commands = this.commands.getAll()

    try {
      this.helper.reset().setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help)

      if(!commands.length && this.config.strict_mode_on_commands) {
        throw new CommandNotFoundError()
      }

      for(let command_index in commands) {
        const command = commands[command_index]
        const command_extras = command.getExtrasLikeObject()

        for(let extra_index = 0; extra_index < Object.keys(command_extras).length; extra_index++) {
          const command_extra = command_extras[Object.keys(command_extras)[extra_index]]

          if(typeof command_extra.getDefault() == 'undefined' && (typeof inspector_extras[extra_index] == 'undefined' || typeof inspector_extras[extra_index].value == 'undefined')) {
            throw new Error('Faltan extras!')
          }

          command_extra.value = typeof inspector_extras[extra_index] !== 'undefined' ? inspector_extras[extra_index].value : command_extra.getDefault()
        }

        result.push(await command.run({ }))
      }

      return result
    }
    catch(err) {
      if(err instanceof CommandNotFoundError) {
        err.stack = this.helper.setErrorCommandNotFound(inspector_command.value).generate().getMessage()
      }

      await this.config.catch(err)
    }
  }

  /**
   * Execute scheduler by process argv
   */
  public async executeByProcess() {
    return await this.execute(this.processArgv())
  }

  /**
   * Get process argv
   */
  private processArgv() {
    return Scheduler.processArgv()
  }

  /**
   * Get process argv
   */
  public static processArgv() {
    return process.argv.length > 2 ? process.argv.slice(2) : []
  }

}
