import React, { useState, useEffect } from 'react'
import styles from '../styles/orders.module.css'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux'
import { addQuantity, changeTotal } from '../redux/cartSlice'
import Link from 'next/link'

const Orders = () => {
const dispatch = useDispatch();
const cart = useSelector((state) => state.cart)
const [orders, setOrders] = useState([])
const router = useRouter()
const [total, setTotal] = useState()
useEffect(() => {
  // set intital orders state to display
  if(localStorage.getItem("Orders") === null){
    localStorage.setItem("Orders", "[]");
   }
  const localData = JSON.parse(localStorage.getItem("Orders"))
  setOrders(localData)
  // set redux cart total for checkout component display
  const tot = 0;
  const localTotal = localData.map((data) => tot += data.totalPrice)
  if(tot>0){
  dispatch(changeTotal(tot))
  }
  else{
    dispatch(changeTotal(0))
  }
}, []);
 
const handleDelete = (order) => {
  const id = order.id;
  // get order and amount to me subtracted from cart.total
  const totalDiff = order.totalPrice;
  // filter total to disclude deleted order
  const newOrders = orders.filter((order) => order.id !== id)
  setOrders(newOrders)
  const cartTotal = cart.total - totalDiff;
  dispatch(changeTotal(cartTotal))
   localStorage.setItem("Orders", JSON.stringify(newOrders))
   dispatch(addQuantity());
}

const handleEdit = (id) => {
  const newOrders = orders.filter((order) => order.id !== id)
   localStorage.setItem("Orders", JSON.stringify(newOrders))
  dispatch(addQuantity());
}

const handleClear = () => {
  localStorage.setItem("Orders", "[]");
  dispatch(addQuantity());
  router.push("/");
}


  return (
  <div className={styles.container}>
    <div className={styles.hdr_container}>
        <h2 className={styles.hdr}>Name</h2>
        <h2 className={styles.hdr}>Fries</h2>
        <h2 className={styles.hdr}>Extras</h2>
        <h2 className={styles.hdr}>Quant.</h2>
        <h2 className={styles.hdr}>Note</h2>
        <h2 className={styles.hdr}>Price</h2>
        <h2 className={styles.hdr}>Action</h2>
    </div>

    {orders.map((order) => 
      <div key={order.id} className={styles.order_container}>
      <div className={styles.items_container}>
          <p className={styles.text}>{order.product.title}</p>
          <p className={styles.text}>{order.fries === false ? 'Yes' : 'No'}</p>
          <div className={styles.extras_container}>
            <ul className={styles.extraOptions}>
            {order.extraOptions.map((option) => 
            <li key={option._id}className={styles.text}>{option.title}</li>
            )}
            </ul>
            <ul className={styles.extraUpgrades}>
            {order.extraUpgrades.map((upgrade) => 
            <li key={upgrade._id} className={styles.text}>{upgrade.title}</li>
            )}</ul>
          </div>
          <p className={styles.text}>{order.quantity}</p>
          <p className={styles.text}>{order.note?.slice(0, 20)}..</p>
          <p className={styles.text}>£{order.totalPrice}</p>
      </div>
            <div className={styles.btn_container}>
        <Link href= {`/product/${order.product._id}`} ><button className={styles.btn_edit} onClick={() => handleEdit(order.id, order)}>Edit</button></Link>
        <button className={styles.btn_delete} onClick={() => handleDelete(order)}>Del</button>
            </div>
            </div>
    )}
    
    <button className={styles.btn_clear} onClick={() => handleClear()}>Clear Basket</button>
  </div>
  )
}

export default Orders