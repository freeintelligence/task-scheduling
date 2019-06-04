import { Helper } from './helper'
import { Configure, Settings } from './configure'
import { Inspector, Resource } from './inspector'
import { Commands, BaseCommand } from './commands'
import { Extra } from './extras'
import { Flags, Flag } from './flags'
import { Middletasks, BaseMiddletask } from './middletasks'
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
    const inspector_command = inspector.getCommand()
    const inspector_extras = inspector.getExtras()
    const inspector_flags = inspector.getFlags()
    const commands = await this.commands.getByName(inspector_command.value, limit)
    const global_flags = this.flags.getAll()
    const global_commands = this.commands.getAll()

    let last_command: BaseCommand

    try {
      if(!commands.length && this.config.strict_mode_on_commands) {
        throw new CommandNotFoundError(inspector_command.value)
      }

      for(let command of commands) {
        last_command = command

        let global_middletasks = this.middletasks.getAll()
        let command_middletasks = command.getMiddletasksLikeArray()
        let all_middletasks = global_middletasks.concat(command_middletasks)
        let all_middletasks_instances: BaseMiddletask[] = []
        let skip_command = false

        /*
        this.setTemporalExtras(command, inspector_extras.filter(e => !e.used))
        this.setTemporalFlags(command, inspector_flags.filter(e => !e.used))
        this.setGlobalFlagsToCommand(command, global_flags)*/

        for(let middletask of all_middletasks) {
          const instance = new middletask(this, command, this.flags.getAllLikeObject(), inspector)
          const response = typeof instance.handle == 'function' ? await instance.handle() : true

          all_middletasks_instances.push(instance)

          if(response === false) {
            skip_command = true
            break
          }
        }

        if(!skip_command) {
          result.push(await command.run({ flags: command.getFlagsLikeObject() }))

          for(let instance of all_middletasks_instances) {
            if(typeof instance.terminate == 'function') {
              await instance.terminate()
            }
          }
        }

        command.removeTemporalExtras()
        command.removeTemporalFlags()
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
        if(err.command.getMainName() && err.command.getMainName().length) {
          this.helper.setErrorRequiredFlagValue(err.flag.beautyName()).setHeader(err.command.getCompleteName()).setFlags(global_flags.concat(err.command.getFlagsLikeArray()))
        }
        else {
          this.helper.setErrorRequiredFlagValue(err.flag.beautyName()).setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help)
        }

        err.stack = this.helper.generate().getMessage()
      }
      else if(err instanceof InvalidFlagValueError) {
        if(last_command.getMainName() && last_command.getMainName().length) {
          this.helper.setErrorInvalidFlagValue(err.flag.beautyName(), err.expected, err.received).setHeader(last_command.getCompleteName()).setFlags(global_flags.concat(last_command.getFlagsLikeArray()))
        }
        else {
          this.helper.setErrorInvalidFlagValue(err.flag.beautyName(), err.expected, err.received).setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help)
        }

        err.stack = this.helper.generate().getMessage()
      }
      else if(err instanceof UnknownFlagError) {
        err.stack = this.helper.setErrorUnknownFlag(err.flag).setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help).generate().getMessage()
      }
      else if(err instanceof UnknownExtraError) {
        err.stack = this.helper.setErrorUnknownExtra(err.extra).setHeader(last_command.getCompleteName()).setFlags(global_flags.concat(last_command.getFlagsLikeArray())).generate().getMessage()
      }
      else if(err instanceof CustomError) {
        err.stack = this.helper.setError(err.message).setHeaderDefault().setFlags(global_flags).setCommands(global_commands, this.config.show_flags_on_help).generate().getMessage()
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
   * Try create temporal extras
   */
  private setTemporalExtras(command: BaseCommand, extras: Resource[]) {
    extras.forEach(extra => {
      if(this.config.strict_mode_on_extras) throw new UnknownExtraError(extra.value);

      const instance = new Extra('temporal-extra-'+new Date().getTime().toString(), { default: extra.value })
      command.addTemporalExtra(instance)

      instance.value = extra.value
      extra.used = true
    })
  }

  /**
   * Try create temporal flags
   */
  private setTemporalFlags(command: BaseCommand, flags: Resource[]) {
    flags.forEach(flag => {
      if(this.config.strict_mode_on_flags) throw new UnknownFlagError(flag.name);

      const instance = new Flag(flag.name, { default: flag.value, type: 'string', temporal: true })
      command.addTemporalFlag(instance)

      instance.value = flag.value
      flag.used = true
    })
  }

  /**
   *
   */
  private setGlobalFlagsToCommand(command: BaseCommand, flags: Flag[]) {
    flags.forEach(flag => {
      const instance = new Flag(flag.getAllNames(), { default: flag.value, type: flag.options.type, subtype: flag.options.subtype, description: flag.getDescription(), temporal: true })
      command.addTemporalFlag(instance)

      instance.value = flag.value
    })
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
