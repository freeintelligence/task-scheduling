# task-scheduling
Development of console applications.

## Table of Contents
* [How to use](#how-to-use)
* [Aliases](#aliases)

## How to use
`main.js` / `main.ts`
```js
import { Scheduler, Flag } from 'task-scheduling'
import { ShowInfoCommand } from './commands/show-info-command'

// global flag (all commands)
Scheduler.registerFlag(new Flag('help', { alias: 'h', type: 'boolean', default: false }))
// add a command
Scheduler.registerCommand(new ShowInfoCommand())

// run / execute by a string
Scheduler.execute(['not-exists', '--help'])
Scheduler.execute(['show-info', '--data=22']) // or "node main.js show-info --data=22"
Scheduler.execute(['show-info', '--data', '22']) // or "node main.js show-info --data 22"
// run / execute by process argv
Scheduler.executeByProcess()
```
`commands/show-info-command.js` / `commands/show-info-command.ts`
```js
import { BaseCommand, Flag, Flags } from 'task-scheduling'

export class ShowInfoCommand extends BaseCommand {

  name: string = 'show-info'
  description: string = 'Show a message'
  flags: Flag[] = [
    new Flag('data', { alias: 'd', type: 'number', default: 2 })
  ]

  async run(@Flags() flags: Flags, @Flags('data') data: number) {
  console.log('What did you expect? A number? Take this:', data*2)
  }

}
```

## Aliases
Some main methods have an alias for faster, intuitive and clean code use.
```js
import { task } from 'task-scheduling'

const command_flags = [new Flag('data', { alias: 'd', type: 'number', default: 2 })]

//Scheduler.registerSimpleCommand
task('show-info', 'without description', command_flags, async ({ flags }) => {
  const data = flags.data.value
  console.log('What did you expect? A number? Take this:', data*2)
})
```
