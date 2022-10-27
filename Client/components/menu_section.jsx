import React, { useState, useEffect } from 'react'
import styles from '../styles/menu_section.module.css'
import {FiChevronDown} from 'react-icons/fi';
import MenuItem from './menu_item';

const MenuSection = ({ itemsList, section, settings}) => {

const [expand, setExpand] = useState(false);
const [width, setWidth] = useState();




const handleClick = (e) => {
 if(e.target.id == 1){
  setExpand(!expand);
  };
};

const handleWidth = () => {
  setWidth(window.innerWidth)
}

useEffect(() => {
  setWidth(window.innerWidth)
  window.addEventListener("resize", handleWidth)
}, [])

  return (
    <div className={styles.container} 
        style={{background: !section.available ? "#101010" : expand ? "#fff" : "rgb(241, 249, 254)", width: expand && width >= 480 ? "95vw" : null}}
        onClick={(e) => handleClick(e)} 
        id={1}
          >
        <div className={styles.title_wrapper} id={1}>
            <h2 className={styles.title} id={1} style={{color: !section.available ? "#fff" : "#101010"}}>{section.title}</h2>
           {!section.available ?  <div className={styles.un_container}>
           <p className={styles.text}>Unavailable</p> 
           <FiChevronDown id={1} className={styles.icon} style={{color: !section.available && "#fff", transform: expand ? "rotate(180deg)" : null}}/>
           </div>
           :
           <FiChevronDown  id={1} className={styles.icon} 
           style={{"color": !section.available ? "#fff" : "#101010", "transform": expand ? "rotate(180deg)" : null}}/>}
        </div>
       {expand ? <div className={styles.items_container} id={1}>
        { itemsList.map((item) =>  item.section === section.title ? 
        <MenuItem key={item._id} settings={settings} section={section} item={item}
          /> : null)}
        </div>
       : null}
    </div>
  )
}

export default MenuSection