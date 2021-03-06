import { BaseMiddletask } from './../../middletasks'
import { Flags } from './../../flags'
import { RequiredFlagValueError } from './../../errors'

/**
 * Set command flags values
 */
export class SetCommandFlagsValuesMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    const success = Flags.setValuesByResources(this.command.getFlagsLikeArray(), this.inspector.getFlags(), this.inspector.getExtras())

    if(success !== true) {
      throw new RequiredFlagValueError(this.command, success)
    }
  }

}
