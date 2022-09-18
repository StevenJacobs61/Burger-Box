import React from 'react'
import { useEffect } from 'react'
import styles from '../../../styles/success.module.css'
import axios from 'axios'
import { useState } from 'react'
import OrderComp from '../../../components/order-comp'
import { io } from 'socket.io-client';

export const getServerSideProps = async () => {
    const orderRes = await axios.get(`http://localhost:3000/api/orders`);
    const productsRes = await axios.get(`http://localhost:3000/api/products`);
    return {
        props:{
            orders: orderRes.data,
            products: productsRes.data
      }
    }
  };

const Success = ({orders, products}) => {
  
  const [order, setOrder] = useState()

  // Get fries product
  
  const [fries, setFries] = useState(products.filter((product) => product.title === "Fries")[0])


  // Websocket send payment confirmation
  
    const [socket, setSocket] = useState()

    useEffect(() => {
      setSocket(io("ws://localhost:7500"))
      const sock = io("ws://localhost:7500")
      const id = window.location.pathname.slice(-5, -1);
      const ordersFilter = orders.filter((entry) => entry._id.slice(-5, -1) ===  id )
      setOrder(ordersFilter[0])
      ordersFilter[0].status = 2
      try {
        sock?.emit("payment", ordersFilter[0]); 
        handleStatus(ordersFilter[0]);
        localStorage.setItem("Orders", "[]");
      } catch (error) {
        console.log(error);
      }
    },[])
 
  //  Mongoose call to reflect order status change 
  // ..from payment confirmation
    
    const handleStatus = async (order) => {
        const id = order._id
        const newData = {
            status: 2
        }
        try{
            const res = await axios.put('http://localhost:3000/api/orders/' + id, newData);
            }catch(err){
              console.log(err);
            }
          }
    

  return (
    <div className={styles.container}>
      <h1 className={styles.hdr}>
        Your payement has been successful, you're food will be {order?.delivery ? "out for delivery in approximately 30" : "ready for collection in approximately 20"} minutes, thank you for ordering!
      </h1>
      <p className={styles.text}>Order last updated at: {order ? order.updatedAt.slice(-13, -8) : null}</p>
  {order ?  <OrderComp order={order} fries={fries}/> : null}
    </div>
  )
  }

export default Success
