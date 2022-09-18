import React from 'react'
import styles from '../../styles/manage-section.module.css'
import { useState } from 'react'
import ManageProduct from './manage-product'
import Add from './add'
import axios from 'axios'
import ManageExtras from './manage-extras'
import { useEffect } from 'react'

const ManageSection = ({section, products, setProducts, sections, setSections}) => {
  
  const [index, setIndex] = useState(sections.indexOf(section));
  const[showProducts, setShowProducts] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [isExtra, setIsExtra] = useState(false)
  const [showProduct, setShowProduct] = useState(false);
  const [showExtras, setShowExtras] = useState(false)


  const handleAvailable = async (id) => {
    const newAvailable = !sections[index].available;
      const newData = {
       available: newAvailable
      }
     try{
        const res = await axios.put('http://localhost:3000/api/sections/' + id, newData)
        setSections(sections.map((sect) => {
          if (sect._id === id) {
            sect.available = newData.available;
          } return sect;
        }))
     }catch(err){
         console.log(err);
     }
    };
    const handleExtraAdd = () => {
      setIsExtra(true);
      setShowAdd(true);
    }
   
  return (
    <div className={styles.container}>
    <div className={styles.title_container} style={{background: sections[index].available ? '#fff' : '#cccaca'}}>
      <h1 className={styles.header} onClick={() => setShowProducts(!showProducts)}>{section.title}</h1>
<div className={styles.btn_container}>
  <button className={styles.btn_add} onClick={() => setShowAdd(true)}>Add <br/> Product</button>
  <button className={styles.btn_available} style={{color: sections[index].available ? '#00b20f' : '#cccaca'}} onClick={() => handleAvailable(section._id)}>{sections[index].available ? 'Available' : 'Unavailable'}</button>
</div>
</div>
   {showProducts ? <table className={styles.table}>
      <tbody>
        <tr className={styles.tr_title}>
          <th>Image</th>
          <th>ID</th>
          <th>Title</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </tbody>
      <tbody>
        {products.map((product) =>
      (product.section === section.title ? 
      <ManageProduct  key={product._id} product={product} 
     sections={sections} 
      setProducts={setProducts}
      products={products}
      />: null))}
      <tr>
        <td>
            <h3 className={styles.hdr_extras} onClick={() => setShowExtras(!showExtras)}>extras</h3>
        </td>
      </tr>
     { showExtras ? <tr>
        <td>
            <button className={styles.btn_add} onClick={handleExtraAdd}>Add Extra</button>
        </td>
      </tr>: null}
      {showExtras ? products?.map((product) => 
      product.extraSection?.some((extraSection) => 
      extraSection === section.title) ?
      <ManageExtras key={product._id} setProducts={setProducts}
      product={product} products={products}/>
: null) : null}
     </tbody>
    </table> : null}
    {showAdd ? <Add isExtra={isExtra} setIsExtra={setIsExtra} 
    setShowAdd={setShowAdd} sections={sections} 
    section={section}
    products={products} setProducts={setProducts}/> 
    : null} 
  </div>

  )
}

export default ManageSection