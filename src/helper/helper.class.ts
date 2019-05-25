import * as Util from 'util'
import { magenta, red, cyan, italic, gray } from 'colors/safe'
import { BaseCommand } from './../interfaces'
import { Flag } from './../flags'

/**
 * Translation messages
 */
export class HelpTranslations {
  error: string
  usage: string
  command: string
  options: string
  without_options?: string
  command_not_found: string
}

/**
 * Individual messages
 */
export class HelpMessages {
  generated?: string
  error?: string
  header?: string
  flags?: string
}

/*
 * Helper messages in the console
 * */
export class Helper {

  /**
   * Instance data
   */
  public translations: HelpTranslations
  public messages: HelpMessages = { }

  /**
   * Constructor
   */
  constructor() {
    this.translations = {
      error: 'Error',
      usage: 'Use',
      command: 'command',
      options: 'Options',
      without_options: 'without options',
      command_not_found: 'The command "%s" does not exist.',
    }
  }

  /*
   * Set error message
   * */
  public setError(str?: string, ...args: string[]) {
    if(typeof str == 'undefined') {
      this.messages.error = undefined
    }
    else {
      str = Util.format(str, ...args)
      this.messages.error =
        red(` ${this.translations.error}: `)+'\n'+
        `    ${str}`
    }
    return this
  }

  /**
   * Set error message: command not found
   */
  public setErrorCommandNotFound(command_name: string) {
    return this.setError(this.translations.command_not_found, command_name)
  }

  /*
   * Set header string
   * */
  public setHeader(str?: string) {
    if(typeof str == 'undefined') {
      this.messages.header = undefined
    }
    else {
      this.messages.header =
        magenta(` ${this.translations.usage}: `)+'\n'+
        `    ${str} [${this.translations.options.toLowerCase()}]`
    }
    return this
  }

  /**
   * Set default header string
   */
  public setHeaderDefault() {
    return this.setHeader(this.translations.command)
  }

  /**
   * Set global flags
   */
  public setFlags(flags: Flag[]) {
    this.messages.flags = magenta(` ${this.translations.options}: `)

    if(flags instanceof Array && flags.length) {
      flags.forEach((flag: Flag) => {
        //console.log(flag)
        this.messages.flags += '\n'+cyan(('   '+(Helper.nullOrUndefined(flag.options.alias) ? '  ' : '-'+flag.options.alias)+' '+'[--'+flag.name+'='+flag.options.default+']').padEnd(48))
        this.messages.flags += typeof flag.options.description != 'undefined' ? flag.options.description : ''
      })
    }
    else {
      this.messages.flags += `\n   -- ${this.translations.without_options} --`
    }

    return this
  }

  /*
   * Generate message by messages
   * */
  public generate() {
    this.messages.generated = ''

    if(typeof this.messages.error == 'string' && this.messages.error.length) this.messages.generated += `${this.messages.error}\n\n`;
    if(typeof this.messages.header == 'string' && this.messages.header.length) this.messages.generated += `${this.messages.header}\n\n`;
    if(typeof this.messages.flags == 'string' && this.messages.flags.length) this.messages.generated += `${this.messages.flags}\n\n`;

    this.messages.generated = this.messages.generated.trimRight()

    if(this.messages.generated.length) this.messages.generated = `\n${this.messages.generated}\n`

    return this
  }

  /*
   * Print message
   * */
  public print() {
    console.log(this.messages.generated)
    return this
  }

  /*
   * Get message
   * */
  public getMessage(): string {
    return this.messages.generated
  }

  /*
   * Is null or undefined
   * */
  private static nullOrUndefined(value: any): boolean {
    return value == null || typeof value == 'undefined'
  }

}