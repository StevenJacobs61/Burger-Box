import React from 'react'
import styles from '../styles/menu.module.css'
import MenuSection from './menu_section'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {FaArrowDown} from 'react-icons/fa';


const Menu = ({sectionsList, itemsList}) => {
const [total, setTotal] = useState(0);
const [open, setOpen] = useState();
const [sections, setSectons] = useState(sectionsList);
  
useEffect(() => {
  const finalTotal = 0;
  const localData = JSON.parse(localStorage.getItem("Orders"))
  const localTotal = localData.map((data) => finalTotal += data.totalPrice)
  setTotal(finalTotal)
}, []);

useEffect(() => {
  const sectionClosed = sections.filter((section) => 
    !section.available);
    const isOpen = sectionClosed.length < sections.length;
  if(!isOpen){
    setOpen(false)
  };
  if (isOpen){
    setOpen(true)
  }
}, [sections]);
const roundedTotal = Math.round(total * 100)/100;
  return (
    <div className={styles.section}>
      <div className={styles.open}>
        <div className={styles.open_container}>
          <h2 className={styles.open_text}>We are</h2><p className={styles.open_word} style={{color: open ? "#0ba800" : "#be0606"}}>{open ? "Open" : "Closed"}</p>
        </div>
        <p className={styles.opening_times}>Open 6 days a week 3.30pm - 10pm <br></br>Closed Tuesdays </p>
        <h2 className={styles.order_below}>{open ? "Order below" : "Browse Menu below"}</h2>
        <FaArrowDown className={styles.icon}/>
      </div>
        <div className={styles.container}>
          <h1 className={styles.header}>Menu</h1>
          <div className={styles.menu_container}>
            {sections.map((section) =>(<MenuSection key={section._id} open={open} itemsList={itemsList} section={section}/>)) }
          </div>
          <div className={styles.checkout}>
            <p className={styles.text}>Total: £{roundedTotal}</p>
            <Link href={'/cart'}><button className={styles.btn}>Checkout</button></Link>  
          </div>
        </div>
    </div>
  )
}

export default Menu