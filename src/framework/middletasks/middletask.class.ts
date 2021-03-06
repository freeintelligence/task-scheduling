import { Scheduler } from './../scheduler.class'
import { Inspector } from './../inspector'
import { BaseCommand } from './../commands'
import { Flag } from './../flags'

/**
 * Base middletask
 */
export class BaseMiddletask {

  /**
   * Constructor
   */
  constructor(
    protected scheduler: Scheduler,
    protected command: BaseCommand,
    protected flags: { [name: string]: Flag },
    protected inspector: Inspector,
  ) { }

  /**
   * Handle method
   */
  async handle(): Promise<any> { }

  /**
   * Terminate method
   */
  async terminate(): Promise<any> { }

}
