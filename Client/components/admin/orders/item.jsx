import React from 'react'
import styles from '../../../styles/item.module.css'
import { useState } from 'react';

const Item = ({order, 
  handleAccept, handleDecline, handleDelete, 
  handleSendPast, handleComplete, setNote, handleRefund}) => {

  const [status, setStatus] = useState(order.status)

  const  [refundAm, setRefundAm] = useState(0)
  return (
    <>
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
        <div className={styles.item}><p className={styles.title}>ID: </p><p className={styles.info}>...{order._id.slice(15, 24)}</p></div>
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

        <div className={styles.total}>
         <p className={styles.title}>Total:</p>
         <p className={styles.info}>£{order.total}</p>
        </div>
        {status === 2 || status === 3 || status === 4 || status === 0 ?
        <div className={styles.refunded_container}>
          <p className={styles.refunded_title}>Refunded:</p>
           <p className={styles.refunded}>{status === 0 ? `£${order.total}` : order.refunded === 0 ? "No" : `£${order.refunded}`}</p>
        </div> : null}
        {status === 1 ?<textarea className={styles.textarea} maxLength="150" 
        placeholder="Write note here.."
        onChange={(e) => setNote(e.target.value)}
        />
        :null}
        <div className={styles.btn_container}>
          {/* Decline */}
        {status === 0 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => (handleDelete(order._id))}>
             Delete
            </button>
            // Waiting for restaunt to accept
          :status === 1 ? 
            <>
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
            </>
            // Active order
            :status === 2 ?
            <button 
            className={styles.btn_complete} 
            onClick={() => handleComplete(order._id)}>
              complete
            </button>
            // Completed order
            :status === 3 ? 
            <button 
            className={styles.btn_complete} 
            onClick={() => handleSendPast(order._id)}>
             History
            </button>
            // Past order(4)/not paid(5)
            :status === 4  || status === 5 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => handleDelete(order._id)}>
             Delete
            </button>
            : null}
            </div>
    </div>
    {status === 2 || status === 3 || status === 4 ?
      <div className={styles.refund_wrapper}>
        <h3 className={styles.refund_hdr}>Refund</h3>
        <p className={styles.refund_warning_text}>If you don&apos;t enter an amount, the enitre order will be refunded</p>
        <h4 className={styles.refund_text}>Amount to refund</h4>
        <input className={styles.refund_input} onChange={(e) => setRefundAm(e.target.value)} type="number" defaultValue={0}/>
        <button className={styles.btn_refund} 
        onClick={()=> handleRefund(order, refundAm)} 
        >Refund</button>
    </div> 
    : null}
   </>
  )
}

export default Item