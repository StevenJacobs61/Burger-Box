import React from 'react'
import styles from '../styles/show.module.css'
import {AiOutlineClose} from 'react-icons/ai';


const Show = ({children, setShowAdd, setIsExtra}) => {
  return (
    <div className={styles.container} style={{top: window.innerWidth >= 1024 ? window.scrollY : null}}>
    <div className={styles.wrapper}>
    <AiOutlineClose className={styles.close} 
    onClick={() => 
      {
      setShowAdd(false)
     if(setIsExtra){setIsExtra(false)}
    }
    }>Close</AiOutlineClose>
    {children}
    </div>
    </div>
  )
}

export default Show