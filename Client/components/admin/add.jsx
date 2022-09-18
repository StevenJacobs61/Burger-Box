import React from 'react'
import styles from '../../styles/add.module.css'
import {AiOutlineClose} from 'react-icons/ai';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Add = ({setShowAdd, section, sections, isExtra, setIsExtra, makeExtra, products, setProducts}) => {
  
  const router = useRouter()
  const [file, setFile] = useState(null);
  const [extraSection, setExtraSection] = useState(isExtra ? section.title : null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [stripeId, setStripeId] = useState(null);
  const [price, setPrice] = useState([]);
  const [sectionTitle, setSectionTitle] = useState(isExtra ? "Extra Toppings" : section.title)

  const filterExtraSections = sections.filter((sect) => sect.title !== section.title)

  const handleAddProduct = async () => {
    const newProduct = {
      img: file,
      title: title,
      desc: desc,
      price: price,
      section: sectionTitle,
      extraSection: extraSection,
      stripeId: stripeId
    }
    
    const JSONdata = JSON.stringify(newProduct)
    try {
      const res = await axios.post('http://localhost:3000/api/products', JSONdata, 
      {headers:{
        'Content-Type': 'application/json'
      }})
      setShowAdd(false)
    setProducts((prev) => ([...prev, res.data]))
    } catch (error) {
      console.log(error);
    } 
  }
  
  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
          <AiOutlineClose className={styles.close} onClick={() => {setShowAdd(false), setIsExtra(false)}}>Close</AiOutlineClose>
            <div className={styles.hdr_container}>
              <h1 className={styles.hdr} style={{color: "rgb(0, 145, 0)"}}>Add</h1>
              <h1 className={styles.hdr}>{isExtra ? "Extra" : null} to {section.title}</h1>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Title:</label>
              <input className={styles.input} onChange={(e) => setTitle(e.target.value)} type="text"/>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Price:</label>
              <input className={styles.input} onChange={(e) => setPrice(e.target.value)} type="number"/>
            </div>
            {makeExtra ? 
            <div className={styles.input_container}>
              <label className={styles.label_hdr}>Extra Section:</label>
              {filterExtraSections.map((section) => <div key={section._id}className={styles.radio}>
              <label className={styles.label}>{section.title}</label>
              <input type="checkbox" value={section.title} onChange={(e) => setExtraSection(e.target.value)}/></div>)}
            </div> 
            : 
           <> <div className={styles.input_container}>
              <label className={styles.label}>IMG:</label>
              <input className={styles.input} onChange={(e) => setFile(e.target.value)} type="text"/>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Desc:</label>
              <input className={styles.input} onChange={(e) => setDesc(e.target.value)} type="text"/>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Stripe-ID:</label>
              <input className={styles.input} onChange={(e) => setStripeId(e.target.value)} type="text"/>
            </div></>}
            <button className={styles.btn} onClick={handleAddProduct}>Submit</button>
        </div>
    </div>
  )
}

export default Add