import { Flags, Flag } from './../flags'

/*
 * Settings
 * */
export interface Settings {
  strict_mode?: boolean,
  strict_mode_on_commands?: boolean,
  strict_mode_on_flags?: boolean,
  global_help?: boolean,
  description_help?: string
  exit_on_help?: boolean,
  catch?: (err: Error) => any,
}

/*
 * Configure scheduler instance
 * */
export class Configure implements Settings {

  /*
   * Settings
   * */
  private _strict_mode?: boolean
  private _strict_mode_on_commands?: boolean
  private _strict_mode_on_flags?: boolean
  private _global_help?: boolean
  private _description_help?: string
  private _exit_on_help?: boolean
  private _show_flags_on_help?: boolean
  private _catch?: (err: Error) => any

  /**
   * Parent instances
   */
  public flags: Flags

  /*
   * Constructor
   * */
  constructor(flags: Flags) {
    this.flags = flags

    this.strict_mode = true
    this.strict_mode_on_commands = true
    this.strict_mode_on_flags = true
    this.global_help = true
    this.exit_on_help = true
    this.show_flags_on_help = true
    this.catch = (err) => { throw err }
  }

  /**
   * Set and get strict mode
   */
  set strict_mode(value: boolean) {
    this._strict_mode = value

    this.strict_mode_on_commands = value
    this.strict_mode_on_flags = value
  }
  get strict_mode() {
    return this._strict_mode
  }

  /**
   * Set and get strict mode on commands
   */
  set strict_mode_on_commands(value: boolean) {
    this._strict_mode_on_commands = value
  }
  get strict_mode_on_commands() {
    return this._strict_mode_on_commands
  }

  /**
   * Set and get strict mode on flags
   */
  set strict_mode_on_flags(value: boolean) {
    this._strict_mode_on_flags = value
  }
  get strict_mode_on_flags() {
    return this._strict_mode_on_flags
  }

  /**
   * Set and get global help
   */
  set global_help(value: boolean) {
    this._global_help = value

    if(value) {
      if(!this.flags.exists('help')) {
        this.flags.push(new Flag('help', { alias: 'h', default: false, type: 'boolean', description: this.description_help } ))
      }
    }
    else {
      this.flags.remove('help')
    }
  }
  get global_help() {
    return this._global_help
  }

  /**
   * Set and get description help (flag description)
   */
  set description_help(value: string) {
    this._description_help = value
  }
  get description_help() {
    return this._description_help || 'Show help'
  }

  /**
   * Set and get exit on help
   */
  set exit_on_help(value: boolean) {
    this._exit_on_help = value
  }
  get exit_on_help() {
    return this._exit_on_help
  }

  /**
   * Set and get show flags on help
   */
  set show_flags_on_help(value: boolean) {
    this._show_flags_on_help = value
  }
  get show_flags_on_help() {
    return this._show_flags_on_help
  }

  /**
   * Set and get catcher
   */
  set catch(value: (err: Error) => any) {
    this._catch = value
  }
  get catch() {
    return this._catch
  }

}
