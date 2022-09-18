import React from 'react'
import styles from '../../styles/item.module.css'
import {AiOutlineClose} from 'react-icons/ai';
import { useState } from 'react';
import { Refund } from '../stripe';

const Item = ({setShow, setShowItem, order, 
  handleAccept, handleDecline, handleDelete, 
  handleSendPast, handleComplete, setNote}) => {
  const [status, setStatus] = useState(order.status)
  return (
    <div className={styles.container}>
    <div className={styles.wrapper}>
    <AiOutlineClose className={styles.close} onClick={() => (setShow && setShow(false), setShowItem && setShowItem(false))}>Close</AiOutlineClose>
            <h1 className={styles.hdr}>
                {order.status === 0 ? 'Declined Order' 
                : order.status === 1 ? 'New Order' 
                : order.status === 2 ? 'Active/Paid Order' 
                : order.status === 3 ? 'Completed Order' 
                : order.status === 4 ? 'Past Order'
                : "Waiting for payment"
                }
            </h1>
    <div className={styles.details}>
        <div className={styles.item}><p className={styles.title}>ID: </p><p className={styles.info}>{order._id}</p></div>
        <div className={styles.item}><p className={styles.title}>Method: </p><p className={styles.info}>{order.delivery ? 'Delivery' : 'Collection'}</p></div>
        <div className={styles.item}><p className={styles.title}>Ordered: </p><p className={styles.info}>{order.createdAt.slice(0, 10)}  {order.createdAt.slice(11, 19)}</p></div>
       {order.updatedAt !== order.createdAt && <div className={styles.item}><p className={styles.title}>Updated: </p><p className={styles.info}>{order.updatedAt.slice(0, 10)}  {order.updatedAt.slice(11, 19)}</p></div>}
        <div className={styles.item}> <p className={styles.title}>Name: </p><p className={styles.info}>{order.details.name}</p></div>
       {order.delivery ? 
       <div className={styles.item}> 
       <p className={styles.title}>Address: </p>
       <p className={styles.info}>{order.details.address.street} <br /> 
       {order.details.address.postcode}</p>
       </div> : null}
       {order.delivery && order.details.address.instructions ?  
        <div className={styles.item}>
            <h3 className={styles.title}>Instructions:</h3>    
            <p className={styles.info}>{order.details.address.instructions}</p>
        </div>: null}
       <div className={styles.item}> <p className={styles.title}>Order: </p>
       <div>
           {order.orders.map((order) =>
               <div key={Math.random(1000)} className={styles.order_container}>
                   <p className={styles.info}>{order.product.title}</p>
                   <p className={styles.quantity}>X {order.quantity}</p>
                   <p className={styles.fries}>{order.fries && 'With Fries'}</p>
                   {order.extraOptions.map((option) =>
                   <p key={Math.random(1000)}className={styles.option}>
                    {option.title}
                   </p>
                   )}
                   {order.extraUpgrades.map((upgrade) =>
                   <p key={Math.random(1000)} className={styles.upgrade} >
                    {upgrade.title}
                   </p>
                   )}
                   {order.note?.length >=1 ? 
                    <div className={styles.item}>
                      <p className={styles.title}>Note:</p>
                   <p className={styles.info}>
                    {order.note}
                   </p>
                   </div> : null}
               </div>
           )}
       </div>
       </div>

        <div className={styles.total}> <p className={styles.title}>Total: </p><p className={styles.info}>£ {order.total}</p></div>
        {status === 1 ?<textarea className={styles.textarea} maxLength="150" 
        placeholder="Write note here.."
        onChange={(e) => setNote(e.target.value)}
        />
        :null}
        {status === 0 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => (handleDelete(order._id))}>
             Delete
            </button>
          :status === 1 ? 
            <div className={styles.btn_container}>
              <button 
              className={styles.btn_accept} 
              onClick={() => (handleAccept(order._id))}>
               Accept
              </button>
              <button 
              className={styles.btn_del} 
              onClick={() => handleDecline(order._id)}>
               Decline
              </button>
            </div> 
            :status === 2 ?
            <><button 
            className={styles.btn_complete} 
            onClick={() => handleComplete(order._id)}>
              complete
            </button>
            <button className={styles.btn_complete} 
            onClick={() => Refund(order._id)}>Refund</button>
            </>
            :status === 3 ? 
            <button 
            className={styles.btn_complete} 
            onClick={() => handleSendPast(order._id)}>
             Send past
            </button>
            :status === 4  || status === 5 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => handleDelete(order._id)}>
             Delete
            </button>
            : null}
    </div>
    </div>
    </div>
  )
}

export default Item