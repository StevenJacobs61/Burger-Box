import styles from '../../styles/add-section.module.css'
import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'
import {AiOutlineClose} from 'react-icons/ai';

const AddSection = ({setShowAdd, sections, setSections}) => {
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
    <div className={styles.container}>
        <div className={styles.wrapper}>
          <AiOutlineClose className={styles.close} onClick={() => setShowAdd(false)}>Close</AiOutlineClose>
            <h1 className={styles.hdr}>Add Section</h1>
            <div className={styles.input_container}>
              <label className={styles.label}>Title:</label>
              <input className={styles.input} onChange={(e) => setTitle(e.target.value)} type="text"/>
            </div>

            <button className={styles.btn} onClick={handleAddSection}>Submit</button>
        </div>
    </div>
  )
}



export default AddSection