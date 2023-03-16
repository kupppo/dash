const commander = require('commander')
const open = require('open')
const chalk = require('chalk')

const seedCommand = () => {
  const program = new commander.Command('github')
  program
    .description('Open Github repository in browser')
    .action(async () => {
      const url = 'https://github.com/dashrando/dashrando.github.io'
      console.log(chalk.gray('Opening'), chalk.cyan(url))
      await open(url)
    })
  return program
}

module.exports = seedCommand
