import React from 'react'
import styles from '../../styles/manage-extras.module.css'
import { useState } from 'react'
import axios from 'axios'

const ManageExtra = ({product, products, setProducts}) => {
  
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
    };

    const handleDelete = async (id) => {
      if(products.filter((prod) => prod.title === "Fries").length === 1){
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

  return (
    <tr className={styles.tr_title}>
    <td>{products[index].available ? null : "Unavailable"}</td>
    <td>{'12345678809'.slice(0, 5)}...</td>
    <td>{product.title}</td>
    <td>{product.price}</td>
    <td>
      {showButtons ? 
        <div className={styles.btn_container}>
          <button className={styles.btn_available} style={{color: products[index].available ? '#00b20f' : '#7a7a7a'}} onClick={() => handleAvailable(product._id)}>{products[index].available ? 'Available' : 'Unavailable'}</button>
          <button className={styles.btn_delete} onClick={() => handleDelete(product._id)}>Delete</button>
          <p onClick={()=>setShowButtons(false)}>Hide</p>
        </div>
        : <button className={styles.btn_show} onClick={()=>setShowButtons(true)}>Options</button>}
    </td>
</tr>
  )
}

export default ManageExtra