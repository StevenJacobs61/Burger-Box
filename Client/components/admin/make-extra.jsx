import React from 'react'
import styles from '../../styles/make-extra.module.css'
import {AiOutlineClose} from 'react-icons/ai';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const MakeExtra = ({product, products, sections, 
    showMakeExtra, setShowMakeExtra, setProducts,
    setIsExtra}) => {

const router = useRouter()

// set initial extra sections

const [currentExtraSections, setCurrentExtraSections] = useState([])
const [otherExtraSections, setOtherExtraSections] = useState([])
const currentESArray = [];    
const extraSections = product.extraSection !== null && product.extraSection.map((es) => currentESArray.push(es))

useEffect(() => {

    setCurrentExtraSections(currentESArray)
    
}, [showMakeExtra]);

const otherES = [];
const allSectionsArray = [];
const allSections = sections.map((section) => allSectionsArray.push(section.title))
const filteredSections = allSectionsArray.filter((section) => 
    !currentESArray.includes(section)
)

useEffect(() => {

    setOtherExtraSections(filteredSections)
    
}, [showMakeExtra]);

// Manage extra sections array to post updated information of 

const handleAddExtra = (section) => {
    setCurrentExtraSections((prev) => [...prev, section])
    setOtherExtraSections(otherExtraSections.filter((oes) => oes !== section))
}

const handleRemoveExtra = (section) => {
    setOtherExtraSections((prev) => [...prev, section])
    setCurrentExtraSections(currentExtraSections.filter((ces) => ces !== section))
}

// mongoose put to change extraSections array of product
const handleAddExtras = async (product) => {
    const id = product._id;
    const newData = {
        extraSection: currentExtraSections,
    }
    try{
        const res = await axios.put("http://localhost:3000/api/products/" + id, newData)
        setShowMakeExtra(false);
        if(currentExtraSections.length >= 1){
        setIsExtra(true);
        setProducts(products.map((prod) => {
            if(prod._id === product._id){
                prod.extraSection = currentExtraSections;
            } return prod;
        })); 
    } else if (currentExtraSections.length === 0){
        setProducts(products.map((prod) => {
            if(prod._id === product._id){
                prod.extraSection = null;
            } return prod;
        }));
        setIsExtra(false)
        }
    } catch(err){
        console.log(err);
    }
}


  return (
    <div className={styles.container}>
        <div className={styles.wrapper}>
          <AiOutlineClose className={styles.close} onClick={() => setShowMakeExtra(false)}>Close</AiOutlineClose>
            <h1 className={styles.hdr}>Make Extra</h1>
            <div className={styles.input_container}>
              <label className={styles.label_hdr}>Extra Sections:</label>
              {
                currentExtraSections.map((ces) => 
                <button key={Math.random(10000)} className={styles.btn_current} onClick={() => handleRemoveExtra(ces)}>
                    {ces}
                </button>
                )
              }
              {
                otherExtraSections.map((oes) => 
                <button key={Math.random(10000)} className={styles.btn_other} onClick={() => handleAddExtra(oes)}>
                {oes}
            </button>
                )
              }
            </div> 
        
            <button className={styles.btn} onClick={() => handleAddExtras(product)}>Submit</button>
        </div>
    </div>
  )
}

export default MakeExtra