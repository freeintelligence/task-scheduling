import { BaseError } from './base.error'
import { BaseCommand } from './../commands'
import { Flag } from './../flags'

/**
 * Required flag value
 */
export class RequiredFlagValueError extends BaseError {

  public command: BaseCommand
  public flag: Flag

  constructor(command: BaseCommand, flag: Flag) {
    super()

    this.command = command
    this.flag = flag
  }

}
