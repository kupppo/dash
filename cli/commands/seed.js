const commander = require('commander')

const configCommand = () => {
  const program = new commander.Command('seed')
  program
    .command('generate', { isDefault: true })
    .action(() => {
      console.log('generate seed')
    })
  program
    .command('patch')
    .action(() => {
      console.log('patch seed')
    })
  return program
}

module.exports = configCommand
