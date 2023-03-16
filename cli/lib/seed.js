const chalk = require('chalk')
const { modes } = require('../data')
const { loadConfig, setupConfig } = require('./config')

const DEFAULTS = {
  preset: modes.find(mode => mode.value === 'recall_mm').value,
}

const randomNumber = () => Math.floor(Math.random() * 999999) + 1

const getOptions = async (input={}) => {
  if (input.seed) {
    input.seed = parseInt(input.seed)
  } else {
    input.seed = randomNumber()
  }
  const options = { ...DEFAULTS, ...input }
  try {
    const config = await loadConfig()
    return { ...config, ...options }
  } catch (err) {
    if (err.code === 'ENOENT') {
      const config = await setupConfig(input)
      return { ...config, ...options }
    }
  }
}

const validateOptions = (options={}) => {
  try {
    const { preset, seed, vanillaPath } = options
    if (!preset) {
      console.error(`${chalk.red.bold('Error')}: No preset provided.`)
      throw Error('No preset provided.')
    }
    const validPreset = modes.find(mode => mode.value === preset)
    if (!validPreset) {
      console.error(`${chalk.red.bold('Error')}: Invalid preset provided.`)
      throw Error('Invalid preset provided.')
    }

    if (!seed) {
      console.error(`${chalk.red.bold('Error')}: No seed provided.`)
      throw Error('No seed provided.')
    }

    const seedOutOfRange = seed < 1 || seed > 999999
    if (seedOutOfRange) {
      console.error(`${chalk.red.bold('Error')}: Seed must be between 1 and 999999.`)
      throw Error('Seed out of range.')
    }

    if (!vanillaPath) {
      console.error(`${chalk.red.bold('Error')}: No vanilla file provided.`)
      throw Error('No vanilla path provided.')
    }
    // TODO: validate vanillaPath

  } catch(_err) {
    console.log('')
    return process.exit(1)
  }
}

module.exports = {
  getOptions,
  validateOptions,
}
