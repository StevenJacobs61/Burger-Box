import React from 'react'
import styles from '../../styles/admin-nav.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import  {MdOutlineNotificationsOff} from 'react-icons/md'
import  {MdOutlineNotificationsNone} from 'react-icons/md'
import { useDispatch } from 'react-redux';
import { changeNotif } from '../../redux/cartSlice';
import { useSelector } from 'react-redux';


const AdminNav = () => {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)
  const router =useRouter();
  const [route, setRoute] = useState(router.pathname);

  const [notifications, setNotifications] = useState(cart.notifications);

  useEffect(() => {
    if (window.localStorage.getItem("Notifications") === null){
      window.localStorage.setItem("Notifications", "false");
    }
    const local = JSON.parse(localStorage.getItem("Notifications"));
    setNotifications(local)
    dispatch(changeNotif(local))
  }, [])

  const handleMute = () => {
    try{
      window.localStorage.setItem("Notifications", JSON.stringify(!notifications))
      dispatch(changeNotif(!notifications))
    setNotifications(!notifications)
    router.reload()
  } catch(err) {
    console.log(error);
  }
}

  return (
    <div className={styles.container}>
        {route === "/admin" ?
          <Link href={'/'}><button className={styles.btn}>Current orders</button></Link>
          :
          <Link href={'/admin'}><button className={styles.btn}>Admin</button></Link>
        }
        {!notifications ?
        <div className={styles.icon_container}>
        <MdOutlineNotificationsOff 
        className={styles.icon} 
        onClick={() => handleMute()}/>
        </div> :
        <div className={styles.icon_container}>
          <MdOutlineNotificationsNone 
          onClick={() => handleMute()} 
          className={styles.icon}/>
          </div>
        
        }
    </div>
  )
}

export default AdminNav