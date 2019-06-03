import { Scheduler } from './../../scheduler.class'
import { BaseMiddletask } from './../../middletasks'
import { BaseCommand } from './../../commands'
import { Flag } from './../../flags'

/**
 * Global help flag
 */
export class GlobalHelpFlagMiddletask extends BaseMiddletask {

  protected scheduler: Scheduler
  protected command: BaseCommand
  protected flags: { [name: string]: Flag }

  /**
   * Handle method
   */
  async handle() {
    if(!this.flags.help.value) return true;

    this.scheduler.helper.reset()

    if(this.command && this.command.getMainName() && this.command.getMainName().length) {
      this.scheduler.helper.setHeader(this.command.getCompleteName())
      this.scheduler.helper.setFlags(this.command.getFlagsLikeArray())
    }
    else {
      this.scheduler.helper.setHeaderDefault()
      this.scheduler.helper.setCommands(this.scheduler.commands.getAll())
      this.scheduler.helper.setFlags(this.scheduler.flags.getAll())
    }

    return this.scheduler.helper.generate().print(), false
  }

}
