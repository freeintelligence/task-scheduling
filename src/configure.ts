/*
 * Config options
 * */
export interface ConfigInterface {
  strict_mode?: boolean,
  strict_mode_on_commands?: boolean,
  strict_mode_on_flags?: boolean,
}

/*
 * Configure package
 * */
export class Configure {

  private config: ConfigInterface = {}

  /*
   * Set configuration
   * */
  setConfig(config: ConfigInterface = {}) {
    this.config.strict_mode = typeof config.strict_mode == 'boolean' ? config.strict_mode : true
    this.config.strict_mode_on_commands = typeof config.strict_mode_on_commands == 'boolean' ? config.strict_mode_on_commands : true
    this.config.strict_mode_on_flags = typeof config.strict_mode_on_flags == 'boolean' ? config.strict_mode_on_flags : true
  }

  /*
   * Get configuration
   * */
  getConfig(): ConfigInterface {
    return this.config
  }

}
