const commander = require('commander')

const seedCommand = () => {
  const program = new commander.Command('seed')
  program
    .command('generate', { isDefault: true })
    .description('Generate a new seed')
    .option('-s, --seed [seed]', 'seed to use')
    // TODO: call this mode over preset?
    .option('-p, --preset [preset]', 'preset to use')
    .option('-v, --vanillaPath [path]', 'path to vanilla ROM')
    .action((options) => {
      console.log('generate seed opts', options)
      // Get options + defaults
      // Get config
      //   - If no config, ask to create one (with options + defaults)
      // Options = config + options + defaults
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
