import React from 'react'
import styles from '../../styles/manage-products.module.css'
import { useState } from 'react'
import ManageSection from './manage-section'
import EditSections from './edit-sections'

const ManageProducts = ({productsList, sectionsList}) => {

    const [sections, setSections] = useState(sectionsList);
    const[showProducts, setShowProducts] = useState(true);
    const [products, setProducts] = useState(productsList);
    
    
  return (
    <div className={styles.container}>
         <h1 className={styles.products_hdr} onClick={() => setShowProducts(!showProducts)}>Manage Menu</h1>
        {showProducts ? <div>
            <EditSections setSections={setSections} sections={sections}/>              
           {sections.map((section) =>  (section ? <ManageSection key={section._id} section={section} sections={sections} setSections={setSections} products={products} setProducts={setProducts} /> : null))}
         </div> : null}
    </div>
  )
}

export default ManageProducts