import { BaseCommand } from './../commands'
import { Flag } from './../flags'

/**
 * Required flag value
 */
export class RequiredFlagValueError extends Error {

  public command: BaseCommand
  public flag: Flag

  constructor(command: BaseCommand, flag: Flag) {
    super()

    this.command = command
    this.flag = flag
  }

}
