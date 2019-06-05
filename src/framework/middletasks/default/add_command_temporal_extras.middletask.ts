import { BaseMiddletask } from './../../middletasks'
import { Extra } from './../../extras'
import { UnknownExtraError } from './../../errors'

/**
 * Add to command temporal extras
 */
export class AddCommandTemporalExtrasMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    this.inspector.getExtras().filter(e => !e.used).forEach(extra => {
      if(this.scheduler.config.strict_mode_on_extras) throw new UnknownExtraError(extra.value);

      const instance = new Extra('temporal-extra-'+new Date().getTime().toString(), { default: extra.value })
      this.command.addTemporalExtra(instance)

      instance.value = extra.value
      extra.used = true
    })
  }

  /**
   * Terminate method
   */
  async terminate() {
    this.command.removeTemporalExtras()
  }

}
