import React from 'react'
import styles from '../../styles/current-orders.module.css'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import ListItem from './list-item'
import axios from 'axios'
import Item from './item'
import { useSelector } from 'react-redux'

const CurrentOrders = ({orders}) => {
  // Show/hide sections on click

  const[sectionShow, setSectionShow] = useState([0,1,2,3,4,5]);

  const handleSectionShow = (section) => {
   const match = sectionShow.some((sect) => section === sect)
   if(match){
    setSectionShow(sectionShow.filter((sect) => sect !== section))
   }else{
    setSectionShow((prev) => ([...prev, section]))
   }
  }

  // Orders states
  const [orderSections, setOrderSections] = useState([1,2,3,4,0])
  const [ordersList, setOrdersList] = useState(orders)
  const [note, setNote] = useState()

  // Manage mute from redux

  const cart = useSelector((state) => state.cart);
  
  const [notifications, setNotifications] = useState();
  
  useEffect(() => {
    setNotifications(cart.notifications)
  }, [])
  useEffect(() => {
    setNotifications(cart.notifications)
  }, [cart])

  // Show items on click
  
  const [show, setShow] = useState(false)
  const [newOrder, setNewOrder] = useState()
  
  const showItem = (order) => {
    setNewOrder(order);
    setShow(true);
  };
  // Websocket updates
  
  const [socket, setSocket] = useState()
  
  useEffect(() => {
    setSocket(io("ws://localhost:7500"))
  }, [])
  useEffect(() => {
    if(show){
      setShow(false)
    }
    socket?.on("getNewOrder", (data) => {
      if (notifications){
        showItem(data);
      };
      setOrdersList((prev) => ([...prev, data]));
    });
    socket?.on("paid", (data) => {
      if (notifications){
        showItem(data);
      };
      setOrdersList(ordersList.map((order) => {
        if(order._id === data._id){
          order.status = 2;
        } return order;
      }));
    });
  }, [socket]);

  // Prevent duplicate orders
  useEffect(() => {
    setOrdersList([... new Set(ordersList)])
  }, [socket])
  useEffect(() => {
    setOrdersList([... new Set(ordersList)])
  }, [])


// MONGOOSE API CALL FUNCTIONS

// status: 
// 0 = Declined
// 1 = Active/Paid
// 2 = Completed
// 4 = Past
// 5 = Waiting payment

// Accept and Decline, also ListItem as a props

const handleAccept = async (id) => {
  const newData = {
    status: 5
  }
  try{
    const res = await axios.put('http://localhost:3000/api/orders/' + id, newData);
    setOrdersList(ordersList.map((item) => {
      if (item._id === id){
        item.status = 5;
      } return item;
     }))
    socket?.emit("respond", {id, res: true, note});
    setShow(false);
    setNote()
  }catch(err){
    console.log(err);
  }
}
const handleComplete = async (id) => {
  const newData = {
    status: 3
  }
try{
   const res = await axios.put('http://localhost:3000/api/orders/' + id, newData)
   setOrdersList(ordersList.map((item) => {
    if (item._id === id){
      item.status = 3;
    } return item;
   }));
   setShow(false);
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
       setOrdersList(ordersList.map((item) => {
        if (item._id === id){
          item.status = 0;
        } return item;
       }))
       socket?.emit("respond", {id, res: false, note});
       setShow(false);
       setNote();
   }catch(err){
       console.log(err);
   }}

   const handleDelete = async (order) => {
    try{
       const res = await axios.delete('http://localhost:3000/api/orders/' + order)
       const ord = ordersList.filter((item) => item._id === order)[0]
       setOrdersList(ordersList.filter((item) => item._id !== order));
       setShow(false);
      }catch(err){
        console.log(err);
      }
    }
  
    const handleSendPast = async (id) => {
      const newData = {
        status: 4
      }
    try{
       const res = await axios.put('http://localhost:3000/api/orders/' + id, newData)
       setOrdersList(ordersList.map((item) => {
        if(item._id === id){
          item.status = 4;
        } return item;
      }));
      setShow(false);
    }catch(err){
        console.log(err);
    }
  }

// Accept all new orders

const handleAcceptAll = async () => {
  const filter = {
    status: 1
  }
  const update = {
    status: 5
  }
try{
   const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
   setOrdersList(ordersList.map((item) => {
    if(item.status === 1){
      item.status = 5;
    } return item;
  }));
   socket?.emit("respond", {id: 1, res: true});
   setShow(false);
}catch(err){
    console.log(err);
}

// Decline all new orders

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
setOrdersList(ordersList.map((item) => {
  if(item.status === 1){
    item.status = 0;
  } return item;
}));
socket?.emit("respond", {id: 1, res: false});
setShow(false);
}catch(err){
console.log(err);
}
}


