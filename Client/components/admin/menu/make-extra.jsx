import React from 'react'
import styles from '../../../styles/make-extra.module.css'
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import SubmitBtn from '../../buttons/submitBtn';

const MakeExtra = ({product, products, sections, 
    setShowMakeExtra, setProducts,
    setIsExtra}) => {

const router = useRouter()

// set initial extra sections

const [currentES, setCurrentES] = useState(product.extraSection)
const [otherES, setOtherES] = useState(sections.map((s)=>{
    if(!currentES.includes(s.title)) return s.title
}))


// Manage extra sections array to post updated information of 

const handleAddExtra = (section) => {
    setCurrentES((prev) => [...prev, section])
    setOtherES(otherES.filter((oes) => oes !== section))
}

const handleRemoveExtra = (section) => {
    setOtherES((prev) => [...prev, section])
    setCurrentES(currentES.filter((ces) => ces !== section))
}

// mongoose put to change extraSections array of product
const handleAddExtras = async (product) => {
    const id = product._id;
    const newData = {
        extraSection: currentES,
    }
    try{
        const res = await axios.put("/api/products/" + id, newData)
        setShowMakeExtra(false);
        if(currentES.length >= 1){
        setIsExtra(true);
        setProducts(products.map((prod) => {
            if(prod._id === id){
                prod.extraSection = currentES;
            } return prod;
        })); 
    } else if (currentES.length === 0){
        setProducts(products.map((prod) => {
            if(prod._id === id){
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
 <>
            <h1 className={styles.hdr}>Make Extra</h1>
            <div className={styles.input_container}>
              <label className={styles.label_hdr}>Extra Sections:</label>
              {
                currentES.map((ces) => 
                <button key={Math.random(10000)} className={styles.btn_current} onClick={() => handleRemoveExtra(ces)}>
                    {ces}
                </button>
                )
              }
              {
                otherES.map((oes) => 
                <button key={Math.random(10000)} className={styles.btn_other} onClick={() => handleAddExtra(oes)}>
                {oes}
            </button>
                )
              }
            </div> 
            <div className={styles.btn_container}>
                <SubmitBtn innerTxt={"submit"} btnFunction={handleAddExtras} fProps={product}/>
            </div>
            </>
  )
}

export default MakeExtra