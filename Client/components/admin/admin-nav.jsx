import React from 'react'
import styles from '../../styles/admin-nav.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import  {MdOutlineNotificationsOff} from 'react-icons/md'
import  {MdOutlineNotificationsNone} from 'react-icons/md'
import  {MdOutlineNextPlan} from 'react-icons/md'
import  {HiOutlineLogout} from 'react-icons/hi'
import { useDispatch } from 'react-redux';
import { changeNotif } from '../../redux/cartSlice';
import { useSelector } from 'react-redux';
import { setAdmin } from '../../redux/userSlice'
import axios from 'axios'


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
  }, [dispatch])

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

const handleLogout = async () => {
  if(confirm("Are you sure you wish to logout?")){
    await axios.delete("/api/login/cookie");
    router.push("/");
    router.reload();
    dispatch(setAdmin(false));
  }else{
    alert("There was an error logging out, try deleting your BurgerBox browser cookie if the issue persists.")
  }
}

  return (
    <div className={styles.container}>
          <MdOutlineNextPlan className={styles.icon}
          onClick={() => {
            if (route === "/admin") router.push("/");
            else router.push("/admin")
          }}/>
          <HiOutlineLogout className={styles.icon}
          onClick={()=> handleLogout()}/>
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