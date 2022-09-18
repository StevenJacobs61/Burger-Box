import Image from 'next/image'
import React from 'react'
import styles from '../styles/hero.module.css'


const Hero = () => {
  return (
    <>
    <div className={styles.container}>

        
              <h1 className={styles.header}>Order here for 10% off!</h1>
          <div className={styles.img_container}>
              <Image src={'/img/burger.webp'} alt='burger logo' layout='fill'/>
          </div>
        </div>
    {/* <div className={styles.order}><h2 className={styles.text}>Banner</h2></div> */}
    </>
  )
}

export default Hero