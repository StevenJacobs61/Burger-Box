import React from 'react'
import styles from '../../../styles/manage-product.module.css'
import Image from 'next/image'
import axios from 'axios'
import { useState } from 'react'
import MakeExtra from './make-extra'
import ViewProduct from './view-product'
import Show from '../../show'

const ManageProduct = ({product, setProducts,
  products, sections}) => {

    const [index, setIndex] = useState(products.indexOf(product));
    const [showMakeExtra, setShowMakeExtra] = useState(false);
    const [isExtra, setIsExtra] = useState(product.extraSection === null ? false : true)
    const [showButtons, setShowButtons] = useState(false);
  const [showProduct, setShowProduct] = useState(false);

    
// Delete a product
  const handleDelete = async (id) => {
    if(product.title === "Fries" && products.find((p)=> p.title === "Fries")){
      alert("Must have a menu item titled 'Fries'")
    } else{
    try {
      const res = await axios.delete(
        "http://localhost:3000/api/products/" + id
      );
      setProducts(products.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }}
  };

// Manage products availability settings
  const handleAvailable = async (id) => {
   const newData = {
    available: !products[index].available
   }
  try{
     const res = await axios.put('http://localhost:3000/api/products/' + id, newData)
     setProducts(products.map((prod) => {
      if (prod._id === id) {
        prod.available = newData.available;
      } return prod;
     }))
  }catch(err){
      console.log(err);
  }};

  // Make product an upgrade option
  const handleUpgrade = async (id) => {
   const newData = {
    upgrade: !products[index].upgrade
   }
   try{
     const res = await axios.put('http://localhost:3000/api/products/' + id, newData)
     setProducts(products.map((prod) => {
      if (prod._id === id) {
        prod.upgrade = newData.upgrade;
      } return prod;
     }))
  }catch(err){
      console.log(err);
  }};
  return(
  <>
    <tr className={styles.tr}>
      <td onClick={() => setShowButtons(!showButtons)}>{ products[index]?.available ?
        <Image style={{transform: products[index].available ? 'scale(1)' : 'scale(0.2)', cursor: "pointer"}}
        className={styles.img}
        src={'/img/burger.webp'}
        width={40} height={40} objectFit='cover' alt='photo'
        />
     : <p className={styles.unavailable}>x</p> }
      </td>
      <td className={styles.text} onClick={() => setShowButtons(!showButtons)}>{'12345678809'.slice(0, 5)}...</td>
      <td className={styles.text} onClick={() => setShowButtons(!showButtons)}>{product.title}</td>
      <td className={styles.text} onClick={() => setShowButtons(!showButtons)}>{product.price === 0 ? "Free" : `£${product.price}`}</td>
      <td> 
      {showButtons ?
        <div className={styles.btn_container}>
          <button className={styles.btn_available} style={{color: products[index]?.available ? '#00b20f' : '#7a7a7a'}} onClick={() => handleAvailable(product._id)}>{products[index]?.available ? 'Available' : '+ available'}</button>
          <button className={styles.btn_upgrade} style={{color: products[index]?.upgrade ? 'rgb(210, 164, 16)' : '#7a7a7a'}} onClick={() => handleUpgrade(product._id)}>{products[index]?.upgrade ? 'Upgrade' : '+ Upgrade'}</button>
          <button className={styles.btn_extra} style={{color: isExtra ? '#3e80d5' : '#7a7a7a'}} onClick={() => setShowMakeExtra(true)}>{isExtra ? 'Extra' : '+ Extra'}</button>
          <button className={styles.btn_edit} onClick={()=> setShowProduct(true)}>Edit</button>
          <button className={styles.btn_delete} onClick={() => handleDelete(product._id, product.title)}>Delete</button>
        </div>
          : <button className={styles.btn_show} onClick={()=>setShowButtons(true)}>Options</button>}
      </td>
    </tr>
  <tr>
    <td>
      {showMakeExtra ?
      <Show
      setShowAdd={setShowMakeExtra} 
      >
        <MakeExtra 
        showMakeExtra={showMakeExtra}
        product={product} 
        sections={sections} 
        setIsExtra={setIsExtra}
        products={products}
        setProducts={setProducts}
        />
      </Show>
       : null}
      {showProduct ? 
      <Show
      setShowAdd={setShowProduct}
      >
        <ViewProduct product={product} 
        products={products}
        setProducts={setProducts}
      />
      </Show>
    : null}
    </td>
  </tr>
  </>
      )
}

export default ManageProduct