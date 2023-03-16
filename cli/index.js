#!/usr/bin/env node

const { Command } = require('commander')
const os = require('node:os')
const fs =  require('node:fs')
const crypto =  require('node:crypto')
const chalk =  require('chalk')
const path = require('node:path')
const commands = require('./commands')

let VANILLA = null
const HASHES = {
  unheadered: '12b77c4bc9c1832cee8881244659065ee1d84c70c3d29e6eaf92e6798cc2ca72',
  headered: '9a4441809ac9331cdbc6a50fba1a8fbfd08bc490bc8644587ee84a4d6f924fea',
}

const debug = (message) => {
  console.log('\n')
  console.log(chalk.bgMagenta.bold(` debug `), message)
}

function readPackage() {
  const packageJson = fs.readFileSync('./package.json')
  return JSON.parse(packageJson)
}

function Header(version) {
  console.log(`${DASHLogo()}  ${chalk.gray('>')}  ${version}`)
}

function DASHLogo() {
  return (
    `${chalk.rgb(13, 186, 73)('D')} ${chalk.rgb(13, 146, 73)('A')} ${chalk.rgb(13, 116, 73)('S')} ${chalk.rgb(13, 96, 73)('H')}`
  )
}

function loadConfigData(configPath) {
  try {
    return JSON.parse(fs.readFileSync(configPath))
  } catch (err) {
    return {}
  }
}

function loadConfig(configPath) {
  const configExists = fs.existsSync(configPath)
  return {
    data: loadConfigData(configPath),
    exists: configExists,
  }
}

const verifyVanillaPath = (vanillaPath) => {
  try {
    const data = fs.readFileSync(vanillaPath)
    return verifyAndSetVanilla(data)
  } catch (err) {
    console.log(err)
    return false
  }
}

const verifyAndSetVanilla = (data) => {
  let hash = crypto.createHash('sha256')
  hash.update(data)
  const signature = hash.digest('hex')
  if (signature === HASHES.unheadered) {
    VANILLA = data
    return true
  } else if (signature === HASHES.headered) {
    console.warn(`${chalk.yellow('⚠ You have entered a headered ROM.')} ${chalk.gray('The header will now be removed.')}`)
    const unheaderedContent = data.slice(512)
    return verifyAndSetVanilla(unheaderedContent)
  }
  return false
}

const createProgram = () => {
  const pkg = readPackage()
  Header(pkg.version)
  const program = new Command()
  program
    .name('dash-rando')
    .version(pkg.version)
    .addCommand(commands.config())
    .addCommand(commands.seed(), { isDefault: true })
    .option('-d, --debug', 'output extra debugging information')
    .addHelpCommand()
    .addHelpText('after', '\n')
    .showHelpAfterError()
  
  return program
}

async function main() {
  const program = createProgram()

  await program.parseAsync(process.argv)

  return true

  // Load options from config + opts
  const cliOpts = program.opts()
  const opts = { ...DEFAULTS, ...cliOpts }
  if (opts.debug) {
    debug('Options from CLI')
    console.table(opts)
  }
  
  const configPath = path.join(os.homedir(), '.dash-rando.json')
  const loadedConfig = loadConfig(configPath)
  let config = loadedConfig.data
  
  // If no config exists, ask to create one
  if (!loadedConfig.exists) {
    config = await setupConfig(configPath, opts)
  }

  const options = { ...config, ...opts }
  if (options.debug) {
    debug('Options after config')
    console.table(options)
  }

  // Validate options
  // NOTE: All required options should have a default value so this should never happen
  // const requiredOptions = OPTIONS.filter((option) => option.required)
  // const missingOptions = requiredOptions.filter((option) => !options[option.name])

  // Load vanilla
  if (!VANILLA) {
    if (!options.vanillaPath) {
      console.error(chalk.red('No vanilla ROM path specified.'))
      console.log('\n')
      process.exit(1)
    }
    verifyAndSetVanilla(fs.readFileSync(options.vanillaPath))
  }

  // Generate Patch
  // - If vanilla file exists, patch and save file
  // - If vanilla file does not exist, save patch file and give instructions

  // TODO: Commands
  // config: for modifying or viewing your config
  // patch: for applying an existing patch

  return 0
}

main()
  .then((code) => {
    console.log('\n')
    process.exit(code)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
