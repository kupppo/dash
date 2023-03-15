#!/usr/bin/env node

const { Command } = require('commander')
const os = require('node:os')
const vm =  require('node:vm')
const fs =  require('node:fs')
const crypto =  require('node:crypto')
const chalk =  require('chalk')
const path = require('node:path')
const prompts = require('prompts')
const fetch = require('node-fetch')
const commands = require('./commands')
const { createConfig } = require('./lib/config')

// const OPTIONS = [
//   {
//     name: 'vanillaPath',
//     required: false,
//     type: 'string',
//     description: 'Path to vanilla ROM',
//   },
//   {
//     name: 'preset',
//     required: true,
//     type: 'string',
//     description: 'Shortname for preset to use',
//   }
// ]

// const DEFAULTS = {
//   preset: MODES[3].value,
//   debug: false,
//   script: 'https://dashrando.github.io/app/dash.min.js',
// }

let VANILLA = null
const HASHES = {
  unheadered: '12b77c4bc9c1832cee8881244659065ee1d84c70c3d29e6eaf92e6798cc2ca72',
  headered: '9a4441809ac9331cdbc6a50fba1a8fbfd08bc490bc8644587ee84a4d6f924fea',
}

const debug = (message) => {
  console.log('\n')
  console.log(chalk.bgMagenta.bold(` debug `), message)
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

// async function setupConfig(configPath, defaults) {
//   const response = await prompts({
//     type: 'toggle',
//     name: 'value',
//     message: 'No config file found. Would you like to create one?',
//     initial: true,
//     onState: onPromptState,
//     active: 'yes',
//     inactive: 'no',
//   })

//   if (response.value) {
//     return createConfig(configPath, defaults)
//   }

//   console.log(chalk.gray('Skipping config creation.'))
// }

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

async function generatePatch(url, preset) {
  const baseUrl = new URL(url).origin
  const core = await fetch(url)
  const coreText = await core.text()
  const script = new vm.Script(coreText)
  script.runInThisContext()

  const [basePatchUrl, seedPatch, fileName] = generateFromPreset(preset)
  const patchUrl = new URL(basePatchUrl, baseUrl)
  // const patch = await fetch(patchUrl.href)
  // const patchBuffer = await patch.arrayBuffer()

  //  .then((res) => res.text())
  //  .then((text) => {
  //     const script = new vm.Script(text)
  //     script.runInThisContext()

  //     const [basePatchUrl, seedPatch, fileName] = generateFromPreset(preset)
  //     console.log(basePatchUrl, seedPatch, fileName)

  //     if (!basePatchUrl || !seedPatch || !fileName) {
  //       throw Error(`Failed to generate preset: ${preset}`)
  //     }

      // fetch(baseUrl + basePatchUrl)
      //    .then((res) => res.arrayBuffer())
      //    .then((buffer) => {
      //       const rom = patchRom(
      //          VANILLA,
      //          new BpsPatch(new Uint8Array(buffer)),
      //          seedPatch
      //       );
      //       fs.writeFileSync(fileName, rom);
      //       console.log("Generated: " + fileName);
      //    });
  //  })
  //  .catch((err) => {
  //     console.error(err);
  //     process.exit(1);
  //  });
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
    .option('-s, --script <PATH>', 'path to script')
    .option('-v, --vanillaPath <path>', 'path to vanilla ROM')
    .option('-p, --preset <preset>', 'preset to use')
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

  const patch = await generatePatch(options.script, options.preset)

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

//-----------------------------------------------------------------
// Generate a seed from the specified preset.
//-----------------------------------------------------------------

// fetch(baseUrl + "app/dash.min.js")
//    .then((res) => res.text())
//    .then((text) => {
//       const script = new vm.Script(text);
//       script.runInThisContext();

//       const [basePatchUrl, seedPatch, fileName] = generateFromPreset(preset);

//       if (!basePatchUrl || !seedPatch || !fileName) {
//          console.log("Failed to generate preset:", preset);
//          return 1;
//       }

//       fetch(baseUrl + basePatchUrl)
//          .then((res) => res.arrayBuffer())
//          .then((buffer) => {
//             const rom = patchRom(
//                vanillaRom,
//                new BpsPatch(new Uint8Array(buffer)),
//                seedPatch
//             );
//             fs.writeFileSync(fileName, rom);
//             console.log("Generated: " + fileName);
//          });
//    });
