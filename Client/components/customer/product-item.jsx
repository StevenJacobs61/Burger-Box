import React from 'react'
import styles from '../../styles/product.module.css'

const ProductItem = ({product, handleSection, section}) => {

  return (
    <div key={product._id}className={styles.topping_container}>
<h3 className={styles.topping}>{product.title}</h3>
  <div className={styles.price_wrapper}> 
<input className={styles.toppingCheckbox} type="checkbox"  onClick={()=> handleSection(product, section)}/>
    {product.price > 0 ? <p className={styles.toppingPrice}>£{product.price}</p> 
    : <p className={styles.toppingPrice}>Free!</p> }
  </div>
</div>
  )
}

export default ProductItem