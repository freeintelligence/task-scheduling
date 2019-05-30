/**
 * Unknown extra
 */
export class UnknownExtraError extends Error {

  public extra: string

  constructor(extra: string) {
    super()

    this.extra = extra
  }

}
