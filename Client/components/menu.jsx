import React from 'react'
import styles from '../styles/menu.module.css'
import MenuSection from './menu_section'
import { useState, useEffect } from 'react'
import {  useRouter } from 'next/router'
import SelectBtn from './buttons/selectBtn'


const Menu = ({sectionsList, itemsList, settings}) => {
const [total, setTotal] = useState(0);
const [open, setOpen] = useState();
const [sections, setSectons] = useState(sectionsList);
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

const roundedTotal = Math.round(total * 100)/100;

  return (
    <secion className={styles.section}>
        <div className={styles.container}>
          <h1 className={styles.header}>Menu</h1>
          <div className={styles.menu_container}>
            {sections.map((section) =>(<MenuSection key={section._id} open={open} settings={settings} itemsList={itemsList} section={section}/>)) }
          </div>
          <div className={styles.checkout}>
            {!settings.offline ? <><p className={styles.text}>Total: £{roundedTotal}</p>
            <SelectBtn innerTxt={"basket"} btnFucntion={handleBasket} btnStyle={"M"}/>
            </> 
            : 
            <p className={styles.offline}>Offline</p>
            } 
          </div>
        </div>
    </secion>
  )
}

export default Menu