import React from 'react'
import styles from '../../styles/orders-comp.module.css'
import { useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import ListItem from './list-item'
import Item from './item'
import { io } from 'socket.io-client'


const Orders = ({orders, status}) => {

// order.status:  
  // 1 = submitted
  // 2 = accepted
  // 3 = completed
  // 4 = past
  // 0 = declined
  // 5 = waiting for restaurant response

  const [ordersZero, setOrdersZero] = useState()
  const [ordersOne, setOrdersOne] = useState()
  const [ordersTwo, setOrdersTwo] = useState()
  const [ordersThree, setOrdersThree] = useState()
  const [ordersFour, setOrdersFour] = useState()
  const [ordersFive, setOrdersFive] = useState()
  const [show, setShow] = useState(true)
  const router = useRouter();
  const [showItem, setShowItem] = useState(false)
  const [newOrder, setNewOrder] = useState()
  const [socket, setSocket] = useState(null)
  
  useEffect(() => {
    
    setOrdersZero(orders.filter(order => order.status === 0));
    setOrdersOne(orders.filter(order => order.status === 1));
    setOrdersTwo(orders.filter(order => order.status === 2));
    setOrdersThree(orders.filter(order => order.status === 3));
    setOrdersFour(orders.filter(order => order.status === 4));
    setOrdersFive(orders.filter(order => order.status === 5));
    
  }, [orders])

  

  useEffect(() => {
    setSocket(io("ws://localhost:7500"))
  }, [])

  useEffect(() => {
    socket?.on("getNewOrder", (data) => {
      setNewOrder(data);
      setOrdersOne((prev) => ([...prev, data]));
      setShowItem(true);
    });
    socket?.on("paid", (data) => {
      setNewOrder(data);
      setOrdersTwo((prev) => ([...prev, data]))
      setShowItem(true)
    })
  }, [socket]);


  
  const handleAccept = async (id) => {
    const newData = {
      status: 5
    }
    try{
      const res = await axios.put('http://localhost:3000/api/orders/' + id, newData);
      setOrdersOne(ordersOne.filter((order) => order._id !== id));
      socket?.emit("respond", {id, res: true});
    }catch(err){
      console.log(err);
    }
  }
  
  
      const handleDecline = async (id) => {
       const newData = {
         status: 0
       }
     try{
        const res = await axios.put('http://localhost:3000/api/orders/' + id, newData)
         setOrdersOne(ordersOne.filter((order) => order._id !== id))
         socket?.emit("respond", {id, res: false});
     }catch(err){
         console.log(err);
     }}

 const handleAcceptAll = async () => {
      const filter = {
        status: 1
      }
      const update = {
        status: 2
      }
    try{
       const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
       setOrdersOne([])
       socket?.emit("respond", {id: 1, res: true});
    }catch(err){
        console.log(err);
    }

 }
 const handleDeclineAll = async () => {
  const filter = {
    status: 1
  }
  const update = {
    status: 0
  }
try{
   const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
   setOrdersOne([])
   socket?.emit("respond", {id: 1, res: false});
}catch(err){
    console.log(err);
}

}

const handleCompleteAll = async () => {
const filter = {
  status: 2
}
const update = {
  status: 3
}
try{
 const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
 setOrdersTwo([])
}catch(err){
  console.log(err);
}
}

const handleDeleteAll = async () => {
  const filter = {
    status: status
  }
  try {
    await axios.delete('http://localhost:3000/api/orders', filter);
    setShow(false)
    if(status === 0){
    setOrdersZero([])}
    if(status === 4) {
      setOrdersFour([])
    }
  } catch (error) {
    console.log(error);
  }
}
const handleSendPastAll = async () => {
  const filter = {
    status: 3
  }
  const update = {
    status: 4
  }
try{
   const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
   setShow(false)
    setOrdersThree([])
}catch(err){
    console.log(err);
}
}


const header = 
  status === 0 ? 'Declined' 
: status === 1 ? 'New' 
: status === 2 ? 'Active' 
: status === 3 ? 'Completed' 
: 'Past';

 
  return (
    <div className={styles.container}>
        <div className={styles.title_container}>
          <h1 className={styles.hdr} onClick={() => setShow(!show)}>{header} Orders</h1>
          {status === 0 &&  <button className={styles.btn_clear} onClick={handleDeleteAll}>Clear All</button>}
          {status === 1 && <div className={styles.btn_all_container}>
            <button className={styles.btn_accept_all} onClick={handleAcceptAll}>Accept all</button>
            <button className={styles.btn_decline_all} onClick={handleDeclineAll}>Decline all</button>
          </div>}
          {status === 2 &&   <button className={styles.btn_clear} onClick={handleCompleteAll}>complete all</button>}
          {status === 3 && <button className={styles.btn_clear} onClick={handleSendPastAll}>Send past All</button>}
          {status === 4 &&  <button className={styles.btn_clear} onClick={handleDeleteAll}>Delete all</button>}
        </div>
    {show &&  <table className={styles.table}>
       <tbody>
         <tr className={styles.tr_title}>
           <th>Id</th>
           <th>order</th>
           <th>Total</th>
           <th>Coll/Del</th>
           <th>Action</th>
         </tr>
       </tbody>
   {status === 0 ?  ordersZero?.map((order) => 
         <ListItem order={order} key={order._id} 
         setOrdersZero={setOrdersZero} 
         ordersZero={ordersZero}/>)
    :status === 1 ? ordersOne?.map((order) => 
         <ListItem order={order} key={Math.random()} 
         setOrdersOne={setOrdersOne}
         ordersOne={ordersOne}
         handleAccept={handleAccept}
         handleDecline={handleDecline}
         setOrdersTwo={setOrdersTwo}
         />)
    && ordersFive?.map((order) => 
         <ListItem order={order} key={Math.random()} 
         ordersFive={ordersFive}
         />)
   :status === 2 ? ordersTwo?.map((order) => 
         <ListItem order={order} key={Math.random()} 
         setOrdersTwo={setOrdersTwo}
         ordersTwo={ordersTwo}
         />)
   :status === 3 ? ordersThree?.map((order) => 
         <ListItem order={order} key={order._id} 
         setOrdersThree={setOrdersThree}
         ordersThree={ordersThree}
         />)
   :status === 4 ? ordersFour?.map((order) => 
         <ListItem order={order} key={order._id}
         setOrdersFour={setOrdersFour}
         ordersFour={ordersFour}
         />) : null}
     </table>
     } 
      {showItem ? 
       <Item 
       order={newOrder} 
       setNewOrder={setNewOrder} 
       setShowItem={setShowItem} 
       handleAccept={handleAccept} 
       handleDecline={handleDecline} 
       status={newOrder.status}/> 
       : null}
    </div>
  )

}
export default Orders