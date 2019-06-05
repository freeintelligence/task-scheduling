import { Helper } from './helper'
import { Configure, Settings } from './configure'
import { Inspector } from './inspector'
import { Commands, BaseCommand } from './commands'
import { Flags } from './flags'
import { Middletasks } from './middletasks'
import { CommandNotFoundError, MissingExtrasError, RequiredFlagValueError, InvalidFlagValueError, UnknownFlagError, UnknownExtraError, CustomError } from './errors'

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
    this.middletasks = new Middletasks()
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
    const commands = await this.commands.getByName(inspector.getCommand().value, limit)

    let command: BaseCommand

    try {
      if(!commands.length && this.config.strict_mode_on_commands) {
        throw new CommandNotFoundError(inspector.getCommand().value)
      }

      skip_command:
      for(command of commands) {
        const middletasks_instances = this.middletasks.getAll().concat(command.getMiddletasksLikeArray()).map(constructor => new constructor(this, command, this.flags.getAllLikeObject(), inspector))

        for(let instance of middletasks_instances) {
          if((typeof instance.handle == 'function' ? await instance.handle() : true) === false) {
            continue skip_command
          }
        }

        result.push(await command.run({ flags: command.getFlagsLikeObject() }))

        for(let instance of middletasks_instances) {
          if(typeof instance.terminate == 'function') {
            await instance.terminate()
          }
        }
      }

      return result
    }
    catch(err) {
      if(err instanceof CommandNotFoundError) {
        err.stack = this.helper.setErrorCommandNotFound(err.command_name).setHeaderDefault().setFlags(this.flags.getAll()).setCommands(this.commands.getAll(), this.config.show_flags_on_help).generate().getMessage()
      }
      else if(err instanceof MissingExtrasError) {
        err.stack = this.helper.setErrorMissingExtra(err.command.getMainName(), err.extra.beautyName()).setHeader(err.command.getCompleteName()).setFlags(this.flags.getAll().concat(err.command.getFlagsLikeArray())).generate().getMessage()
      }
      else if(err instanceof RequiredFlagValueError) {
        if(err.command.getMainName() && err.command.getMainName().length) {
          this.helper.setErrorRequiredFlagValue(err.flag.beautyName()).setHeader(err.command.getCompleteName()).setFlags(this.flags.getAll().concat(err.command.getFlagsLikeArray()))
        }
        else {
          this.helper.setErrorRequiredFlagValue(err.flag.beautyName()).setHeaderDefault().setFlags(this.flags.getAll()).setCommands(this.commands.getAll(), this.config.show_flags_on_help)
        }

        err.stack = this.helper.generate().getMessage()
      }
      else if(err instanceof InvalidFlagValueError) {
        if(command.getMainName() && command.getMainName().length) {
          this.helper.setErrorInvalidFlagValue(err.flag.beautyName(), err.expected, err.received).setHeader(command.getCompleteName()).setFlags(this.flags.getAll().concat(command.getFlagsLikeArray()))
        }
        else {
          this.helper.setErrorInvalidFlagValue(err.flag.beautyName(), err.expected, err.received).setHeaderDefault().setFlags(this.flags.getAll()).setCommands(this.commands.getAll(), this.config.show_flags_on_help)
        }

        err.stack = this.helper.generate().getMessage()
      }
      else if(err instanceof UnknownFlagError) {
        err.stack = this.helper.setErrorUnknownFlag(err.flag).setHeaderDefault().setFlags(this.flags.getAll()).setCommands(this.commands.getAll(), this.config.show_flags_on_help).generate().getMessage()
      }
      else if(err instanceof UnknownExtraError) {
        err.stack = this.helper.setErrorUnknownExtra(err.extra).setHeader(command.getCompleteName()).setFlags(this.flags.getAll().concat(command.getFlagsLikeArray())).generate().getMessage()
      }
      else if(err instanceof CustomError) {
        err.stack = this.helper.setError(err.message).setHeaderDefault().setFlags(this.flags.getAll()).setCommands(this.commands.getAll(), this.config.show_flags_on_help).generate().getMessage()
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
