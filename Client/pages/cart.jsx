import React from 'react'
import Checkout from '../components/checkout'
import Orders from '../components/orders'
import styles from '../styles/cart.module.css'
import axios from 'axios'
import settings from '../models/settings'
import dbConnect from '../utils/mongodb'


const Cart = ({setts}) => {
  const settingsList = JSON.parse(setts)

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
  await dbConnect()
  const settingsRes = await settings.find()
  const setts = JSON.stringify(settingsRes)
  // const settingsRes = await axios.get('http://localhost:3000/api/settings');

  return {
    props:{
          setts: setts
        }
    }
} 