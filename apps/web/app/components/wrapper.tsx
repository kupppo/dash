import { PropsWithChildren } from 'react'
import { NewHeader } from './header'
import styles from './wrapper.module.css'

export interface WrapperProps extends PropsWithChildren {
  borderless?: boolean
}

export const Wrapper = ({ borderless = false, ...props }: WrapperProps) => {
  return (
    <>
      <NewHeader borderless={borderless} />
      <main className={styles.container}>
        {props.children}
      </main>
    </>
  )
}