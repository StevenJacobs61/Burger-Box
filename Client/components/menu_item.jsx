import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import styles from '../styles/menu_item.module.css'

const MenuItem = ({item, section}) => {


  return (
    <div className={styles.container}>
       {item.img ? <div className={styles.img_container}>
            <Image src={item.img} alt='kids burger' layout='fill' />
        </div> :null}
       <h1 className={styles.title}>{item.title}</h1>
       <div className={styles.price_container}>
   <p className={styles.price_text}>From</p>
   <h3 className={styles.price}>£{item.price}</h3>
 </div>
        {item.available && section.available ?
        <Link href={`/product/${item._id}`} passHref><div className={styles.btn_container}>
            <button className={styles.btn}>Choose</button>
        </div>
        </Link> 
        :<p className={styles.text}> Unavailable</p> }
    </div>
  )
}

export default MenuItem