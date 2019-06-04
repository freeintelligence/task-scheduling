import { BaseMiddletask } from './../../middletasks'
import { MissingExtrasError } from './../../errors'

/**
 * Set command extras
 */
export class SetCommandExtrasMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    const to = this.command.getExtrasLikeArray()
    const from = this.inspector.getExtras()

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
