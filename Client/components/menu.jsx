import React from 'react'
import styles from '../styles/menu.module.css'
import MenuSection from './menu_section'
import { useState, useEffect } from 'react'
import {FaArrowDown} from 'react-icons/fa';
import {  useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { nowOpen } from '../redux/userSlice'
import SelectBtn from './buttons/selectBtn'


const Menu = ({sectionsList, itemsList, settings}) => {
const [total, setTotal] = useState(0);
const [open, setOpen] = useState();
const [sections, setSectons] = useState(sectionsList);
const router = useRouter();
const dispatch = useDispatch();

const complete = useSelector((state) => state.user.complete)
  
useEffect(() => {
  const finalTotal = 0;
  const localData = JSON.parse(localStorage.getItem("Orders"))
  const localTotal = localData.map((data) => finalTotal += data.totalPrice)
  setTotal(finalTotal)
}, []);

useEffect(() => {
  const sectionClosed = sections.filter((section) => !section.available);
    const isOpen = sectionClosed.length < sections.length;

  if(!isOpen){
    setOpen(false)
  };
  if (isOpen){
    setOpen(true)
  }

  dispatch(nowOpen(isOpen));

}, [sections, dispatch]);

const handleBasket = () => {
  router.push("/cart")
}

const roundedTotal = Math.round(total * 100)/100;

  return (
    <div className={styles.section}>
      <div className={styles.bg_container}>
        <div className={styles.open}>
          <div className={styles.open_container}>
            <h2 className={styles.open_text}>We are</h2><p className={styles.open_word} style={{color: open && !settings.offline ? "#0ba800" : "#be0606", textShadow: !open || settings.offline ? "none": null, textShadow: complete ? "0 0 30px var(--bg-color--blue)" : null}}>{open && !settings.offline ? "Open" : !open && !settings.offline ? "Closed" : "Offline"}</p>
          </div>
          {settings.offline && open ?
          <div className={styles.offline_notice_container}>
            <h3 className={styles.offline_notice}> We are not accepting orders here at the moment, please order using the Just Eat from the link below.. We aim to be be back soon! </h3>
            <h2 className={styles.justeat} onClick={() => router.push("https://www.just-eat.co.uk/restaurants-burger-box-east-blatchington/menu")}>Just eat</h2>
          </div>
        : null}
          <p className={styles.opening_times}>Open 6 days a week 3.30pm - 10pm <br></br>Closed Tuesdays </p>
            {  settings.noticeOn ? 
            <div className={styles.notice_container}>
        <h3 className={styles.notice_hdr}>Notice:</h3>
        <p className={styles.notice}>{settings.notice}</p>
        </div>
        : null}
            {!settings.del ? <h2 className={styles.noDel}>
            collection only!
          </h2>
          : null}
          <h2 className={styles.order_below}>{open && !settings.offline ? "Order below" : open && settings.offline || !open ?  "Browse Menu below" : null}</h2>
          <FaArrowDown className={styles.icon}/>
        </div>
      </div>
      
        <div className={styles.container}>
          <h1 className={styles.header}>Menu</h1>
          <div className={styles.menu_container}>
            {sections.map((section) =>(<MenuSection key={section._id} open={open} settings={settings} itemsList={itemsList} section={section}/>)) }
          </div>
          <div className={styles.checkout}>
            {!settings.offline ? <><p className={styles.text}>Total: £{roundedTotal}</p>
            <SelectBtn innerTxt={"basket"} btnFucntion={handleBasket} btnStyle={"L"}/>
            </> 
            : 
            <p className={styles.offline}>Offline</p>
            } 
          </div>
        </div>
    </div>
  )
}

export default Menu