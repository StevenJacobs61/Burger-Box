import Image from 'next/image'
import React from 'react'
import styles from '../styles/menu_item.module.css'
import { useRouter } from 'next/router';
import {MdOutlineFastfood, MdOutlineLocalDrink} from "react-icons/md"
import {MdChildCare} from "react-icons/md"
import {GiKetchup} from "react-icons/gi"
import {GiCakeSlice} from "react-icons/gi"
import {GiHotMeal} from "react-icons/gi"
import SelectBtn from './buttons/selectBtn';

const MenuItem = ({item, section, settings}) => {
  const router = useRouter()

  const handleSelect = () => {
    if(!item.available){
      alert("Sorry, this product is currently unavailable")
    } 
    else {
      router.push(`/product/${item._id}`)
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.container} onClick={() => handleSelect()}>
         <div className={styles.top_wrapper}>
           <div className={styles.img_container}>
             {item.img ? <div className={styles.img_wrapper}>
                  <Image className={styles.img} src={item.img} alt='kids burger' layout='fill' />
              </div> :
              section.title.toLowerCase() === "burgers" ?
              <div className={styles.img_wrapper}><MdOutlineFastfood className={styles.icon} />
              </div> :
              section.title.toLowerCase() === "kids box meals" ?
              <div className={styles.img_wrapper}><MdChildCare className={styles.icon} />
              </div> :
                section.title.toLowerCase() === "dips" ?
              <div className={styles.img_wrapper}><GiKetchup className={styles.icon} />
              </div> :
              section.title.toLowerCase() === "dessert" ?
              <div className={styles.img_wrapper}><GiCakeSlice className={styles.icon} />
              </div> :
              section.title.toLowerCase() === "drinks" ?
              <div className={styles.img_wrapper}><MdOutlineLocalDrink className={styles.icon} />
              </div> :
              <div className={styles.img_wrapper}><GiHotMeal className={styles.icon} />
              </div> 
              }
           </div>
           <div className={styles.title_container}>
             <h1 className={styles.title}>{item.title}</h1>
           </div>
         </div>
         <div className={styles.desc_container}>
          <p className={styles.desc}>
          &quot;Consists of our signature beef patty a fillet of butter milk chicken, mozzarella sticks, a slice of cheese and hash browns, Then finished off with caramelised onions, turkey bacon and drizzled with a blend of sauces, in a buttered brioche bun.&quot;
          </p>
         </div>
         <div className={styles.price_container}>
         <h3 className={styles.price}>£{item.price}</h3>
       </div>
          </div>
          {item.available && section.available && !settings.offline ?
         <div className={styles.btn_container}>
              <SelectBtn innerTxt={"Select options"} btnFucntion={handleSelect} btnStyle={"S"}/>
          </div>
          : <p className={styles.text}> {settings.offline ? "Offline" : "Unavailable"}</p> }
    </div>
  )
}

export default MenuItem