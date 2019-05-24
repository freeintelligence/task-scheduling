import { Commands } from './commands.class'

describe('Commands instance', () => {

  const commands = new Commands()

  beforeEach(() => {
    commands.reset()
  })

  test('Reset commands', () => {
    expect(commands.getAll()).toEqual([])
  })

  test('Push command', () => {
    expect(commands.getAll()).toHaveLength(0)
    expect(commands.pushSimple('reflejo', () => '"reflejo" command').getAll()).toHaveLength(1)
  })

  test('Push default', () => {
    expect(commands.getDefaults()).toHaveLength(0)
    expect(commands.defaultSimple(() => '"default" command').getDefaults()).toHaveLength(1)
  })

  test('Get commands by name', () => {
    expect(commands.getByName('')).toHaveLength(0)
    expect(commands.getByName('this-exists')).toHaveLength(0)
    expect(commands.getByName('not-exists')).toHaveLength(0)

    commands.pushSimple(() => 'empty command')

    expect(commands.getByName('')).toHaveLength(1)
    expect(commands.getByName('this-exists')).toHaveLength(0)
    expect(commands.getByName('not-exists')).toHaveLength(0)
    
    commands.pushSimple('this-exists', () => '"this-exists" command')

    expect(commands.getByName('')).toHaveLength(1)
    expect(commands.getByName('this-exists')).toHaveLength(1)
    expect(commands.getByName('not-exists')).toHaveLength(0)

    commands.defaultSimple(() => 'command not found')

    expect(commands.getByName('')).toHaveLength(1)
    expect(commands.getByName('this-exists')).toHaveLength(1)
    expect(commands.getByName('not-exists')).toHaveLength(1)
  })

})
