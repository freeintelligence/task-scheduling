/**
 * Unknown flag
 */
export class UnknownFlagError extends Error {

  public flag: string

  constructor(flag: string) {
    super()

    this.flag = flag
  }

}
