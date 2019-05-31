import { BaseError } from './base.error'

/**
 * Unknown extra
 */
export class UnknownExtraError extends BaseError {

  public extra: string

  constructor(extra: string) {
    super()

    this.extra = extra
  }

}
