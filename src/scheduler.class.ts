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
    const commands = await this.commands.getByTasks(tasks)
  }

}
