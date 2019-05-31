import { BaseError } from './base.error'

/**
 * Command not found
 */
export class CommandNotFoundError extends BaseError {

  public command_name: string

  constructor(command_name: string) {
    super()

    this.command_name = command_name
  }

}
