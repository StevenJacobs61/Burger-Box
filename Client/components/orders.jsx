import React, { useState, useEffect } from 'react'
import styles from '../styles/orders.module.css'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux'
import { addQuantity, changeTotal } from '../redux/cartSlice'

const Orders = () => {

  // **Redux
const dispatch = useDispatch();
const cart = useSelector((state) => state.cart)

// **State rendering order component
const [orders, setOrders] = useState([])

const router = useRouter()

// ** Get/Set orders object from local storage
// ** Send total to Checkout component for dynamic update
useEffect(() => {
  // If new user, set initial iterable state
  if(localStorage.getItem("Orders") === null){
    localStorage.setItem("Orders", "[]");
   }
  //  Get user's order data
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


// ** Delete item from cart/local storage and local state 
const handleDelete = (order) => {
  const id = order.id;
  // filter total to disclude deleted order and set new [orders]
  const newOrders = orders.filter((order) => order.id !== id)
  setOrders(newOrders)
  // Update redux cart total
  const totalDiff = order.totalPrice;
  const cartTotal = cart.total - totalDiff;
  dispatch(changeTotal(cartTotal))
   localStorage.setItem("Orders", JSON.stringify(newOrders))
   dispatch(addQuantity());
}

// ** Edit order - deletes item from lStorage/basket
// ** & redirects to Product order page
const handleEdit = (order) => {
  const id = order.id
  const newOrders = orders.filter((o) => o.id !== id)
   localStorage.setItem("Orders", JSON.stringify(newOrders))
  dispatch(addQuantity());
  router.push(`/product/${order.product._id}`)
}

// ** Makes lStorage "Orders" empty array, updates redux and state
const handleClear = () => {
  localStorage.setItem("Orders", "[]");
  dispatch(addQuantity());
  dispatch(changeTotal(0));
  setOrders([]);
}


  return (
    <>
          <h1 className={styles.title}> Your Order </h1>
  <div className={styles.container}>
    <div className={styles.hdr_container}>
        <h2 className={styles.hdr}>Name</h2>
        <h2 className={styles.hdr}>Fries</h2>
        <h2 className={styles.hdr}>Extras</h2>
        <h2 className={styles.hdr}>Quant</h2>
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
          <p className={styles.note}>{order.note?.slice(0, 20)}..</p>
          <p className={styles.text}>£{order.totalPrice}</p>
      </div>
            <div className={styles.btn_container}>
        <button className={styles.btn_edit} onClick={() => handleEdit(order)}>Edit</button>
        <button className={styles.btn_delete} onClick={() => handleDelete(order)}>Del</button>
            </div>
            </div>
    )}
    
      <button className={styles.btn_clear} onClick={() => handleClear()}>Clear Basket</button>
          <h3 className={styles.total}>Total: £{cart.total < 0 ? 0 : cart.total}</h3>
  </div>
        </>
  )
}

export default Orders