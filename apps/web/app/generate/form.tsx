'use client'

import Link from 'next/link'
import { Heading } from '../components/text'
import Select from '../components/select'
import Numeric from '../components/numeric'
import styles from './page.module.css'
import { cn, deepEqual, downloadFile } from '@/lib/utils'
import VanillaButton, { useVanilla } from './vanilla'
import { useForm } from 'react-hook-form'
import { Button } from '../components/button'
import Badge from '../components/badge'
import useMounted from '../hooks/useMounted'
import { Item, RandomizeRom, paramsToString } from 'core'
import {
  BeamMode,
  BossMode,
  GravityHeatReduction,
  MajorDistributionMode,
  MapLayout,
  MinorDistributionMode,
  SuitMode
} from 'core/params'
import { fetchSignature } from 'core'
import { useEffect, useState } from 'react'
import { ArrowDown } from 'react-feather'
import Spacer from '../components/spacer'
import { toast } from 'sonner'

const Sidebar = ({
  name = null,
  signature = null,
  seed = null,
  isRandom = false,
  hash = null
}: {
  name?: string | null
  signature?: string | null
  seed?: string | null
  isRandom: boolean
  hash?: string | null
}) => {
  const { data } = useVanilla()
  const mounted = useMounted()
  const [open, setOpen] = useState<Boolean>(false)
  
  useEffect(() => {
    if (signature) {
      setOpen(true)
    }
  }, [signature])

  return (
    <aside className={cn(styles.sidebar, { [styles.sidebarMobileLoaded]: data, [styles.open]: open })}>
      {mounted ? (
        data ? (
          <div>
            <div className={styles.sidebarButtons}>
              <Button type="submit" block variant="primary">
                  Generate Seed
                  {/* <ArrowDown size={14} strokeWidth={2} /> */}
              </Button>
              {(signature && name) && (
                <Button
                  className={styles['mobile-sidebar-btn']}
                  variant="plain"
                  onClick={(evt) => {
                  evt.preventDefault()
                  setOpen(!open)
                }}>
                  {open ? 'Close' : 'Open'}
                </Button>
              )}
            </div>
            {signature && name && (
              <div className={styles.sidebarContent}>
                <div style={{ margin: '2em 0' }}>
                  <h4 className={styles.sidebarHeading}>
                    Signature
                  </h4>
                  <code className={styles.mono}>{signature}</code>
                </div>
                <div style={{ margin: '2em 0' }}>
                  <h4 className={styles.sidebarHeading}>
                    Filename
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>{name}</p>
                </div>
                <div style={{ margin: '2em 0' }}>
                  <h4 className={styles.sidebarHeading}>
                    Seed URL
                  </h4>
                  <p style={{ fontSize: '14px', margin: 0, wordWrap: 'break-word' }}>
                    <a href={`/seed/${hash}?download=false`} style={{ color: 'white', fontWeight: 700 }}>
                      {`${hash}`}
                    </a>
                  </p>
                  {/* {isRandom && (
                    <div style={{ fontSize: '14px', margin: '2em 0 0', paddingTop: '1em', borderTop: '1px solid rgb(51, 51, 51)' }}>
                      <Button variant="plain" type="submit" style={{ padding: 0, textAlign: 'left' }}>
                        Generate another seed with these settings
                      </Button>
                    </div>
                  )} */}
                </div>
              </div>
            )}
          </div>
        ) : (
          <VanillaButton />
        )) : null}
    </aside>
  )
}

const SectionHeading = ({ title = '' }) => (
  <div className={styles.heading}>
    <Heading>{title}</Heading>
  </div>
)

const Section = ({ children, title, className = null, noHeading = false }: { children?: React.ReactNode, title: string, className?: string | null, noHeading?: boolean }) => (
  <section className={cn(styles.section, styles.open, className)}>
    {!noHeading && <SectionHeading title={title} />}
    <div className={styles.section_content}>
      {children}
    </div>
  </section>
)

