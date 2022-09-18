import Image from 'next/image'
import React from 'react'
import styles from '../styles/footer.module.css'
import {AiOutlineInstagram} from 'react-icons/ai';
import {FiFacebook} from 'react-icons/fi';

const Footer = () => {
  return (
    <>
    <div className={styles.container}>
    <div className={styles.banner}>Beyond a burger</div>
    <div className={styles.info_container}>
      <div className={styles.info}>
        <div className={styles.img_container}>
          <Image src={'/img/order-box.webp'} alt='burger box' layout='fill' width={120} height={85}/> 
        </div>
        </div>
      <div className={styles.info}>order  here <br/> for 10% off!</div>
      <div className={styles.info}>
        <div className={styles.img_container}>
        <Image src={'/img/map.webp'} alt='burger box' layout='fill' width={150} height={100}/>
      </div>
       </div>
      <div className={styles.info}>
        <div className={styles.location_container}>
          <div className={styles.text}>Store address:</div>
          <div className={styles.text}>16 Dane Rd, Seaford, BN25 1LL, United Kingdom</div>
          <div className={styles.text}>phone:</div>
          <div className={styles.text}>+44 1323 899221</div>
          <div className={styles.text}>socials:</div>
          <div className={styles.text}>
            <div className={styles.socials_container}>
            <div className={styles.social}> <FiFacebook className={styles.facebook}/> </div>
              <div className={styles.social}> <AiOutlineInstagram className={styles.insta}/> </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div className={styles.copyright}>copyright: all rights reserved</div>
    </>
  )
}

export default Footer