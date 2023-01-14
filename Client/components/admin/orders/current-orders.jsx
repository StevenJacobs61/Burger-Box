import React from 'react'
import styles from '../../../styles/current-orders.module.css'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import ListItem from './list-item'
import axios from 'axios'
import Item from '../orders/item'
import { useSelector } from 'react-redux'
import Show from '../../show'

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
  const [orderSections, setOrderSections] = useState([1,2,3,0,4])
  const [ordersList, setOrdersList] = useState(orders)
  const [note, setNote] = useState()

  // Manage mute from redux

  const cart = useSelector((state) => state.cart);
  
  const [notifications, setNotifications] = useState();
  
  useEffect(() => {
    setNotifications(cart.notifications)
  }, [cart.notifications])
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
  const socket = useRef(io("ws://localhost:7500"))
  
  useEffect(() => {
      socket.current?.on("getNewOrder", (data) => {
        console.log("order recieved");
        if (notifications){
          showItem(data);
        };
        setOrdersList((prev) => ([...prev, data]));
        setOrdersList([... new Set(ordersList)])
      });
      socket.current.on("paid", (data) => {
        if (notifications){
          showItem(data);
        };
        setOrdersList([... new Set(ordersList.map((order) => {
          if(order._id === data._id){
            order.status = 2;
          } return order;
        })
        )
      ]);
      });
  }, [socket, ordersList, notifications]);



  // MONGOOSE API CALL FUNCTIONS

  // status: 
  // 0 = Declined
  // 1 = Active/Paid
  // 2 = Completed
  // 4 = History
  // 5 = Waiting payment

  // Accept and Decline, ListItem prop

  const handleAccept = async (id) => {
    const newData = {
      status: 2
    }
    try{
      const res = await axios.put('/api/orders/' + id, newData);
      setOrdersList(ordersList.map((item) => {
        if (item._id === id){
          item.status = 2;
        } return item;
      }))
      socket.current.emit("respond", {id, res: true, note});
      console.log("response submitted");
      setShow(false);
      setNote()
    }catch(err){
      console.log(err);
    }
  }

