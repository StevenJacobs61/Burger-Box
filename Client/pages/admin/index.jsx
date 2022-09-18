import axios from 'axios'
import Admins from '../../components/admin/admins'
import styles from '../../styles/admin.module.css'
import AdminNav from '../../components/admin/admin-nav'
import ManageProducts from '../../components/admin/manage-products'
import Item from '../../components/admin/item'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'

const Admin = ({productsList, adminsList, sectionsList}) => {

  const [showItem, setShowItem] = useState(false)
  const [socket, setSocket] = useState()
  const [newOrder, setNewOrder] = useState()
  const [note, setNote] = useState();
  const cart = useSelector((state) => state.cart);
  
  const [notifications, setNotifications] = useState(cart.notifications);



  useEffect(() => {
    setSocket(io("ws://localhost:7500"));
  }, []);

  useEffect(() => {
    socket?.on("getNewOrder", (data) => {
      if(notifications){
      setNewOrder(data);
      setShowItem(true)};
    });
  }, [socket]);
  
  const handleAccept = async (id) => {
    const newData = {
      status: 5
    }
    try{
      const res = await axios.put('http://localhost:3000/api/orders/' + id, newData);
      socket?.emit("respond", {id, res: true}, note);
      setShowItem(false);
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
        socket?.emit("respond", {id, res: false}, note);
      setShowItem(false)
      }catch(err){
         console.log(err);
     }}

     const handleComplete = async (id) => {
      const newData = {
        status: 3
      }
    try{
       const res = await axios.put('http://localhost:3000/api/orders/' + id, newData)
       setShowItem(false);
    }catch(err){
        console.log(err);
    }
    }

  return (
    <div className={styles.container}>
      <AdminNav />
      <div className={styles.add_container}></div>
      <div className={styles.container}>
      <div className={styles.item}>
       <ManageProducts productsList={productsList} sectionsList={sectionsList}/>
          </div>      
        <div className={styles.item}>
          <Admins  admins={adminsList} />
        </div>      
        {showItem ? <Item 
        handleDecline={handleDecline} 
        handleAccept={handleAccept}
        handleComplete={handleComplete}
        order={newOrder} 
        setShowItem={setShowItem} 
        status={newOrder.status}
        setNote={setNote}/> 
        : null}
      </div>
    </div>

  )
  
}
export default Admin

export const getServerSideProps = async (ctx) => {
    const myCookie = ctx.req?.cookies || "";
  
    if (myCookie.token !== process.env.TOKEN) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }
  const prodRes = await axios.get("http://localhost:3000/api/products");
    const listRes = await axios.get('http://localhost:3000/api/admin');
    const sectionsRes = await axios.get('http://localhost:3000/api/sections');

    return {
      props:{
            productsList: prodRes.data,
            adminsList: listRes.data,
            sectionsList: sectionsRes.data
          }

      }
  } 
