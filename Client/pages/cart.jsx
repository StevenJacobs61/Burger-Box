import React from 'react'
import Checkout from '../components/checkout'
import Orders from '../components/orders'
import styles from '../styles/cart.module.css'


const Cart = () => {

  return (
    <div className={styles.container}>
      <div className={styles.products}>
      <h1 className={styles.hdr}> Your Burger Box Order ... </h1>
    <Orders/>

      </div>
      <div className={styles.checkout}>
        <Checkout/>
      </div>

    </div>
  )
}

export default Cart