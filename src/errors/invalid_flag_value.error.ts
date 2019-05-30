import { Flag } from './../flags'

/**
 * Invalid flag value
 */
export class InvalidFlagValueError extends Error {

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
