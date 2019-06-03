import { BaseMiddletask, Inspector, BaseCommand, Flag } from './../../framework'

/**
 * Global help flag
 */
export class GlobalHelpFlag extends BaseMiddletask {

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
      
    }
  }

}
