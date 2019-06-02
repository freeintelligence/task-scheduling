import { Inspector } from './../inspector'
import { BaseCommand } from './../commands'
import { Flag } from './../flags'

/**
 * Base middletask
 */
export class BaseMiddletask {

  constructor(protected inspector: Inspector, protected command: BaseCommand, protected flags: { [key: string]: Flag }) {

  }
  /**
   *
   */
  async handle(): Promise<any> {

  }

}
