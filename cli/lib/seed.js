const { modes } = require('../data')
const { readConfig, setupConfig } = require('./config')

const DEFAULTS = {
  mode: modes.find(mode => mode.value === 'recall_mm').value,
}

const getOptions = async (input) => {
  const preOpts = { ...DEFAULTS, ...input }
  try {
    const config = await readConfig()
    console.log('config', config)
  } catch (err) {
    if (err.code === 'ENOENT') {
      const data = await setupConfig()
      console.log('created config', data)
      return
    }
  }
  // check for config
}

module.exports = {
  getOptions,
}
