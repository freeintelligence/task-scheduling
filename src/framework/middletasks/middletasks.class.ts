import { BaseMiddletask } from './middletask.class'
import { ResetMiddletask, SetCommandExtrasMiddletask, GlobalHelpFlagMiddletask, SetGlobalFlagsMiddletask } from './default'

/**
 * Middletasks instance
 */
export class Middletasks {

  /**
   * Data
   */
  private container_middletasks: typeof BaseMiddletask[] = []

  /**
   * Constructor
   */
  constructor() {
    this.reset()
  }

  /**
   * Reset
   */
  public reset() {
    this.container_middletasks = []
    return this.pushDefaults()
  }

  /**
   * Push default middletasks
   */
  private pushDefaults() {
    return this
    .push(ResetMiddletask)
    .push(SetGlobalFlagsMiddletask)
    .push(SetCommandExtrasMiddletask)
    .push(GlobalHelpFlagMiddletask)
  }

  /**
   * Register middletask
   */
  public push(constructor: typeof BaseMiddletask) {
    this.container_middletasks.push(constructor)
    return this
  }

  /**
   * Get all middletasks
   */
  public getAll() {
    return this.container_middletasks
  }

}
