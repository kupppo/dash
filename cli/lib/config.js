const path = require('node:path')
const os = require('node:os')
const fs = require('node:fs/promises')
const prompts = require('prompts')
const { modes } = require('../data')
const chalk = require('chalk')

const configPath = () => path.join(os.homedir(), '.dash-rando.json')

const createConfig = async (defaults = {}) => {
  let initialPreset = modes.findIndex((mode) => mode.value === defaults.preset)
  if (initialPreset === -1) {
    initialPreset = 0
  }
  const configData = await prompts([
    {
      type: 'select',
      name: 'preset',
      message: 'Default preset to use',
      onState: onPromptState,
      initial: initialPreset,
      choices: modes
    },
    {
      type: 'text',
      name: 'vanillaPath',
      message: 'Path to vanilla ROM',
      initial: defaults.vanillaPath,
      onState: onPromptState,
      // TODO: Autocomplete in prompt for folders / files
    },
  ])
  
  const vanillaPath =
    configData.vanillaPath
    .trim()
    .replace('~/', `${os.homedir()}/`)
    .replace(/\\/g, '')
  // const validVanilla = verifyVanillaPath(vanillaPath)
  // if (!validVanilla) {
  //   console.error(chalk.red('Invalid vanilla ROM path.'))
  //   console.log('\n')
  //   process.exit(1)
  // }
  configData.vanillaPath = vanillaPath
  const dest = configPath()
  try {
    await fs.writeFile(dest, JSON.stringify(configData, null, 2))
    console.log(`${chalk.green('✔')} ${chalk.bold.white('Created config file at')} ${chalk.cyan(dest)}`)
    return configData
  } catch (err) {
    console.log('config save err', err)
    console.log(`${chalk.red('Could not create config file')} ${chalk.gray('Please try again.')}`)
  }
}

const loadConfigData = async (configPath) => {
  try {
    const filePath = configPath()
    const contents = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(contents)
  } catch (err) {
    return {}
  }
}

const readConfig = async () => {
  const filePath = configPath()
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.stringify(JSON.parse(data), null, 2)
}

const onPromptState = (state) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write('\x1B[?25h')
    process.stdout.write('\n')
    console.log('\n')
    process.exit(1)
  }
}

const removeConfig = async (force) => {
  if (!force) {
    const response = await prompts({
      type: 'toggle',
      name: 'value',
      message: 'Are you sure you want to delete your config file?',
      initial: false,
      onState: onPromptState,
      active: 'yes',
      inactive: 'no',
    })
    if (!response.value) {
      return
    }
  }
  const filePath = configPath()
  await fs.unlink(filePath)
  console.log(`Cleared config from ${chalk.cyan(filePath)}`)
}

const setupConfig = async () => {
  const response = await prompts({
    type: 'toggle',
    name: 'value',
    message: 'No config file found. Would you like to create one?',
    initial: true,
    onState: onPromptState,
    active: 'yes',
    inactive: 'no',
  })

  if (response.value) {
    return createConfig()
  }

  console.log(chalk.gray('Skipping config creation.'))
  console.log('')
  process.exit(0)
  
}

module.exports = {
  configPath,
  createConfig,
  loadConfigData,
  readConfig,
  removeConfig,
  setupConfig,
}
