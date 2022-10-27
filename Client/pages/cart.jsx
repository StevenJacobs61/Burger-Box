import React from 'react'
import Checkout from '../components/checkout'
import Orders from '../components/orders'
import styles from '../styles/cart.module.css'
import axios from 'axios'


const Cart = ({settingsList}) => {

  return (
    <div className={styles.container}>

      <div className={styles.wrapper}>
        <div className={styles.products}>
            <Orders/>
        </div>
        <div className={styles.checkout}>
          <Checkout settingsList={settingsList[0]}/>
        </div>
      </div>

    </div>
  )
}

export default Cart

export const getServerSideProps = async () => {
  
  const settingsRes = await axios.get('http://localhost:3000/api/settings');

  return {
    props:{
          settingsList: settingsRes.data,
        }
    }
} 