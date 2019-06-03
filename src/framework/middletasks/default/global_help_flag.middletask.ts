import { BaseMiddletask } from './../../middletasks'
import { Inspector } from './../../inspector'
import { BaseCommand } from './../../commands'
import { Flag } from './../../flags'

/**
 * Global help flag
 */
export class GlobalHelpFlagMiddletask extends BaseMiddletask {

  /**
   * Constructor
   */
  constructor(
    protected inspector: Inspector,
    protected command: BaseCommand,
    protected flags: { [key: string]: Flag }
  ) {
    super(inspector, command, flags)
  }

  /**
   * Handle method
   */
  async handle() {
    if(this.flags.help.value) {
      return false
    }
  }

}
