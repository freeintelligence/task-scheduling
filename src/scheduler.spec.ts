import { Scheduler } from './scheduler.class'
import { ExtraNotFoundError } from './errors'

describe('Scheduler instance', () => {

  const scheduler = new Scheduler()

  test('More than one command with the same name', async () => {
    expect.assertions(1)

    scheduler.registerSimpleCommand('first', 'without description', [], () => 10)
    scheduler.registerSimpleCommand('first', 'without description', [], () => 20)

    await expect(scheduler.execute(['first'])).resolves.toEqual([10, 20])
  })

  test('Additional arguments (required) to the name of the command', async () => {
    scheduler.registerSimpleCommand('second <name>', 'without description', [], ({ extra }) => extra.name)

    await expect(scheduler.execute(['second'])).rejects.toThrow(new ExtraNotFoundError('second', '<name>'))
  })

  test('Additional arguments (optional) to the name of the command', async () => {
    scheduler.registerSimpleCommand('third <name?>', 'without description', [], ({ extra }) => extra.name)

    await expect(scheduler.execute(['third'])).resolves.toEqual([undefined])
  })

})
