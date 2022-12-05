import React from 'react'
import styles from '../styles/menu.module.css'
import MenuSection from './menu_section'
import { useState, useEffect } from 'react'
import {  useRouter } from 'next/router'
import SelectBtn from './buttons/selectBtn'
import MenuItem from './menu_item'


const Menu = ({sectionsList, itemsList, settings}) => {
  
  const [currentSection, setCurrentSection] = useState(sectionsList[0])  
  
  const [width, setWidth] = useState();
const [total, setTotal] = useState() 
const [open, setOpen] = useState();
const router = useRouter();

  
useEffect(() => {
  const finalTotal = 0;
  const localData = JSON.parse(localStorage.getItem("Orders"))
  const localTotal = localData.map((data) => finalTotal += data.totalPrice)
  setTotal(finalTotal)
}, []);


const handleBasket = () => {
  router.push("/cart")
}


const handleWidth = () => {
  setWidth(window.innerWidth)
}

useEffect(() => {
  setWidth(window.innerWidth)
  window.addEventListener("resize", handleWidth)
}, [])

const roundedTotal = Math.round(total * 100)/100;

  return (
    <section className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.hdr}>Menu</h1>
          <div className={styles.menu_container}>
            <div className={styles.sections_container}>
              {sectionsList.map((section) =>(
              <MenuSection key={section._id} 
              width={width} 
              setCurrentSection={setCurrentSection} 
              currentSection={currentSection} 
              open={open} 
              settings={settings} 
              itemsList={itemsList} 
              section={section}/>
              ))}
                {width > 768 ? <div className={styles.checkout}>
            {!settings.offline ? <><p className={styles.text}>Total: £{roundedTotal}</p>
            <SelectBtn innerTxt={"basket"} btnFucntion={handleBasket} btnStyle={"L"}/>
            </> 
            : 
            <p className={styles.offline}>Offline</p>
            } 
          </div> : null}
            </div>
            <div className={styles.items_container}>
              <h2 className={styles.menu_hdr}>{currentSection.title}</h2>
              <div className={styles.items_wrapper}>
              {itemsList.filter((i) => i.section === currentSection?.title).map((item)=>
                <MenuItem key={item._id} 
                item={item} 
                section={currentSection} 
                settings={settings}/>
              )}  
              </div>
            </div>
          </div>
          {width < 769 ? <div className={styles.checkout}>
            {!settings.offline ? <><p className={styles.text}>Total: £{roundedTotal}</p>
            <SelectBtn innerTxt={"basket"} btnFucntion={handleBasket} btnStyle={"M"}/>
            </> 
            : 
            <p className={styles.offline}>Offline</p>
            } 
          </div> : null}
        </div>
    </section>
  )
}

export default Menu