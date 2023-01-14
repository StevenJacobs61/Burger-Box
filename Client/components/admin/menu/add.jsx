import React from 'react'
import styles from '../../../styles/add.module.css'
import axios from 'axios';
import SubmitBtn from '../../buttons/submitBtn';
import InputField from '../../inputs/input_field';
import { useRef } from 'react';

const Add = ({section, isExtra, setProducts}) => {
  
// ** If rendered by "Add Extra",
//  extraSection automatically the section title.
  const extraSection = useRef(isExtra ? section.title : null);

  // Section title also automically Extra Toppings
  const sectionTitle = useRef(isExtra ? "Extra Toppings" : section.title)

  // Set info of new product on input change

  const title = useRef()
  const desc = useRef()
  const stripeId = useRef()
  const price = useRef()
  const img = useRef()

  // ** Submit new product to entry to MDB

  const handleAddProduct = async () => {
    const newProduct = {
      img: img.current?.value,
      title: title.current?.value,
      desc: desc?.current.value,
      price: price.current?.value,
      section: sectionTitle.current,
      extraSection: extraSection.current,
      stripeId: stripeId.current?.value
    }
    console.log(newProduct);
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
    <>
            <div className={styles.hdr_container}>
              <h1 className={styles.hdr} style={{color: "rgb(0, 145, 0)"}}>Add</h1>
              <h1 className={styles.hdr}>{isExtra ? "Extra" : null} to {section.title}</h1>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Title:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={title} type={"text"}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Price:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={price} type={"number"}/>
              </div>
            </div>
           <div className={styles.input_container}>
              <label className={styles.label}>IMG:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={img} type={"text"}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Desc:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={desc} type={"text"}/>
              </div>
            </div>
            <div className={styles.input_container}>
              <label className={styles.label}>Stripe-ID:</label>
              <div className={styles.input_wrapper}>
                <InputField cRef={stripeId} type={"text"}/>
              </div>
            </div>
            <div className={styles.btn_container}>
              <SubmitBtn btnFunction={handleAddProduct}/>
            </div>
        </>
  )
}

export default Add