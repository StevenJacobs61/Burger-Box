import React from 'react'
import { useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from '../styles/hero.module.css'
import {nowComplete} from "../redux/userSlice"


const Hero = ({settings}) => {

  // const [complete, setComplete] = useState(false);

  const text = "Burger'Box";
  const textTwo = settings.banner;

  const [currentTxt, setCurrentTxt] = useState('');
  const [currentTxtTwo, setCurrentTxtTwo] = useState('');
  const[completeOne, setCompleteOne] = useState(false)
  

  const complete = useSelector((state) => state.user.complete)
  
  const dispatch = useDispatch()

  useEffect(() => {
    // if(!completeOne) return
    // else{
      if(currentTxt === "Burger'Box") return
      else{
        const timeId =  setTimeout(()=>{
          setCurrentTxt(text.slice(0, currentTxt.length + 1));
        }, 200);
        return () => {
          if(currentTxt.length == text.length -1){
            setCurrentTxt("Burger'Box")
            const shadowTimeout = setTimeout(()=>{
              dispatch(nowComplete(true))
            }, 400)
          }
          clearTimeout(timeId)     
        }
      // }
    }
  }, [completeOne, currentTxt])
  
  // useEffect(() => {
  //   if(currentTxtTwo === settings.banner) return
  //   else{
  //     const timeId =  setTimeout(()=>{
  //       setCurrentTxtTwo(textTwo.slice(0, currentTxtTwo.length + 1));
  //     }, 50);
  //     return () => {
  //       if(currentTxtTwo.length == textTwo.length -1){
  //         setCurrentTxtTwo(settings.banner)
  //         const shadowTimeout = setTimeout(()=>{
  //           setCompleteOne(true)
  //         }, 400)
  //       }
  //       clearTimeout(timeId)     
  //     }
  //   }
  // }, [currentTxtTwo])
  
  

  return (
    <div className={styles.container} style={{padding: !settings.bannerOn ? "120px 0 0" : null}}>
             {settings.bannerOn ? <h1 className={styles.header} style={{boxShadow: complete ? "0 0 10px var(--bg-color--blue)" : null}}>{settings.banner} </h1>: null}
          <div className={styles.title_container}>
            <h2 className={styles.title} style={{textShadow: complete ? "0 0 30px var(--bg-color--blue)" : null}}>{currentTxt}</h2><h2 className={styles.blink}>|</h2>
          </div>
        </div>
  )
}

export default Hero