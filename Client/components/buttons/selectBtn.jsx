import React from 'react'
import styles from "../../styles/buttons/selectBtn.module.css"

const SelectBtn = ({innerTxt, btnFucntion, btnStyle}) => {

  return (
    <button className={btnStyle === "L" ? styles.btn_large : styles.btn_small} 
        onClick={() => btnFucntion()}
        >
        {innerTxt}
    </button>
  )
}

export default SelectBtn