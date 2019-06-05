import { BaseMiddletask } from './../../middletasks'
import { Flag } from './../../flags'

/**
 * Set global flags to command (temporal flags)
 */
export class SetGlobalFlagsToCommandMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    this.scheduler.flags.getAll().forEach(flag => {
      const instance = new Flag(flag.getAllNames(), { default: flag.value, type: flag.options.type, subtype: flag.options.subtype, description: flag.getDescription(), temporal: true })
      this.command.addTemporalFlag(instance)

      instance.value = flag.value
    })
  }

  /**
   * Terminate method
   */
  async terminate() {
    this.command.removeTemporalFlags()
  }

}
