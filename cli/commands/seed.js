const commander = require('commander')
const { getOptions, validateOptions } = require('../lib/seed')

const seedCommand = () => {
  const program = new commander.Command('seed')
  program.description('Generate a new seed')
  program
    .command('generate', { isDefault: true })
    .description('Generate a new seed')
    .option('-s, --seed [seed]', 'seed to use')
    // TODO: call this mode over preset?
    .option('-p, --preset [preset]', 'preset to use')
    .option('-v, --vanillaPath [path]', 'path to vanilla ROM')
    .option('-s, --seed [number]', 'seed number to use')
    .action(async (flags) => {
      const options = await getOptions(flags)
      validateOptions(options)
      console.log('it passed')
      // Validate options
      // Roll seed
      // Save seed to file
      // Display file path to seed
      // Display URL to seed
    })
  // program
  //   .command('patch')
  //   .action(() => {
  //     console.log('patch seed')
  //   })
  return program
}

module.exports = seedCommand
