import React from 'react'
import styles from '../../styles/manage-product.module.css'
import Image from 'next/image'
import axios from 'axios'
import { useState } from 'react'
import MakeExtra from './make-extra'
import ViewProduct from './view-product'

const ManageProduct = ({product, setProducts,
  products, sections}) => {

    const [index, setIndex] = useState(products.indexOf(product));
    const [showMakeExtra, setShowMakeExtra] = useState(false);
    const [isExtra, setIsExtra] = useState(product.extraSection === null ? false : true)
    const [showButtons, setShowButtons] = useState(false);
  const [showProduct, setShowProduct] = useState(false);

    
// Delete a product
  const handleDelete = async (id) => {
    if(products.filter((prod) => prod.title === "Fries").length === 1){
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
    <tr className={styles.tr_title}>
      <td onClick={() => setShowProduct(true)}>{ products[index].available ?
      <Image style={{transform: products[index].available ? 'scale(1)' : 'scale(0.2)'}}
      className={styles.img} 
      src={'/img/burger.webp'} 
      width={50} height={50} objectFit='cover' alt='photo'
      />
     : <p className={styles.unavailable}>Unavailable</p> }
      </td>
      <td onClick={() => setShowProduct(true)}>{'12345678809'.slice(0, 5)}...</td>
      <td onClick={() => setShowProduct(true)}>{product.title}</td>
      <td onClick={() => setShowProduct(true)}>£{product.price}</td>
      <td> 
      {showButtons ?
        <div className={styles.btn_container}>
          <button className={styles.btn_available} style={{color: products[index].available ? '#00b20f' : '#7a7a7a'}} onClick={() => handleAvailable(product._id)}>{products[index].available ? 'Available' : 'Unavailable'}</button>
          <button className={styles.btn_upgrade} style={{color: products[index].upgrade ? 'rgb(0, 182, 160)' : '#7a7a7a'}} onClick={() => handleUpgrade(product._id)}>{products[index].upgrade ? 'Upgrade' : 'Make Upgrade'}</button>
          <button className={styles.btn_extra} style={{color: isExtra ? '#3e80d5' : '#7a7a7a'}} onClick={() => setShowMakeExtra(true)}>{isExtra ? 'Extra' : 'Make Extra'}</button>
          <button className={styles.btn_delete} onClick={() => handleDelete(product._id, product.title)}>Delete</button>
          <p onClick={()=>setShowButtons(false)}>Hide</p>
        </div>
          : <button className={styles.btn_show} onClick={()=>setShowButtons(true)}>Options</button>}
      </td>
    </tr>
  <tr>
    <td>
      {showMakeExtra ? <MakeExtra 
      setShowMakeExtra={setShowMakeExtra} 
      showMakeExtra={showMakeExtra}
      product={product} 
      sections={sections} 
      setIsExtra={setIsExtra}
      products={products}
      setProducts={setProducts}
      /> : null}
      {showProduct ? 
    <ViewProduct product={product} 
    products={products}
    setProducts={setProducts}
    setShowProduct={setShowProduct}
  />
    : null}
    </td>
  </tr>
  </>
      )
}

export default ManageProduct