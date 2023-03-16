const commander = require('commander')
const open = require('open')
const chalk = require('chalk')

const seedCommand = () => {
  const program = new commander.Command('discord')
  program
    .description('Open Discord invite in browser')
    .action(async () => {
      const url = 'https://discord.gg/WsnYSxA'
      console.log(chalk.gray('Opening'), chalk.cyan(url))
      await open(url)
    })
  return program
}

module.exports = seedCommand
