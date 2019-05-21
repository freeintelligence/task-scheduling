import { Configure, Settings } from './configure'
import { Commands } from './commands'
import { Flags } from './flags'
import { Middletasks } from './middletasks'

/*
 * Scheduler
 * */
export class Scheduler {

  /*
   * Instance data
   * */
  public config: Configure
  public commands: Commands
  public flags: Flags
  public middletasks: Middletasks

  /*
   * Constructor
   * */
  constructor(settings?: Settings) {
    this.config = new Configure(this)
    this.commands = new Commands()

    if(settings) {
      for(let i in settings) {
        this.config[i] = settings[i]
      }
    }
  }

  /*
   * Execute scheduler
   * */
  async execute(tasks: string[]) {
    //const commands = await this.commands.getByTasks(tasks)
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
