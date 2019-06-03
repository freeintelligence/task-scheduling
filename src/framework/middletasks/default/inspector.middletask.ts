import { BaseMiddletask } from './../../middletasks'
import { Inspector } from './../../inspector'

/**
 * Global help flag
 */
export class InspectorMiddletask extends BaseMiddletask {

  protected inspector: Inspector

  /**
   * Handle method
   */
  async handle() {
    this.inspector.resetUsed()
  }

}
