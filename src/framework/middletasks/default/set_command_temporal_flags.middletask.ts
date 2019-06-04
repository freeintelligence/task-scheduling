import { BaseMiddletask } from './../../middletasks'
import { Flag } from './../../flags'
import { UnknownFlagError } from './../../errors'

/**
 * Set command temporal flags
 */
export class SetCommandTemporalFlagsMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    this.inspector.getFlags().filter(e => !e.used).forEach(flag => {
      if(this.scheduler.config.strict_mode_on_flags) throw new UnknownFlagError(flag.name);

      const instance = new Flag(flag.name, { default: flag.value, type: 'string', temporal: true })
      this.command.addTemporalFlag(instance)

      instance.value = flag.value
      flag.used = true
    })
  }

  /**
   * Terminate method
   */
  async terminate() {
    this.command.removeTemporalFlags()
  }

}
