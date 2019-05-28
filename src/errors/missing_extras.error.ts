import { BaseCommand } from './../commands'
import { Extra } from './../extras'

/**
 * Missing extras
 */
export class MissingExtrasError extends Error {

  public command: BaseCommand
  public extra: Extra

  constructor(command: BaseCommand, extra: Extra) {
    super()

    this.command = command
    this.extra = extra
  }

}
