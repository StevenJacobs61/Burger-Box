import React from 'react'
import styles from '../../../styles/manage-extras.module.css'
import { useState } from 'react'
import axios from 'axios'

const ManageExtra = ({product, products, setProducts, section}) => {
  
  const [index, setIndex] = useState(products.indexOf(product)) 
  const [showButtons, setShowButtons] = useState(false);
  

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
     }
    }

    const handleDel = async (id) => {
      if(product.title === "Fries" && products.find((p)=> p.title === "Fries")){
        alert("Must have a menu item titled 'Fries'")
      } else{
        try {
          const res = await axios.delete(
            "http://localhost:3000/api/products/" + id
          );
            setProducts(products.filter((prod) =>  prod._id !== id))
        } catch (err) {
          console.log(err);
        }}
      };

    const handleDelExtra = async (id) => {
      const extraSections = product.extraSection.filter((es)=> es !== section.title)
      const newData = {
        extraSection:extraSections
      }
     
        try {
          const res = await axios.put(
            "http://localhost:3000/api/products/" + id, newData);
            setProducts(products.map((prod) => {
              if (prod._id === id){
                prod.extraSection = extraSections
              } return prod;
            }))
        } catch (err) {
          console.log(err);
        }
      }
      
      
  return (
    <tr className={styles.tr_title}>
    <td className={styles.unavailable} onClick={()=>setShowButtons(!showButtons)}>{products[index].available ? null : "x"}</td>
    <td className={styles.text} onClick={()=>setShowButtons(!showButtons)}>{'12345678809'.slice(0, 5)}...</td>
    <td className={styles.text} onClick={()=>setShowButtons(!showButtons)}>{product.title}</td>
    <td className={styles.text} onClick={()=>setShowButtons(!showButtons)}>{product.price === 0 ? "Free" : `£${product.price}`}</td>
    <td>
      {showButtons ? 
        <div className={styles.btn_container}>
          <button className={styles.btn_available} style={{color: products[index].available ? '#00b20f' : '#7a7a7a'}} onClick={() => handleAvailable(product._id)}>{products[index].available ? 'Available' : '+ available'}</button>
          <button onClick={()=>handleDelExtra(product._id)}>- Extra</button>
          <button className={styles.btn_delete} onClick={() => handleDel(product._id)}>Delete</button>
        </div>
        : <button className={styles.btn_show} onClick={()=>setShowButtons(true)}>Options</button>}
    </td>
</tr>
  )
      }

export default ManageExtra