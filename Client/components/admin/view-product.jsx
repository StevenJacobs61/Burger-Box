import React from 'react'
import styles from "../../styles/view-product.module.css"
import {AiOutlineClose} from 'react-icons/ai';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const ViewProduct = ({product, setShowProduct, setProducts, products}) => {
  const [file, setFile] = useState(product.img);
  const [title, setTitle] = useState(product.title);
  const [desc, setDesc] = useState(product.desc);
  const [stripeId, setStripeId] = useState(product.stripeId);
  const [price, setPrice] = useState(product.price);


  const handleUpdate = async () => {
    const id = product._id;
    const newFile = file ? product.file : file;
    const newTitle = title === "" ? product.title : title;
    const newPrice = price === "" ? product.price : price;
    const newDesc = desc === "" ? product.desc : desc;
    const newStripeId = stripeId === "" ? product.stripeId : stripeId;
  
      const newData = {
        img:newFile,
        title:newTitle,
        desc:newDesc,
        price:newPrice,
        stripeId:newStripeId
      };
      if(newData.price < 0){
        alert("Price must be 0 or above.")
      }else{
      try{
      const res = await axios.put("http://localhost:3000/api/products/" + id, newData)
      setProducts((products.map((prod) => {
        if(prod._id === id) {
          prod.img = newFile;
          prod.title = newTitle;
          prod.price = newPrice;
          prod.desc = newDesc;
          prod.stripeId = newStripeId;
        } return prod;
      })))
      setShowProduct(false);
      } catch (err) {
        console.log(err);
        alert("There was an error.")
      }}
  }


  return (
        <div className={styles.container}>
        <div className={styles.wrapper}>
        <p className={styles.hdr_text}>Update</p>    
        <h1 className={styles.hdr}>"{product.title}"</h1>
        <AiOutlineClose className={styles.close} onClick={() => {setShowProduct(false)}}></AiOutlineClose>
        <div className={styles.input_container}>
            <label className={styles.label}>Current title:</label>
            <h2 className={styles.text}>{product.title}</h2>
              <label className={styles.label}>Set title:</label>
              <input className={styles.input} onChange={(e) => setTitle(e.target.value)} type="text"/>
            </div>
        <div className={styles.input_container}>
            <label className={styles.label}>Current Price:</label>
            <h2 className={styles.text}>£{product.price}</h2>
              <label className={styles.label}>Set Price:</label>
              <input className={styles.input} onChange={(e) => setPrice(e.target.value)} type="number"/>
            </div>
        <div className={styles.input_container}>
            <label className={styles.label}>Current Description:</label>
            <h2 className={styles.text}>"{product.desc}"</h2>
              <label className={styles.label}>Set Description:</label>
              <textarea className={styles.textarea} onChange={(e) => setDesc(e.target.value)} type="text"/>
            </div>
        <div className={styles.input_container}>
            <label className={styles.label}>Current Image:</label>
            <h2 className={styles.text}>{product.img}</h2>
              <label className={styles.label}>Set Image:</label>
              <input className={styles.input} onChange={(e) => setFile(e.target.value)} type="text"/>
            </div>
        <div className={styles.input_container}>
            <label className={styles.label}>Current Stripe-ID:</label>
            <h2 className={styles.text}>{product.title}</h2>
              <label className={styles.label}>Set Stripe-ID:</label>
              <input className={styles.input} onChange={(e) => setStripeId(e.target.value)} type="text"/>
            </div>
            <button className={styles.btn} onClick={handleUpdate}>Submit</button>
        </div>
        </div>
  )
}

export default ViewProduct