import React from 'react'
import styles from '../../styles/list-item.module.css'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'
import Item from './item'

const ListItem = ({order, 
  handleComplete, handleAccept, handleDecline,
showItem, handleDelete, handleSendPast}) => {

const [status, setStatus] = useState(order.status);
  return (
    <>
        <tbody>
          <tr className={styles.tr_title} >
            <td onClick={() => showItem(order)} className={styles.title_item}>..{order._id.slice(21, 24)}</td>
            <td onClick={() => showItem(order)} className={styles.title_item}>{order.createdAt.slice(11, 16)}<br/>{order.updatedAt.slice(11, 16)}</td>
            <td>
             <ul className={styles.title_list}onClick={() => showItem(order)}>
               {order.orders.map((order) => 
              <div key={order.id}>
                <li className={styles.title_item}>{order.product.title}</li>
              {order.extraOptions.map((extra) => 
              <li key={Math.random(1000)} className={styles.extra}>{extra.title}</li>)}
              {order.extraUpgrades.map((upgrade) => 
              <li key={Math.random(1000)} className={styles.upgrade}>{upgrade.title}</li>)} 
               </div>)}
             </ul>
            </td>
            <td onClick={() => showItem(order)} className={styles.title_item}>£{order.total}</td>
            <td onClick={() => showItem(order)} className={styles.title_item}>{order.delivery ? 'D' : 'C'}</td>
            <td>
            {status === 0 ? 
            <button 
            className={styles.btn_del} 
            onClick={() => handleDelete(order._id)}>
             Delete
            </button>
            : status === 1 ? 
            <div className={styles.btn_container}>
              <button 
              className={styles.btn_accept} 
              onClick={() => handleAccept(order._id)}>
               Accept
              </button>
              <button 
              className={styles.btn_del} 
              onClick={() => handleDecline(order._id)}>
               Decline
              </button>
            </div>
            : status === 2 ?
            <button 
            className={styles.btn_complete} 
            onClick={() => handleComplete(order._id)}>
              complete
            </button>
            : status === 3 ?
            <button 
            className={styles.btn_complete} 
            onClick={() => handleSendPast(order._id)}>
             Send past
            </button>
            : status === 4 ?
            <button 
            className={styles.btn_del} 
            onClick={() => handleDelete(order._id)}>
             Delete
            </button>
            : status === 5 ?
            <p >Waiting for payment</p> 
          :null}
          </td>
          </tr>
        </tbody>
      </>
  )
}

export default ListItem