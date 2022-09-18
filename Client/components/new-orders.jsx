import React from 'react'
import styles from '../styles/new-orders.module.css'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import NewItem from './admin/new-item'



const NewOrders = ({orders}) => {
    const [show, setShow] = useState(true)
    const ordersStatusOne = orders.filter(order => order.status === 1);

    const router = useRouter()



 const handleAcceptAll = async () => {
      const filter = {
        status: 1
      }
      const update = {
        status: 2
      }
    try{
       const res = await axios.patch('http://localhost:3000/api/orders', {filter, update})
        router.push('/')
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
    router.push('/')
}catch(err){
    console.log(err);
}

}

 
  return (
    <div className={styles.container}>
        <div className={styles.title_container}>
          <h1 className={styles.hdr} onClick={() => setShow(!show)}>New Orders</h1>
          <div className={styles.btn_all_container}>
            <button className={styles.btn_accept_all} onClick={handleAcceptAll}>Accept all</button>
            <button className={styles.btn_decline_all} onClick={handleDeclineAll}>Decline all</button>
          </div>
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
   {ordersStatusOne.map((order) => 
         <NewItem order={order} key={order._id}/>
         ) }
     </table>}

                   
    </div>
  )
}

export default NewOrders