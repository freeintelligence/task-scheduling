import { BaseError } from './base.error'
import { BaseCommand } from './../commands'
import { Extra } from './../extras'

/**
 * Missing extras
 */
export class MissingExtrasError extends BaseError {

  public command: BaseCommand
  public extra: Extra

  constructor(command: BaseCommand, extra: Extra) {
    super()

    this.command = command
    this.extra = extra
  }

}
