import { BaseMiddletask } from './../../middletasks'

/**
 * Reset middletask
 */
export class ResetMiddletask extends BaseMiddletask {

  /**
   * Handle method
   */
  async handle() {
    this.scheduler.helper.reset()
    this.inspector.resetUsed()
  }

}
