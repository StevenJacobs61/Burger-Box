import React from 'react'
import { useState, useEffect} from 'react'
import styles from '../styles/hero.module.css'


const Hero = ({settings, complete, setComplete}) => {

  const text = "Burger'Box";

  const [currentTxt, setCurrentTxt] = useState('');
  

  

  useEffect(() => {
   
      if(currentTxt === "Burger'Box") return
      else{
        const timeId =  setTimeout(()=>{
          setCurrentTxt(text.slice(0, currentTxt.length + 1));
        }, 200);
        return () => {
          if(currentTxt.length == text.length -1){
            setCurrentTxt("Burger'Box")
            const shadowTimeout = setTimeout(()=>{
              setComplete(true)
            }, 400)
          }
          clearTimeout(timeId)     
        }
    }
  }, [currentTxt, setComplete])
  
  const h1Style ={
    boxShadow: complete ? "0 0 10px var(--bg-color--blue)" : null,
    animation: !complete ? "animate 3s infinite alternate" : null
  }

  const h2Style = {
    textShadow: !complete ? null : "var(--textShadow)", 
    animation: !complete ? "animate2 3s infinite alternate" : null
  }

  return (
    <div className={styles.container} style={{padding: !settings.bannerOn ? "120px 0 0" : null}}>
             {settings.bannerOn ? <h1 className={styles.header} style={h1Style}>{settings.banner} </h1>: null}
          <div className={styles.title_container}>
            <h2 className={styles.title} style={h2Style}>{currentTxt}</h2><h2 className={styles.blink}>|</h2>
          </div>
        </div>
  )
}

export default Hero