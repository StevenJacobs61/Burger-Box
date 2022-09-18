import React from 'react'
import styles from '../../styles/order.module.css'
import axios from 'axios';
import OrderComp from '../../components/order-comp';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { CheckOut } from "../../components/stripe"



const Order = ({order, products}) => {

  const friesArray = products.filter((product) => product.title === "Fries")
  const [fries, setFries] = useState(friesArray[0])
  const [socket, setSocket] = useState(null)
  const [accepted, setAccepted] = useState(null)
  const [productsList, setProductsList] = useState([])
  const [note, setNote] = useState();
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
}, []);

//  Websocket connection to admin

  useEffect(() => {
    setSocket(io("ws://localhost:7500"))
  }, [])
  useEffect(() => {
    
    socket?.on("getResponse", (res) => {
     
      if(res.data.id === order._id || res.data.id === 1){
        setAccepted(res.data.res)
      }
      setNote(res.data.note)
    })
 }, [socket]);
 useEffect (() => {
    if (order.status === 1){
      setAccepted(null)
    }
    if(order.status === 5){
      setAccepted(true)
    }
    if(order.status === 0){
      setAccepted(false)
    }

 }, [])

  return (
    <div className={styles.container}>
     <div className={styles.wrapper}>
      {accepted === null ?
       <h1 className={styles.hdr}>Your Order Has been submitted. Please wait for BurgerBox to accept... </h1>
     : accepted ?  
     <>
     <h1 className={styles.hdr}>Your order has been accepted.</h1>
        <button className={styles.btn_pay} onClick={() => CheckOut({lineItems: productsList}, order._id, order.details.email)}>Pay Now</button>
     </>
    : !accepted ? 
    <>
      <h1 className={styles.hdr}>Your has been declined</h1>
      
      <h3 className={styles.hdr}>Please contact the restaurant for further information</h3>
      
    </>
    : null}
    <p className={styles.notice}>* Do not leave this page whilst order is in progress</p>
    <p className={styles.notice}>Please refresh this page every 30 seconds if you havent recived an update</p>
    {note?.length >= 1 ?
     <>
     <h2 className={styles.note_hdr}>Message from the BurgerBox:</h2>
      <p className={styles.note}>"{note}"</p>
      </> : null}
     </div>

     <OrderComp order={order} fries={fries}/>
     {accepted ?  <button className={styles.btn_pay} onClick={() => CheckOut({lineItems: productsList}, order._id, order.details.email)}>Pay Now</button> : null}
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