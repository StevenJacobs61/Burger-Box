import styles from '../../../styles/add-section.module.css'
import React from 'react'
import axios from 'axios'
import { useState, useRef } from 'react'
import SubmitBtn from '../../buttons/submitBtn'
import InputField from '../../inputs/input_field'

const AddSection = ({setSections}) => {
    const title = useRef()
   

  const handleAddSection = async () => {
    const newSection = {
      title: title.current,
    }
    
    const JSONdata = JSON.stringify(newSection)
    try {
      const res = await axios.post('http://localhost:3000/api/sections', JSONdata, 
      {headers:{
        'Content-Type': 'application/json'
      }})
      setSections((prev) => ([...prev, res.data]))
      setShowAdd(false)
    } catch (error) {
      console.log(error);
    }
  }

  return (
          <div className={styles.container} >
            <h1 className={styles.hdr}>Add Section</h1>
            <div className={styles.input_container}>
              <label className={styles.label}>Title:</label>
              <InputField type={"text"} cRef={title}/>
            </div>
            <div className={styles.btn_container}>
            <SubmitBtn innerTxt={"submit"} btnFunction={handleAddSection}/>
            </div>
            </div> 
  )
}



export default AddSection