const Option = (
  { children, label, name, badge = null, noLabel = false }:
  { children?: React.ReactNode, label: string, name?: string, badge?: React.ReactNode, noLabel?: boolean }
) => {
  const labelAttr: any = {
    className: styles.label,
  }
  if (name) {
    labelAttr.htmlFor = `select-${name}`
  }
  return (
    <div className={styles.option}>
      <div className={styles.info}>
        {noLabel ?
          (
            <div {...labelAttr}>{label}</div>
          ) : (
            <label {...labelAttr}>{label}</label>
          )}
        <Spacer y={2} />
        {badge}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export interface GenerateSeedSettings {
  'item-split': 'recall-mm' | 'standard-mm' | 'full',
  area: 'standard' | 'randomized',
  boss: 'standard' | 'randomized' | 'known',
  minors: 'standard' | 'dash',
  'map-layout': 'standard-vanilla' | 'dash-recall',
  'beam-mode': 'vanilla' | 'classic' | 'recall' | 'new',
  'gravity-heat-reduction': 'off' | 'on',
  'double-jump': 'off' | 'on',
  'heat-shield': 'off' | 'on',
  'pressure-valve': 'none' | 'one' | 'two',
}

export interface GenerateSeedParams extends GenerateSeedSettings {
  'seed-mode': 'random' | 'fixed',
  seed: number,
  fanfare: 'off' | 'on', 
}

export interface GenerateFormParams extends GenerateSeedParams {
  mode: 'sgl23' | 'dash-recall-v2' | 'dash-recall-v1' | 'dash-classic' | 'standard' | 'custom',
}

const MODES = {
  'sgl23': {
    'item-split': 'full',
    area: 'randomized',
    boss: 'randomized',
    minors: 'dash',
    'map-layout': 'standard',
    'beam-mode': 'new',
    'gravity-heat-reduction': 'on',
    'double-jump': 'on',
    'heat-shield': 'off',
    'pressure-valve': 'none',
  },
  'dash-recall-v2': {
    'item-split': 'recall-mm',
    area: 'standard',
    boss: 'standard',
    minors: 'dash',
    'map-layout': 'dash-recall',
    'beam-mode': 'new',
    'gravity-heat-reduction': 'on',
    'double-jump': 'on',
    'heat-shield': 'on',
    'pressure-valve': 'one',
    // 'pressure-valve': 'two',
  },
  'dash-recall-v1': {
    'item-split': 'recall-mm',
    area: 'standard',
    boss: 'standard',
    minors: 'dash',
    'map-layout': 'dash-recall',
    'beam-mode': 'recall',
    'gravity-heat-reduction': 'on',
    'double-jump': 'on',
    'heat-shield': 'on',
    'pressure-valve': 'one',
  },
  'dash-classic': {
    'item-split': 'standard-mm',
    area: 'standard',
    boss: 'standard',
    minors: 'dash',
    'map-layout': 'standard-vanilla',
    'beam-mode': 'classic',
    'gravity-heat-reduction': 'on',
    'double-jump': 'off',
    'heat-shield': 'off',
    'pressure-valve': 'none',
  },
  'standard': {
    'item-split': 'standard-mm',
    area: 'standard',
    boss: 'standard',
    minors: 'standard',
    'map-layout': 'standard-vanilla',
    'beam-mode': 'vanilla',
    'gravity-heat-reduction': 'off',
    'double-jump': 'off',
    'heat-shield': 'off',
    'pressure-valve': 'none',
  }
}

const getModeFields = (input: GenerateFormParams): GenerateSeedSettings => {
  const values = { ...input } as any
  delete values.mode
  delete values.seed
  delete values['seed-mode']
  delete values.fanfare
  return values
}

const findMode = (params: GenerateSeedSettings): keyof typeof MODES | null => {
  const modes = Object.keys(MODES) as (keyof typeof MODES)[]
  const mode = modes.find(m => {
    const mode = MODES[m]
    const isEqual = deepEqual(params, mode)
    return isEqual
  })
  return mode || null
}

const prefillSettingsFromPreset = (value: GenerateFormParams, reset: any) => {
  try {
    const preset = value['mode']
    if (preset && preset !== 'custom') {
      const mode = MODES[preset];
      const settings = { ...value, ...mode }
      reset(settings);
    }
  } catch (error) {
    console.error('Error with setting values for mode', error)
  }
}

type RolledSeed = {
  seed: any
  name: string
  hash: string
}

export default function Form() {
  const { register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors,
    }
  } = useForm<GenerateFormParams>({
    defaultValues: {
      'mode': 'sgl23',
      'seed-mode': 'random',
    }
  })
  const [rolledSeed, setRolledSeed] = useState<RolledSeed | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const { data: vanilla, isLoading: vanillaLoading } = useVanilla()
  const mounted = useMounted()
  const seedNum = watch('seed-mode')
  const isRandom = (seedNum === 'random')

  const rollSeed = async (data: any) => {
    const config = { vanillaBytes: vanilla };

      const getSeed = () => {
        if (data['seed-mode'] == 'fixed') {
          return data.seed;
        }

        const [minSeed, maxSeed] = [1, 999999];
        const numSeeds = maxSeed - minSeed + 1;
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        return minSeed + (randomArray[0] % numSeeds);
      }

      let mapLayout = MapLayout.Standard;
      if (data['map-layout'] == 'dash-recall') {
        mapLayout = MapLayout.Recall;
      }

      const minorDistribution = {
        mode: MinorDistributionMode.Standard,
        missiles: 3,
        supers: 2,
        powerbombs: 1
      };
      if (data.minors == "dash") {
        minorDistribution.missiles = 2;
        minorDistribution.supers = 1;
        minorDistribution.powerbombs = 1;
      }

      const majorDistribution = {
        mode: MajorDistributionMode.Standard,
        extraItems: [] as number[],
      };

      if (data['item-split'] == "full") {
        majorDistribution.mode = MajorDistributionMode.Full;
      } else if (data['item-split'] == "recall-mm") {
        majorDistribution.mode = MajorDistributionMode.Recall;
      }
      if (data['double-jump'] == "on") {
        majorDistribution.extraItems.push(Item.DoubleJump);
      }
      if (data['heat-shield'] == "on") {
        majorDistribution.extraItems.push(Item.HeatShield);
      }
      if (data['pressure-valve'] == "one") {
        majorDistribution.extraItems.push(Item.PressureValve);
      }

      const itemPoolParams = {
        majorDistribution: majorDistribution,
        minorDistribution: minorDistribution
      };

      const settings = {
        preset: "Custom",
        beamMode: BeamMode.Vanilla,
        suitMode: SuitMode.Dash,
        gravityHeatReduction: GravityHeatReduction.On,
        randomizeAreas: false,
        bossMode: BossMode.Vanilla,
      };

      if (data.mode == 'dash-recall-v1') {
        settings.preset = "RecallV1";
      } else if (data.mode == 'dash-recall-v2') {
        settings.preset = "RecallV2";
      } else if (data.mode == 'dash-classic') {
        settings.preset = "Classic";
      } else if (data.mode == 'standard') {
        settings.preset = "Standard";
      } else if (data.mode == 'sgl23') {
        settings.preset = "SGL23"
      }

      if (data['beam-mode'] == 'classic') {
        settings.beamMode = BeamMode.DashClassic;
      } else if (data['beam-mode'] == 'recall') {
        settings.beamMode = BeamMode.DashRecall;
      } else if (data['beam-mode'] == 'new') {
        settings.beamMode = BeamMode.New;
      }

      if (data['gravity-heat-reduction'] == 'off') {
        settings.gravityHeatReduction = GravityHeatReduction.Off;
      }

      if (data.area == 'randomized') {
        settings.randomizeAreas = true;
      }

      if (data.boss == 'randomized') {
        settings.bossMode = BossMode.ShuffleDash;
      }

      const options = {
        DisableFanfare: 0,
      };
      if (data.fanfare == 'off') {
        options.DisableFanfare = 1;
      };

      const seedNumber = getSeed();
      const { data: seed, name } = await RandomizeRom(
        seedNumber,
        mapLayout,
        itemPoolParams,
        settings,
        options,
        config
      );
      const hash = paramsToString(
        seedNumber,
        mapLayout,
        itemPoolParams,
        settings,
        options
      );
      downloadFile(seed, name)
      setRolledSeed({ seed, name, hash })
  }

  const onSubmit = async (data: GenerateFormParams) => {
    try {
      console.log('rolling seed')
      await rollSeed(data)
    } catch (err: unknown) {
      const error = err as Error
      console.error('SEED ERROR', error)
      console.log(data)
      
      const isFixed = data['seed-mode'] === 'fixed'
      if (isFixed) {
        // Display error message via toast
        toast.error(
          <>
            <span style={{ color: 'red', fontWeight: '600', }}>Error</span>
            {'  '}
            {`Could not roll seed ${data['seed']}`}
          </>, {
          style: {
            backgroundColor: '#000',
          }
        })
        return
      }

      // Try again
      await rollSeed(data)
    }
  };
  const seedMode = watch('seed-mode')

  useEffect(() => {
    const subscription = watch((value: any, { name, type }) => {
      // Listen for change events only
      if (type !== 'change') {
        return
      }

      if (name === 'seed-mode') {
        return
      }

      if (name === 'mode') {
        prefillSettingsFromPreset(value, reset)
        return
      }

      // Update mode if necessary
      const data = value as GenerateFormParams
      const input = getModeFields(data)
      const matchedMode = findMode(input)
      if (matchedMode) {
        setValue('mode', matchedMode)
      } else {
        setValue('mode', 'custom')
      }
    })
    return () => subscription.unsubscribe()
  }, [setValue, reset, watch])

  useEffect(() => {
    async function calculateSignature(data: any) {
      const sig = await fetchSignature(data)
      setSignature(sig)
    }
    if (rolledSeed) {
      calculateSignature(rolledSeed?.seed)
    }
  }, [rolledSeed])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.grid}>
        <div className={styles.sections}>
          <Section title="Mode" noHeading>
            <Option label="Mode" name="mode">
              <Select
                options={[
                  { label: 'SG Live 2023', value: 'sgl23' },
                  { label: 'DASH: Recall v1', value: 'dash-recall-v1' },
                  { label: 'DASH: Recall v2', value: 'dash-recall-v2' },
                  { label: 'DASH: Classic', value: 'dash-classic' },
                  { label: 'Standard', value: 'standard' },
                  { label: 'Custom', value: 'custom', hidden: true }
                ]}
                name="mode"
                register={register}
              />
            </Option>
          </Section>
          <Section title="Vanilla" className={styles.mobileVanilla}>
            <Option label="Vanilla" noLabel>
              {mounted ? (
                (!vanillaLoading && vanilla) ? (
                  <Button id="select-vanilla" variant="secondary" disabled block>Vanilla ROM loaded</Button>
                ) : vanillaLoading ? (
                  <Button id="select-vanilla" variant="secondary" disabled block>Loading...</Button>
                ) : (
                  <VanillaButton />
                )
              ) : (
                <Button id="select-vanilla" variant="secondary" disabled block>Loading...</Button>
              )}
            </Option>
          </Section>
          <Section title="Randomization">
            <Option label="Item Split" name="item-split">
              <Select
                options={[
                  { label: 'Full', value: 'full' },
                  { label: 'Recall Major/Minor', value: 'recall-mm' },
                  { label: 'Standard Major/Minor', value: 'standard-mm' },
                ]}
                name="item-split"
                register={register}
              />
              <p>
                <Link href="/info#item-split">Item Split</Link>{' '}
                determines the available locations where major items can be placed.
              </p>
            </Option>
            <Option label="Boss" name="boss" badge={<Badge variant="alpha">Alpha</Badge>}>
              <Select
                options={[
                  { label: 'Randomized', value: 'randomized' },
                  { label: 'Standard', value: 'standard' },
                  //{ label: 'Known', value: 'known' },
                ]}
                name="boss"
                register={register}
              />
              <p>
                <Link href="/info#boss">Boss Randomization</Link>{' '}
                can randomize the boss found at a given boss location.
              </p>
            </Option>
            <Option label="Area" name="area" badge={<Badge variant="alpha">Alpha</Badge>}>
              <Select
                options={[
                  { label: 'Randomized', value: 'randomized' },
                  { label: 'Standard', value: 'standard' },
                ]}
                name="area"
                register={register}
              />
              <p>
                <Link href="/info#area">Area Randomization</Link>{' '}
                will randomize the portals between certain areas or leave them as in the vanilla game.
              </p>
            </Option>
          </Section>
          <Section title="Settings">
            <Option label="Minor Item Distribution" name="minors">
              <Select
                options={[
                  { label: 'DASH - 2:1:1', value: 'dash' },
                  { label: 'Standard - 3:2:1', value: 'standard' },
                ]}
                name="minors"
                register={register}
              />
              <p>
                <Link href="/info#minors">Minor Item Distribution</Link>{' '}
                determines the ratio of minor items placed throughout the game.
              </p>
            </Option>
            <Option label="Map Layout" name="map-layout">
              <Select
                options={[
                  { label: 'Standard Vanilla', value: 'standard-vanilla' },
                  { label: 'DASH Recall', value: 'dash-recall' },
                ]}
                name="map-layout"
                register={register}
              />
              <p>
                <Link href="/info#map-layout">Map Layout</Link>{' '}
                applies various tweaks, anti-soft lock patches and other quality of life improvements.
              </p>
            </Option>
            <Option label="Beam Mode" name="beam-mode">
              <Select
                options={[
                  { label: 'Vanilla', value: 'vanilla' },
                  { label: 'Recall', value: 'recall' },
                  { label: 'Classic', value: 'classic' },
                  { label: 'New', value: 'new' },
                ]}
                name="beam-mode"
                register={register}
              />
              <p>
                <Link href="/info#beam-mode">Beam Mode</Link>{' '}
                alters the amount of damage caused by Charge Beam.
              </p>
            </Option>
            <Option label="Gravity Heat Reduction" name="gravity-heat-reduction">
              <Select
                options={[
                  { label: 'On', value: 'on' },
                  { label: 'Off', value: 'off' },
                ]}
                name="gravity-heat-reduction"
                register={register}
              />
              <p>
                <Link href="/info#gravity-heat-reduction">Gravity Heat Reduction</Link>{' '}
                causes Gravity Suit to provide 25% heat damage reduction.
              </p>
            </Option>
            <Option label="Double Jump" name="double-jump">
              <Select
                options={[
                  { label: 'On', value: 'on' },
                  { label: 'Off', value: 'off' },
                ]}
                name="double-jump"
                register={register}
              />
              <p>
                <Link href="/info#double-jump">Double Jump</Link>{' '}
                is a new item that works as a single-use Space Jump.
              </p>
            </Option>
            <Option label="Heat Shield" name="heat-shield">
              <Select
                options={[
                  { label: 'Off', value: 'off' },
                  { label: 'On', value: 'on' },
                ]}
                name="heat-shield"
                register={register}
              />
              <p>
                <Link href="/info#heat-shield">Heat Shield</Link>{' '}
                is a new item that works as a mini-Varia.
              </p>
            </Option>
            <Option label="Pressure Valve" name="pressure-valve">
              <Select
                options={[
                  { label: 'Off', value: 'none' },
                  { label: 'On', value: 'one' },
                  //{ label: '2', value: 'two' },
                ]}
                name="pressure-valve"
                register={register}
              />
              <p>
                <Link href="/info#pressure-valve">Pressure Valve</Link>{' '}
                is a new item that works as a mini-Gravity.
              </p>
            </Option>
          </Section>
          <Section title="Options">
            <Option label="Seed Mode" name="seed-mode">
              <Select
                options={[
                  { label: 'Random', value: 'random' },
                  { label: 'Fixed', value: 'fixed' },
                ]}
                name="seed-mode"
                register={register}
              />
              {seedMode === 'fixed' && (
                <Numeric minVal={1} maxVal={999999} defaultValue={1} name="seed" register={register} />
              )}
              <p>
                <Link href="/info#seed-mode">Seed Mode</Link>{' '}
                controls how the random number generator is initialized.
              </p>
            </Option>
            <Option label="Item Fanfare" name="fanfare">
              <Select
                options={[
                  { label: 'On', value: 'on' },
                  { label: 'Off', value: 'off' },
                ]}
                name="fanfare"
                register={register}
              />
              <p>
                <Link href="/info#fanfare">Item Fanfare</Link>{' '}
                is the music when an item is collected.
              </p>
            </Option>
          </Section>
        </div>
        <Sidebar
          name={rolledSeed?.name || null}
          signature={signature}
          seed={rolledSeed?.seed}
          hash={rolledSeed?.hash}
          isRandom={isRandom}
        />
      </div>
    </form>
  )
}