const commander = require('commander')
const { configPath, readConfig, setupConfig, removeConfig } = require('../lib/config')
const chalk = require('chalk')

const configCommand = () => {
  const program = new commander.Command('config')
  program.description('Manage config file')
  program
    .command('get', { isDefault: true })
    .action(async () => {
      try {
        const data = await readConfig()
        // TODO: syntax highlighting
        console.log('')
        console.log(chalk.white.bold('Config:'), chalk.gray(configPath()))
        console.log('')
        console.log(data)
      } catch (err) {
        try {
          if (err.code === 'ENOENT') {
            await setupConfig()
            return
          }
          throw Error('Did not create config file.')
        } catch (err) {
          console.log('Internal err', err)
          console.log('')
          console.error(`${chalk.red.bold('No config found')}.\nRun ${chalk.cyan(`dash-rando config set`)} to create one.`)
        }
      }
    })
  program
    .command('remove')
    .aliases(['delete', 'clear'])
    .option('-f, --force', 'Skip confirmation', false)
    .action(async (options) => {
      const filePath = configPath()
      try {
        await removeConfig(options.force)
        console.log(`Cleared config from ${chalk.cyan(filePath)}`)
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`No config file found at ${chalk.cyan(filePath)}`)
        } else {
          console.error(`${chalk.red('Error removing config file at')} ${chalk.cyan(filePath)}`)
        }
      }
    })
  // program
  //   .command('set')
  //   .action(() => {
  //     console.log('set config')
  //   })
  return program
}

module.exports = configCommand
