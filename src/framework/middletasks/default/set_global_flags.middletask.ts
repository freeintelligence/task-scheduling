import { BaseMiddletask } from './../../middletasks'
import { Flags } from './../../flags'
import { RequiredFlagValueError } from './../../errors'

/**
 * Set global flags
 */
export class SetGlobalFlagsMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    const success = Flags.setValuesByResources(Object.values(this.flags), this.inspector.getFlags(), this.inspector.getExtras())

    if(success !== true) {
      throw new RequiredFlagValueError(this.command, success)
    }
  }

}
