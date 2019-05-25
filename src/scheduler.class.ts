import { Helper } from './helper'
import { Configure, Settings } from './configure'
import { Inspector } from './inspector'
import { Commands } from './commands'
import { Flags } from './flags'
import { Middletasks } from './middletasks'

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
    try {
      const result = []
      const command_name = this.inspector.thisOr(tasks).getCommand().name
      const commands = await this.commands.getByName(command_name, limit)

      this.helper.setHeaderDefault().setFlags(this.flags.getAll()).setCommands(this.commands.getAll(), this.config.show_flags_on_help)

      if(!commands.length && this.config.strict_mode_on_commands) {
        this.helper.setErrorCommandNotFound(command_name).generate().print()
        return []
      }
      else {
        for(let i in commands) {
          const command = commands[i]

          result.push(await command.run({ }))
        }
      }

      return result
    }
    catch(err) {
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
