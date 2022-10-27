import React from 'react'
import styles from '../../styles/order.module.css'
import axios from 'axios';
import OrderComp from '../../components/order-comp';
import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import { CheckOut } from "../../components/stripe"



const Order = ({order, products}) => {

  const friesArray = products.filter((product) => product.title === "Fries")
  const [fries, setFries] = useState(friesArray[0])
  const [accepted, setAccepted] = useState(null)
  const [productsList, setProductsList] = useState([])
  const [note, setNote] = useState();
  const socket = useRef(io("ws://localhost:7500"))



 useEffect(() => {
  // Arrange main order items to array with product id and quantity
  const productsArray = products.map((product) => 
    ({
     price: product.stripeId,
     quantity: 0
 }) 
  );
  const itemsArray = productsArray.map((product) => {
    order.orders.map((order) => {
      if (order.product.stripeId === product.price){
        product.quantity += parseInt(order.quantity)
      };
      order.extraOptions.map((extra) => {
        if(extra.stripeId === product.id){
          product.quantity += parseInt(order.quantity)
        }
      });
      order.extraUpgrades.map((upgrade) => {
        if(upgrade.stripeId === product.price){
          product.quantity ++
        }
      });
      if(product.price === fries.stripeId && order.fries){
        product.quantity += parseInt(order.quantity)
      };
    });
  },
  );
  const finalArray = productsArray.filter((product) =>
  product.quantity !== 0
  )
  setProductsList(finalArray)
  setAccepted(order.status)
}, []);


//  Websocket connection to admin
// connect

useEffect(() => {
  // get response accepted or declined and refunded
  socket.current.on("getResponse", (res) => {
    if(res.data.id == order._id || res.data.id == 1){
      if(res.data.res){
        setAccepted(2)
      }
      if(!res.data.res) {
        setAccepted(0)
      }
    }
    setNote(res.data.note)
  })
}, [socket]);

//  Function will be replaced by webhook from stripe when live

useEffect(() => {
  if(order.status === 1){
    socket.current.emit("newOrder", order);
    localStorage.setItem("Orders", "[]")
  }
  }, [])

const handlePaid = async (id) => {
  const data = {
    status:1
  }
  try {
    await axios.put("http://localhost:3000/api/orders/" + id, data)
  } catch (error) {
    console.log(error);
  }
}



  return (
    <div className={styles.container}>
     <div className={styles.inner_container}>
       <div className={styles.wrapper}>
        {accepted === 5 ?
        <>
         <h1 className={styles.hdr}>Please Check your order and click checkout</h1>
         <button id={styles.top} className={styles.btn_pay} onClick={() => {CheckOut({lineItems: productsList}, order._id, order.details.email), handlePaid(order._id)}}>Checkout</button>
         {/* <button className={styles.btn_pay} onClick={() => handlePaid(order._id)}>Paid</button> */}
         </>
       : accepted === 1 ?
       <h1 className={styles.hdr}>Your order has been submitted to the restaurant</h1>
           : accepted === 2 ? 
           <h1 className={styles.hdr}>Your order is being prepared, it will {order.delivery ? `arrive in` : " beready for collection in"} {order.time} minutes </h1>
           : accepted === 0 ? 
        <h1 className={styles.hdr}>Your order has been declined and funds will refunded to your account within 3-5 business days</h1>
           : accepted === 3  ?
           <h1 className={styles.hdr}>Your order has been completed, enjoy!</h1>
           : null}
           <p className={styles.notice}>* Do not leave this page whilst order is in progress</p>
           <p className={styles.notice}>Please refresh the page after a short while if you haven't recived an expected update</p>
           {note?.length >= 1 ?
       <>
       <h2 className={styles.note_hdr}>Message from the BurgerBox:</h2>
        <p className={styles.note}>"{note}"</p>
        </> : null}
        <p className={styles.total} id={styles.total}>Total: {order.total}</p>
       </div>
       <OrderComp order={order} fries={fries}/>
       {accepted === 5 ? <button id={styles.bottom} className={styles.btn_pay} onClick={() => {CheckOut({lineItems: productsList}, order._id, order.details.email), handlePaid(order._id)}}>Checkout</button> : null}
     </div>
   </div>
    )
    

  }
  export const getServerSideProps = async ({params}) => {
    const orderRes = await axios.get(`http://localhost:3000/api/orders/${params.id}`);
    const productsRes = await axios.get("http://localhost:3000/api/products");
    
    return {
      props:{
        order: orderRes.data,
        products: productsRes.data,
      }
    }
  };

export default Order;