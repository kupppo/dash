const commander = require('commander')
const open = require('open')
const chalk = require('chalk')

const seedCommand = () => {
  const program = new commander.Command('github')
  program
    .description('Open Github in browser')
    .alias('source')
    .action(async () => {
      const url = 'https://github.com/dashrando'
      console.log(chalk.gray('Opening'), chalk.cyan(url))
      await open(url)
    })
  return program
}

module.exports = seedCommand
