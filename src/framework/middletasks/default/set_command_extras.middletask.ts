import { Scheduler } from './../../scheduler.class'
import { BaseMiddletask } from './../../middletasks'
import { BaseCommand } from './../../commands'
import { Extra } from './../../extras'
import { Resource } from './../../inspector'
import { MissingExtrasError } from './../../errors'

/**
 * Set command extras
 */
export class SetCommandExtrasMiddletask extends BaseMiddletask {

  protected scheduler: Scheduler
  protected command: BaseCommand

  /**
   * Handle method
   */
  async handle() {
    const to: Extra[] = this.command.getExtrasLikeArray()
    const from: Resource[] = this.inspector.getExtras()

    for(let i = 0; i < to.length; i++) {
      const extra = to[i]

      if(extra.isRequired() && (typeof from[i] == 'undefined' || typeof from[i].value == 'undefined')) {
        throw new MissingExtrasError(this.command, extra)
      }

      extra.value = typeof from[i] !== 'undefined' ? from[i].value : extra.getDefault()

      if(from[i]) {
        from[i].used = true
      }
    }
  }

}
