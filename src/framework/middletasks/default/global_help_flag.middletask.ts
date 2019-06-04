import { BaseMiddletask } from './../../middletasks'

/**
 * Global help flag
 */
export class GlobalHelpFlagMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    if(!this.scheduler.config.global_help || !this.flags.help.value) return true;

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
