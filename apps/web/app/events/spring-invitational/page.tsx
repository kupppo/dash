import { Wrapper } from '@/app/components/wrapper'
import styles from '../vs-world/event.module.css'
import { ButtonLink } from '@/app/components/button'

export const metadata = {
  title: 'DASH Spring Invitational',
  description: 'A DASH tournament for Chozo and Area Rando. May 23 - 27, 2024',
}

export default function TournamentPage() {

  return (
    <>
      <div className={styles.background} />
      <Wrapper borderless>
        <div style={{ maxWidth: '660px', margin: 'var(--spacer-8x) auto var(--spacer-4x)' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#fff', fontWeight: '400', fontSize: '48px', margin: '0' }}>
              Spring Invitational 2024
            </h1>
            <h3 style={{ textTransform: 'uppercase', fontWeight: '400', fontSize: '20px', display: 'flex', justifyContent: 'center', gap: 'var(--spacer-4x)', color: 'var(--color-muted)', margin: '0' }}>
              <span>May 23 - 27</span>
            </h3>
          </div>
          <div style={{ margin: 'var(--spacer-12x) 0 var(--spacer-12x)', textAlign: 'center' }}>
            <ButtonLink variant="hero" href="/spring-invitational-form" style={{ margin: '0 auto' }} target="_blank">Register your interest</ButtonLink>
          </div>
          <div style={{ margin: 'var(--spacer-24x) 0 var(--spacer-12x)'}}>
            <h3 className={styles.settingsTitle}>Settings</h3>
            <ul className={styles.settings}>
              <li>
                <span className={styles.label}>Item Split</span>
                Chozo
              </li>
              <li>
                <span className={styles.label}>Boss Locations</span>
                Vanilla
              </li>
              <li>
                <span className={styles.label}>Map Layout</span>
                Area Randomization
              </li>
              <li>
                <span className={styles.label}>Logic</span>
                Standard
              </li>
              <li>
                <span className={styles.label}>Minor Item Distribution</span>
                DASH - 2:1:1
              </li>
              <li>
                <span className={styles.label}>Environment Updates</span>
                Standard
              </li>
              <li>
                <span className={styles.label}>Charge Beam</span>
                Starter+
              </li>
              <li>
                <span className={styles.label}>Gravity Heat Reduction</span>
                Off
              </li>
              <li>
                <span className={styles.label}>Double Jump</span>
                Off
              </li>
              <li>
                <span className={styles.label}>Heat Shield</span>
                Off
              </li>
              <li>
                <span className={styles.label}>Pressure Valve</span>
                Off
              </li>
              <li>
                <span className={styles.label}>Item Fanfare</span>
                On
              </li>
            </ul>
          </div>
        </div>
      </Wrapper>
    </>
  )
}
