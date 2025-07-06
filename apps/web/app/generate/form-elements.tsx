import { Heading } from '../components/text'
import Spacer from '../components/spacer'
import styles from './page.module.css'
import { cn } from '@/lib/utils'

export const SectionHeading = ({ title = '' }) => (
  <div className={styles.heading}>
    <Heading>{title}</Heading>
  </div>
)

export const Section = ({ children, title, className = null, noHeading = false }: { children?: React.ReactNode, title: string, className?: string | null, noHeading?: boolean }) => (
  <section className={cn(styles.section, styles.open, className)}>
    {!noHeading && <SectionHeading title={title} />}
    <div className={styles.section_content}>
      {children}
    </div>
  </section>
)

export const Option = (
  { children, label, name, badge = null, noLabel = false }:
  { children?: React.ReactNode, label?: string, name?: string, badge?: React.ReactNode, noLabel?: boolean }
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
