import { BaseError } from './base.error'

/**
 * Unknown flag
 */
export class UnknownFlagError extends BaseError {

  public flag: string

  constructor(flag: string) {
    super()

    this.flag = flag.length == 1 ? `-${flag}` : `--${flag}`
  }

}
