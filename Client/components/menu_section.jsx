import React, { useState } from 'react'
import styles from '../styles/menu_section.module.css'
import {FiChevronDown} from 'react-icons/fi';
import MenuItem from './menu_item';

const MenuSection = ({ itemsList, section}) => {

const [expand, setExpand] = useState(false);

const handleExpand = () => {
  setExpand(!expand);
}

  return (
    <div className={styles.container} style={{background: !section.available ? "#101010" : expand ? "#fff" : "rgb(241, 249, 254)"}}>
        <div className={styles.title_wrapper} onClick={handleExpand}>
            <h2 className={styles.title} style={{color: !section.available ? "#fff" : "#101010"}}>{section.title}</h2>
           {!section.available ?  <div className={styles.un_container}>
           <p className={styles.text}>Unavailable</p> 
           <FiChevronDown  className={styles.icon} style={{color: !section.available && "#fff", transform: expand ? "rotate(180deg)" : ""}}/>
           </div>
           :
           <FiChevronDown  className={styles.icon} 
           style={{"color": !section.available ? "#fff" : "#101010", "transform": expand ? "rotate(180deg)" : null}}/>}
        </div>
       {expand ? <div className={styles.items_container}>
        { itemsList.map((item) =>  item.section === section.title ? <MenuItem key={item._id} section={section} item={item}/> : '')}
        </div>
       : null}
    </div>
  )
}

export default MenuSection