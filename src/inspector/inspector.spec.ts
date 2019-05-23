import { Inspector } from './inspector.class'

describe('Scheduler instance', () => {

  describe('Command static methods', () => {
    test('Is command string', () => {
      expect(Inspector.isCommand('command-name')).toBeTruthy()
      expect(Inspector.isCommand('--flag-name')).toBeFalsy()
      expect(Inspector.isCommand('-f')).toBeFalsy()
    })
  })

  describe('Flag static methods', () => {
    test('Is flag string', () => {
      expect(Inspector.isFlag('test')).toBeFalsy()
      expect(Inspector.isFlag('--test')).toBeTruthy()
    })

    test('Is flag alias', () => {
      expect(Inspector.isFlagAlias('--test')).toBeFalsy()
      expect(Inspector.isFlagAlias('-t')).toBeTruthy()
    })

    test('Is flag with value', () => {
      expect(Inspector.isFlagWithValue('--test')).toBeFalsy()
      expect(Inspector.isFlagWithValue('-t=value')).toBeTruthy()
      expect(Inspector.isFlagWithValue('--test=value')).toBeTruthy()
      expect(Inspector.isFlagWithValue('--test=')).toBeTruthy()
    })

    test('Get only flag name', () => {
      expect(Inspector.getOnlyFlagName('--test')).toEqual('test')
      expect(Inspector.getOnlyFlagName('--test=value')).toEqual('test')
      expect(Inspector.getOnlyFlagName('-t')).toEqual('t')
      expect(Inspector.getOnlyFlagName('-t=value')).toEqual('t')
    })

    test('Get only flag value', () => {
      expect(Inspector.getOnlyFlagValue('--test')).toEqual('')
      expect(Inspector.getOnlyFlagValue('--test=value')).toEqual('value')
      expect(Inspector.getOnlyFlagValue('-t')).toEqual('')
      expect(Inspector.getOnlyFlagValue('-t=value')).toEqual('value')
    })
  })

  describe('Instance tests', () => {
    test('Right resources', () => {
      const inspector = new Inspector([ 'command-name', 'extra-name', '--flag-1', 'value-flag-1', '--flag-2', '-c=value', '-t' ])

      expect(inspector.resources).toEqual([
        { type: 'command', name: 'command-name' },
        { type: 'extra', name: 'extra-name' },
        { type: 'flag', name: 'flag-1', value: 'value-flag-1' },
        { type: 'flag', name: 'flag-2', value: '' },
        { type: 'flag-alias', name: 'c', value: 'value' },
        { type: 'flag-alias', name: 't', value: '' },
      ])
    })
  })

})
