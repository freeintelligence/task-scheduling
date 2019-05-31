import { BaseError } from './base.error'
import { Flag } from './../flags'

/**
 * Invalid flag value
 */
export class InvalidFlagValueError extends BaseError {

  flag: Flag
  expected: string
  received: string

  constructor(flag: Flag, expected: string, received: string) {
    super()

    this.flag = flag
    this.expected = expected
    this.received = received
  }

}
