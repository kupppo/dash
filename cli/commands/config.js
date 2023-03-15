const commander = require('commander')

const configCommand = () => {
  const program = new commander.Command('config')
  program
    .command('get')
    .action(() => {
      console.log('get config')
    })
  program
    .command('set')
    .action(() => {
      console.log('set config')
    })
  return program
}

module.exports = configCommand