// Complete

  const handleComplete = async (id) => {
    let order = null;
    const newData = {
      status: 3
    }
  try{
    const res = await axios.put('http://localhost:3000/api/orders/' + id, newData)
    setOrdersList(ordersList.map((item) => {
      if (item._id === id){
        item.status = 3;
        order = item;
      } return item;
    }));
    setShow(false);
    socket.current.emit("respond", {order})
  }catch(err){
      console.log(err);
  }
  }

  // Decline and refund full

    const handleDecline = async (id) => {
     const newData = {
       status: 0
     }
     let success = false;
     let amount = 0;
     if(confirm("Are you sure you want to delete this order?"))
    {
     try {
       const refund = await axios.post("http://localhost:3000/api/refund", {id, amount})
       success = refund.data.success
     } catch (error) {
      console.log(error);
     }
     if(success){
   try{
      const res = await axios.put("http://localhost:3000/api/orders/" + id, newData)
       setOrdersList(ordersList.map((item) => {
        if (item._id === id){
          item.status = 0;
        } return item;
       }))
       socket.current.emit("respond", {id, res: false, note});
       setShow(false);
       setNote();
   }catch(err){
       console.log(err);
   }}
   if (!success){
    alert("Refund was unsuccessful")
   };
  };
  };

  // REFUND certain amount

  const handleRefund = async (order, amount) => {
    console.log(amount);
    const id = order._id
    amount = parseInt(amount) * 100
    const total = order.total
    total = total * 100
      let success = false;
      if(total < amount){
        alert("The amount to refund must be less or equal to the order total!")
      }else{
      if (confirm("Are you sure you want to make this refund?")){
        try {
          const refund = await axios.post("http://localhost:3000/api/refund", {id, amount})
          success = refund.data.success
        } catch (error) {
         console.log(error);
        }
      }
      if(success){
        setShow(false)
        const refundAmount = amount/100;
        if(amount === 0){
          refundAmount = order.total
        }
        const data = {
          refunded: refundAmount
        }
        try{
          const res = await axios.put("http://localhost:3000/api/orders/" + id, data)
          setOrdersList(ordersList.map((ord) => {
            if(ord._id === id){
              ord.refunded = refundAmount
            } return ord;
          }))
        } catch (err){
          console.log(err);
        }
      }
    }
  }

  // Delete

   const handleDelete = async (order) => {
    if(confirm("Are you sure you want to delete this order?"))
    {
    try{
       const res = await axios.delete('http://localhost:3000/api/orders/' + order)
       const ord = ordersList.filter((item) => item._id === order)[0]
       setOrdersList(ordersList.filter((item) => item._id !== order));
       setShow(false);
      }catch(err){
        console.log(err);
      }
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
    status: 2
  }
try{
   const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
   setOrdersList(ordersList.map((item) => {
    if(item.status === 1){
      item.status = 2;
    } return item;
  }));
  socket.current.emit("respond", {id: 1, res: true});
   setShow(false);
}catch(err){
    console.log(err);
}

// Decline all new orders

}
const handleDeclineAll = async () => {
const toDecline = ordersList.filter((o) => o.status === 1) 
const update = {
status: 0
}
if(confirm("Are you sure you want to decline these orders?")){
  let amount = 0;
      try {
        toDecline.map(async(ord)=> {
          const id = ord._id
        const refund = await axios.post("http://localhost:4000/refund", {id, amount})
        if(refund.data.success){
          const res = await axios.put('http://localhost:3000/api/orders/' + id, update)
          setOrdersList(ordersList.map((item) => {
            if (item._id === id){
              item.status = 0;
            } return item;
           }))
           socket.current.emit("respond", {id, res: false, note});
        }
        })     
      } catch (error) {
        console.log(error);
      }
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
if(confirm("Are your sure you want to delete these order?"))
    {
try {
await axios.delete('http://localhost:3000/api/orders', filter);
setOrdersList(ordersList.filter((item) => item.status !== orderSection));
setShow(false);
} catch (error) {
console.log(error);
};
};
};

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
        <h1 className={styles.hdr} style={{margin: sectionShow.some((s)=> s === 1) ? null : "0 0 2.5rem"}}>Orders</h1>
         {orderSections.map((orderSection) =>
       <div className={styles.sections_container} key={orderSection}>
          <div className={styles.title_container}>
          <h1 className={styles.title_hdr} onClick={()=>handleSectionShow(orderSection)}>{
            orderSection === 0 ? "Declined " :
            orderSection === 1 ? "New " :
            orderSection === 2 ? "Active " :
            orderSection === 3 ? "Completed " :
            orderSection === 4 ? "History" :
            null} 
            {orderSection === 4 ? null : "Orders"}</h1>
            {orderSection === 0 &&  <button className={styles.btn_clear} onClick={()=>handleDeleteAll(orderSection)}>Delete</button>}
            {orderSection === 1 && <div className={styles.btn_all_container}>
              <button className={styles.btn_accept_all} onClick={handleAcceptAll}>Accept</button>
              <button className={styles.btn_decline_all} onClick={handleDeclineAll}>Decline</button>
            </div>}
            {orderSection === 2 &&   <button className={styles.btn_clear} onClick={handleCompleteAll}>complete</button>}
            {orderSection === 3 && <button className={styles.btn_clear} onClick={handleSendPastAll}>History</button>}
            {orderSection === 4 &&  <button className={styles.btn_clear} onClick={()=>handleDeleteAll(orderSection)}>Delete</button>}
            </div>
            {sectionShow.some((sect) => sect === orderSection) ? <table className={styles.table}>
            <tbody>
              <tr className={styles.tr_title}>
                <th>ID</th>
                <th>Cr/Up</th>
                <th>order</th>
                <th>Total</th>
                <th>Co/De</th>
                <th>Action</th>
              </tr>
            </tbody>
            {ordersList?.filter((order) => order.status === orderSection)
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
         <Show setShow={setShow} >
           <Item 
           order={newOrder} 
           setNewOrder={setNewOrder} 
           handleAccept={handleAccept} 
           handleDelete={handleDelete} 
           handleDecline={handleDecline} 
           handleComplete={handleComplete}
           handleSendPast={handleSendPast}
           setNote={setNote}
           handleRefund={handleRefund}
           /> 
         </Show>

       : null}
    </div>
  )
}

export default CurrentOrders

