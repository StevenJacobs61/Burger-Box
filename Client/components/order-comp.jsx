import React from 'react'
import styles from "../styles/order-comp.module.css"

const OrderComp = ({order, fries}) => {

  return (
    <div className={styles.container}>
        <h2 className={styles.orders_hdr}>Order Details</h2>
        <div className={styles.details_container}>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>ID:</h3>
                <p className={styles.text}>{order._id}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Ordered At:</h3>
                <p className={styles.text}>{order.createdAt.slice(0, 10)}<br/>{order.createdAt.slice(11, 16)}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Last Updated:</h3>
                <p className={styles.text}>{order.updatedAt.slice(0, 10)}<br/>{order.updatedAt.slice(11, 16)}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Name:</h3>
                <p className={styles.text}>{order.details.name}</p>
            </div>
            {order.delivery ?<> <div className={styles.order_container}>
                <h3 className={styles.hdr}>Address:</h3>
                <p className={styles.text}>{order.details.address.street}, {order.details.address.postcode}</p>
            </div>
            {order.delivery && order.details.address.instructions ?
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Instructions:</h3>
                <p className={styles.text}>{order.details.address.instructions}</p>
            </div>: null}</>
            : null}
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Contact Number:</h3>
                <p className={styles.text}>{order.details.number}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Email:</h3>
                <p className={styles.text}>{order.details.email}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Method:</h3>
                <p className={styles.text}>{order.delivery ? "Delivery" : "Collection"}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Waiting time:</h3>
                <p className={styles.text}>{order.time}mins</p>
            </div>
            <h2 className={styles.orders_subhdr}>Items</h2>
            {order.orders.map((ord) =>
            <div key={Math.random()} className={styles.orders_container}>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Title:</h3>
                <p className={styles.text}>{ord.product.title} x{ord.quantity} £{ord.quantity*ord.product.price}</p>
            </div>
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Fries:</h3>
                <p className={styles.text}>{ord.fries ? `Yes  £${fries.price}` : "No"}</p>
            </div>
                   { ord.extraOptions.length > 0 ? 
                   <div className={styles.order_container}>
               <h3 className={styles.hdr}>Extras:</h3>
              <div className={styles.extra_container}>
                {ord.extraOptions.map((extra) =>
             <p key={extra._id} className={styles.text}>
                {extra.title} £{extra.price}
             </p>)}
             </div>
                   </div>
                   : null}
            
                   { ord.extraUpgrades.length > 0 ? 
                   <div className={styles.order_container}>
               <h3 className={styles.hdr}>Upgrades:</h3>
               <div className={styles.extra_container}>
                   {ord.extraUpgrades.map((upgrade) =>
                    <p key={upgrade._id} className={styles.text}>
                    {upgrade.title} £{upgrade.price}
                           </p>)}
               </div>
                   </div>
                   : null}
                   {ord.note ?
            <div className={styles.order_container}>
                <h3 className={styles.hdr}>Notes:</h3>
                <p className={styles.text}>{ord.note.slice(0, 20)}...</p>
            </div> : null}
                   <h3 className={styles.subtotal}>Subtotal: £{ord.totalPrice}</h3>
                   </div>
            )}
            <h2 className={styles.total}>Total: £{order.total}</h2>
        </div>
    </div>
  )
}

export default OrderComp