/**
 * Invalid flag value
 */
export class InvalidFlagValueError extends Error {

  flag: string
  expected: string
  received: string

  constructor(flag: string, expected: string, received: string) {
    super()

    this.flag = flag
    this.expected = expected
    this.received = received
  }

}
