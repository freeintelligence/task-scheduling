import { Helper } from './helper'
import { Configure, Settings } from './configure'
import { Inspector, Resource } from './inspector'
import { Commands, BaseCommand } from './commands'
import { Extra } from './extras'
import { Flags, Flag } from './flags'
import { Middletasks } from './middletasks'
import { CommandNotFoundError, MissingExtrasError, RequiredFlagValueError } from './errors'

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
      this.helper.reset()

      if(!commands.length && this.config.strict_mode_on_commands) {
        throw new CommandNotFoundError(inspector_command.value)
      }

      for(let command_index in commands) {
        const command = commands[command_index]

        console.log(inspector_flags)
        this.setExtras(command, inspector_extras)
        this.setFlags(command, inspector_flags)

        result.push(await command.run({ }))
      }

      return result
    }
    catch(err) {
      if(err instanceof CommandNotFoundError) {
        err.stack = this.helper.setErrorCommandNotFound(err.command_name).setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help).generate().getMessage()
      }
      else if(err instanceof MissingExtrasError) {
        err.stack = this.helper.setErrorMissingExtra(err.command.getMainName(), err.extra.beautyName()).setHeader(err.command.getCompleteName()).setFlags(global_flags.concat(err.command.getFlagsLikeArray())).generate().getMessage()
      }
      else if(err instanceof RequiredFlagValueError) {
        if(err.command.getMainName().length) {
          this.helper.setErrorRequiredFlagValue(err.flag.beautyName()).setHeader(err.command.getCompleteName()).setFlags(global_flags.concat(err.command.getFlagsLikeArray()))
        }
        else {
          this.helper.setErrorRequiredFlagValue(err.flag.beautyName()).setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help)
        }

        err.stack = this.helper.generate().getMessage()
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
   * Set extras values
   */
  private setExtras(command: BaseCommand, from: Resource[]) {
    const to: Extra[] = command.getExtrasLikeArray()

    for(let i = 0; i < to.length; i++) {
      const extra = to[i]

      if(typeof extra.getDefault() == 'undefined' && (typeof from[i] == 'undefined' || typeof from[i].value == 'undefined')) {
        throw new MissingExtrasError(command, extra)
      }

      extra.value = typeof from[i] !== 'undefined' ? from[i].value : extra.getDefault()
    }
  }

  /**
   * Set flags values
   */
  private setFlags(command: BaseCommand, from: Resource[]) {
    const to: Flag[] = command.getFlagsLikeArray()

    for(let i = 0; i < to.length; i++) {
      const flag = to[i]
      const resource = from.find(e => (e.type == 'flag' && flag.getNames().indexOf(e.name) !== -1) || (e.type == 'flag-alias' && flag.getAliases().indexOf(e.name) !== -1))

      if(!resource && typeof flag.getDefault() == 'undefined' && this.config.strict_mode_on_flags) {
        throw new RequiredFlagValueError(command, flag)
      }

      flag.value = resource && typeof resource.value !== 'undefined' ? resource.value : flag.getDefault()
    }
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
