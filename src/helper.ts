import { magenta, red, cyan, italic, gray } from 'colors/safe'
import { Flag } from './flag'
import { BaseCommand } from './command'

/*
 * Helper messages in the console
 * */
export class Helper {

  private msg: string = '' // Message to print
  private error_msg: string // Error message
  private header_msg: string // Header message
  private flags_msg: string // Flags message
  private commands_msg: string // Commands message

  /*
   * Is null or undefined
   * */
  private nullOrUndefined(value: any): boolean {
    return value == null || typeof value == 'undefined'
  }

  /*
   * Set error message
   * */
  public error(str?: string) {
    this.error_msg =
      red(` Error: `)+'\n'+
      `    ${str}`
    return this
  }

  /*
   * Set header string
   * */
  public header(str: string = 'comando') {
    this.header_msg =
      magenta(' Uso: ')+'\n'+
      `    ${str} [opciones]`
    return this
  }

  /*
   * Set flags string by flags array
   * */
  public flags(flags: Flag[]) {
    this.flags_msg = magenta(' Opciones: ')

    if(flags instanceof Array && flags.length) {
      flags.forEach((flag: Flag) => {
        this.flags_msg += '\n'+cyan(('   '+(this.nullOrUndefined(flag.options.alias) ? '  ' : '-'+flag.options.alias)+' '+'[--'+flag.name+'='+flag.options.default+']').padEnd(48))
        this.flags_msg += typeof flag.options.description != 'undefined' ? flag.options.description : ''
      })
    }
    else {
      this.flags_msg += '\n   -- sin opciones --'
    }

    return this
  }

  /*
   * Set commands string by commands array
   * */
  public commands(commands: BaseCommand[]) {
    let separator: string
    this.commands_msg = magenta(' Comandos disponibles: ')

    commands
    .filter((command: BaseCommand) => typeof command.name == 'string' && command.name.length)
    .sort((a: BaseCommand, b: BaseCommand) => Number(a.name > b.name))
    .sort((a: BaseCommand, b: BaseCommand) => a.name.indexOf(':'))
    .forEach((command: BaseCommand) => {
      if(command.name.indexOf(':') !== -1 && command.name.split(':')[0] !== separator) {
        separator = command.name.split(':')[0]

        this.commands_msg += '\n  '+italic(magenta(separator))
      }

      this.commands_msg += '\n'
      this.commands_msg += cyan(('   '+command.name).padEnd(48))
      this.commands_msg += '⇒ '+(typeof command.description == 'string' ? command.description : '---')

      if(command.flags instanceof Array && command.flags.length) {
        command.flags.forEach((flag: Flag) => {
          this.commands_msg += '\n'
          this.commands_msg += gray(('     '+(this.nullOrUndefined(flag.options.alias) ? '  ' : '-'+flag.options.alias)+' '+'[--'+flag.name+'='+flag.options.default+']').padEnd(48))
          this.commands_msg += typeof flag.options.description == 'string' && flag.options.description.length  ? '  ⇒ '+flag.options.description : '  ⇒ ---'
        })
      }
    })

    return this
  }

  /*
   * Generate message by messages
   * */
  public generate() {
    this.msg = ''

    if(typeof this.error_msg == 'string' && this.error_msg.length) this.msg += `${this.error_msg}\n\n`
    if(typeof this.header_msg == 'string' && this.header_msg.length) this.msg += `${this.header_msg}\n\n`
    if(typeof this.flags_msg == 'string' && this.flags_msg.length) this.msg += `${this.flags_msg}\n\n`
    if(typeof this.commands_msg == 'string' && this.commands_msg.length) this.msg += `${this.commands_msg}\n\n`

    this.msg = this.msg.trimRight()

    if(this.msg.length) this.msg = `\n${this.msg}\n`

    return this
  }

  /*
   * Print message
   * */
  public print() {
    console.log(this.msg)
    return this
  }

  /*
   * Get message
   * */
  public getMessage(): string {
    return this.msg
  }

}