import styles from '../../styles/add-upgrade.module.css'
import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'
import {AiOutlineClose} from 'react-icons/ai';

const AddUpgrade = ({setShowAdd, setExtrasList, extras}) => {
    const router = useRouter()
    const [title, setTitle] = useState(null);
    const [price, setPrice] = useState();

  const handleAddUpgrade = async () => {
    const newProduct = {
      upgrade:{
      title: title,
      price: price,
    }}
    
    const JSONdata = JSON.stringify(newProduct)
    try {
      const res = await axios.post('http://localhost:3000/api/extras', JSONdata, 
      {headers:{
        'Content-Type': 'application/json'
      }})
      setShowAdd(0)
      setExtrasList(extras)
      alert('Product Added')
      router.push('/admin')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
          <AiOutlineClose className={styles.close} onClick={() => setShowAdd(0)}>Close</AiOutlineClose>
            <h1 className={styles.hdr}>Add Upgrade</h1>
            <div className={styles.input_container}>
              <label className={styles.label}>Title:</label>
              <input className={styles.input} onChange={(e) => setTitle(e.target.value)} type="text"/>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Price:</label>
              <input className={styles.input} onChange={(e) => setPrice(e.target.value)} type="number"/>
            </div>

            <button className={styles.btn} onClick={handleAddUpgrade}>Submit</button>
        </div>
    </div>
  )
}



export default AddUpgrade