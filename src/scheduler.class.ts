import { Configure, Settings } from './configure'
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
  public config: Configure
  public commands: Commands
  public flags: Flags
  public middletasks: Middletasks

  /*
   * Constructor
   * */
  constructor(settings?: Settings);
  constructor(tasks?: string[] | Settings, settings?: Settings) {
    let _tasks: string[]
    let _settings: Settings

    if(tasks instanceof Array) _tasks = tasks;
    else if(typeof tasks == 'object' && tasks !== null) _settings = tasks;
    if(typeof settings == 'object' && settings !== null) _settings = settings;

    this.config = new Configure(this)
    this.commands = new Commands(this)

    this.tasks = _tasks ? _tasks : this.processArgv()

    if(_settings) {
      for(let i in _settings) {
        this.config[i] = _settings[i]
      }
    }
  }

  /*
   * Execute scheduler
   * */
  async execute(tasks?: string[]) {
    if(!tasks) tasks = this.tasks;

    const commands = await this.commands.getByTasks(tasks)

    console.log(JSON.stringify(commands, null, 2))
  }

  /*
   * Execute scheduler by process argv
   * */
  async executeByProcess() {
    return await this.execute(this.processArgv())
  }

  /*
   * Get process argv
   * */
  processArgv() {
    return Scheduler.processArgv()
  }

  /*
   * Get process argv
   * */
  static processArgv() {
    return process.argv.length > 2 ? process.argv.slice(2) : []
  }

}
