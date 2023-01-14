import React from 'react'
import styles from '../styles/show.module.css'
import {AiOutlineClose} from 'react-icons/ai';


const Show = ({children, setShow, setIsExtra}) => {

const handleClick = (e) =>{
  if(e.target.id == 1) setShow(false)
}

  return (
    <div className={styles.container} id={1} onClick={(e)=>handleClick(e)}
    style={{top: window.innerWidth >= 1024 ? window.scrollY : null,
    justifyContent: window.innerWidth > 1024 && window.location.pathname === "/admin" ? "flex-start" : "center"}}>
    <div className={styles.wrapper} id={1}>
    <AiOutlineClose className={styles.close} 
    onClick={() => 
      {
      setShow(false)
     if(setIsExtra){setIsExtra(false)}
    }
    }>Close</AiOutlineClose>
    {children}
    </div>
    </div>
  )
}

export default Show