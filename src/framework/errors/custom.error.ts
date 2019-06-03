import { BaseError } from './base.error'

/**
 * Custom error
 */
export class CustomError extends BaseError {

  constructor(message: string) {
    super(message)
  }

}
