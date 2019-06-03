import { BaseMiddletask } from './../../middletasks'
import { Inspector } from './../../inspector'
import { Scheduler } from './../../scheduler.class'

/**
 * Reset middletask
 */
export class ResetMiddletask extends BaseMiddletask {

  protected scheduler: Scheduler
  protected inspector: Inspector

  /**
   * Handle method
   */
  async handle() {
    this.scheduler.helper.reset()
    this.inspector.resetUsed()
  }

}
