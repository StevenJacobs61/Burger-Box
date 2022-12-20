import styles from '../../../styles/add-section.module.css'
import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import SubmitBtn from '../../buttons/submitBtn'

const AddSection = ({setShowAdd, setSections}) => {
    const [title, setTitle] = useState();
   

  const handleAddSection = async () => {
    const newSection = {
      title: title,
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
              <input className={styles.input} onChange={(e) => setTitle(e.target.value)} type="text"/>
            </div>
            <div className={styles.btn_container}>
            <SubmitBtn innerTxt={"submit"} btnFunction={handleAddSection}/>
            </div>
            </div> 
  )
}



export default AddSection