// Complete all active orders

const handleCompleteAll = async () => {
const filter = {
status: 2
}
const update = {
status: 3
}
try{
const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
setOrdersList(ordersList.map((item) => {
  if(item.status === 2){
    item.status = 3;
  } return item;
}));
setShow(false);
}catch(err){
console.log(err);
}
}

// Delete all past or declined orders

const handleDeleteAll = async (orderSection) => {
const filter = {
status: orderSection
}
try {
await axios.delete('http://localhost:3000/api/orders', filter);
setOrdersList(ordersList.filter((item) => item.status !== orderSection));
setShow(false);
} catch (error) {
console.log(error);
}
}

// Send to past all completed orders

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
setOrdersList(ordersList.map((item) => {
  if(item.status === 3){
    item.status = 4;
  } return item;
}));
setShow(false);
}catch(err){
console.log(err);
}
}
// END OF MONGOOSE API CALL FUNCTIONS
  return (
    <div className={styles.container}>
        <h1 className={styles.hdr}>Orders</h1>
         {orderSections.map((orderSection) =>
       <div className={styles.sections_container} key={orderSection}>
          <div className={styles.title_container}>
          <h1 className={styles.title_hdr} onClick={()=>handleSectionShow(orderSection)}>{
            orderSection === 0 ? "Declined " :
            orderSection === 1 ? "New " :
            orderSection === 2 ? "Active " :
            orderSection === 3 ? "Completed " :
            orderSection === 4 ? "Past " :
            null} 
            Orders</h1>
            {orderSection === 0 &&  <button className={styles.btn_clear} onClick={()=>handleDeleteAll(orderSection)}>Delete All</button>}
            {orderSection === 1 && <div className={styles.btn_all_container}>
              <button className={styles.btn_accept_all} onClick={handleAcceptAll}>Accept all</button>
              <button className={styles.btn_decline_all} onClick={handleDeclineAll}>Decline all</button>
            </div>}
            {orderSection === 2 &&   <button className={styles.btn_clear} onClick={handleCompleteAll}>complete all</button>}
            {orderSection === 3 && <button className={styles.btn_clear} onClick={handleSendPastAll}>Send past All</button>}
            {orderSection === 4 &&  <button className={styles.btn_clear} onClick={()=>handleDeleteAll(orderSection)}>Delete all</button>}
            </div>
            {sectionShow.some((sect) => sect === orderSection) ? <table className={styles.table}>
            <tbody>
              <tr className={styles.tr_title}>
                <th>ID</th>
                <th>Created/<br></br>Updated</th>
                <th>order</th>
                <th>Total</th>
                <th>C/D</th>
                <th>Action</th>
              </tr>
            </tbody>
            {ordersList?.filter((order) => order.status === orderSection || order.status === 5 && orderSection === 1)
            .map((item) => 
            <ListItem key={Math.random(1000)} 
            order={item} 
            handleAccept={handleAccept} 
            handleDelete={handleDelete} 
            showItem={showItem}
            handleComplete={handleComplete}
            handleDecline={handleDecline}
            handleSendPast={handleSendPast}
            />
            )}
            </table> : null}
       </div>
         )}
         {show ? 
       <Item 
       order={newOrder} 
       setNewOrder={setNewOrder} 
       setShow={setShow} 
       handleAccept={handleAccept} 
       handleDelete={handleDelete} 
       handleDecline={handleDecline} 
       handleComplete={handleComplete}
       handleSendPast={handleSendPast}
       setNote={setNote}
       /> 
       : null}
    </div>
  )
}

export default CurrentOrders

