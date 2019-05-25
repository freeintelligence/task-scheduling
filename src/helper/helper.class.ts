import * as Util from 'util'
import { magenta, red, cyan, italic, gray } from 'colors/safe'
import { BaseCommand } from './../commands'
import { Flag } from './../flags'

/**
 * Translation messages
 */
export class HelpTranslations {
  error: string
  usage: string
  command: string
  options: string
  global_options: string
  without_options: string
  command_not_found: string
  available_commands: string
}

/**
 * Individual messages
 */
export class HelpMessages {
  generated?: string
  error?: string
  header?: string
  flags?: string
  commands?: string
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
      options: 'options',
      global_options: 'Options',
      without_options: 'without options',
      command_not_found: 'The command "%s" does not exist.',
      available_commands: 'Available commands',
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
        `    ${str} [${this.translations.options}]`
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
    this.messages.flags = magenta(` ${this.translations.global_options}: `)

    if(flags instanceof Array && flags.length) {
      flags.forEach((flag: Flag) => {
        this.messages.flags += '\n'+cyan(('   '+(Helper.nullOrUndefined(flag.mainAlias()) ? '  ' : '-'+flag.mainAlias())+' '+'[--'+(flag.mainName() ? flag.mainName() : '')+(flag.options.default ? '='+flag.options.default : '')+']').padEnd(48))
        this.messages.flags += typeof flag.options.description != 'undefined' ? flag.options.description : ''
      })
    }
    else {
      this.messages.flags += `\n   -- ${this.translations.without_options} --`
    }

    return this
  }

  /**
   * Set global commands
   */
  public setCommands(commands: BaseCommand[], show_flags: boolean = true) {
    let separator: string
    this.messages.commands = magenta(` ${this.translations.available_commands}:`)

    commands
    .filter((command: BaseCommand) => command.getMainName())
    .sort((a: BaseCommand, b: BaseCommand) => Number(a.getMainName() > b.getMainName()))
    .sort((a: BaseCommand, b: BaseCommand) => a.getMainName().indexOf(':'))
    .forEach((command: BaseCommand) => {
      const complete_name = command.getCompleteName()

      if(complete_name.indexOf(':') !== -1 && complete_name.split(':')[0] !== separator) {
        separator = complete_name.split(':')[0]

        this.messages.commands += '\n  '+italic(magenta(separator))
      }

      this.messages.commands += '\n'
      this.messages.commands += cyan(('   '+complete_name).padEnd(48))
      this.messages.commands += '⇒ '+(command.getDescription() ? command.getDescription() : '---')

      if(show_flags) {
        command.getFlagsLikeArray().forEach((flag: Flag) => {
          this.messages.commands += '\n'
          this.messages.commands += gray(('     '+(Helper.nullOrUndefined(flag.mainAlias()) ? '  ' : '-'+flag.mainAlias())+' '+'[--'+(flag.mainName() ? flag.mainName() : '')+(flag.options.default ? '='+flag.options.default : '')+']').padEnd(48))
          this.messages.commands += typeof flag.options.description == 'string' && flag.options.description.length  ? '  ⇒ '+flag.options.description : '  ⇒ ---'
        })
      }
    })

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
    if(typeof this.messages.commands == 'string' && this.messages.commands.length) this.messages.generated += `${this.messages.commands}\n\n`;

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