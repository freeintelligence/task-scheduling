/**
 * Base error
 */
export class BaseError extends Error {

  public is_help: boolean

  constructor(message?: string) {
    super(message)

    this.is_help = true
  }

}
