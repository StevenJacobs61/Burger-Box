import React, { useState, useEffect} from 'react'
import styles from '../styles/menu_section.module.css'
import {FiChevronDown} from 'react-icons/fi';
import MenuItem from './menu_item';

const MenuSection = ({ itemsList, section, settings, width, setCurrentSection, currentSection}) => {

const [expand, setExpand] = useState(false);
const selected = currentSection === section && width > 768

const handleClick = (e) => {
  setCurrentSection(section)
  if(e.target.id == 1){
   setExpand(!expand);
   };
}

useEffect(() => {
  if(width>768){
    setExpand(false)
  }
}, [width, expand])


const chevStyle = {
  color: !section.available ? "#fff" : "#101010",
  transform: expand ? "rotate(180deg)" : selected ? "rotate(-90deg)" : null,
  width: selected ? "37px" : null
}
const contStyle = {
  background: !section.available ? "#101010" : expand || selected ? "rgb(250, 253, 255)" : "rgb(241, 249, 254)", 
  width: expand && width >= 480 ? "90vw" : null,
}
const titleStyle= {
  color: !section.available ? "#fff" : expand || selected ? "var(--text--light-green)" : "#101010",
  fontSize: selected ? "2.4rem" : null
}

  return (
    <div className={styles.container} 
        style={contStyle}
        onClick={(e) => handleClick(e)} 
        id={1}>
        <div className={styles.title_wrapper} id={1}>
            <h2 className={styles.title} id={1} style={titleStyle}>{section.title}</h2>
           {!section.available ?  <div className={styles.un_container}>
           <p className={styles.text}>Unavailable</p> 
           <FiChevronDown id={1} className={styles.icon} style={chevStyle}/>
           </div>
           :
           <FiChevronDown  id={1} className={styles.icon} 
           style={chevStyle}/>}
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