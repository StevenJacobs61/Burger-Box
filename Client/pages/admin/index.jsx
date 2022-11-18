import axios from 'axios'
import styles from '../../styles/admin.module.css'
import AdminNav from '../../components/admin/admin-nav'
import ManageProducts from '../../components/admin/manage-products'
import Item from '../../components/admin/item'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux'
import Settings from '../../components/admin/manage/settings'
import { setAdmin } from '../../redux/userSlice'


const Admin = ({productsList, adminsList, sectionsList, settingsList, admin}) => {
  const dispatch = useDispatch() 

  useEffect(()=>{
    dispatch(setAdmin(admin))
  }, )

  // Get notifiations status from redux

  const cart = useSelector((state) => state.cart);
const [notifications, setNotifications] = useState(cart.notifications);


// Show sections on click
  const[showProducts, setShowProducts] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false)
  const [showSettings, setShowSettings] = useState(false)


// Websocket receive order notifications

const [socket, setSocket] = useState()
const [newOrder, setNewOrder] = useState()
const [showItem, setShowItem] = useState(false)


  useEffect(() => {
    setSocket(io("ws://localhost:7500"));
  }, []);

  useEffect(() => {
    socket?.on("getNewOrder", (data) => {
      if(notifications){
      setNewOrder(data);
      setShowItem(true)};
    });
  }, [socket, notifications]);
  
  // Functions for managing pop up notificiations

  const [note, setNote] = useState();

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

    // Change meneu width style on expand

    const [width, setWidth] = useState();
    const handleWidth = () => {
      const w = window.innerWidth;
      if(w >=1024 && !showProducts || !showSettings) {
        setShowProducts(true)
        setShowSettings(true)
      }
      setWidth(w)
    }

    useEffect(() => {
      if(window.innerWidth >=1024) {
        setShowProducts(true)
        setShowSettings(true)
      }
      handleWidth()
      window.addEventListener("resize", handleWidth)
    }, )

  return (
    <div className={styles.container}>
      <AdminNav />
      <div className={styles.add_container}></div>
      <div className={styles.container}>
        <h1 className={styles.page_hdr}>
        Admin
        </h1>
      <div className={styles.items_container} style={{margin: showProducts ? null : "2rem 0"}}>
        <div className={styles.item} style={{width: showProducts && width < 1024 ? "90%" : null}}>
        <h1 className={styles.hdr}
        onClick={() => {if (window.innerWidth>=1024){null} else {setShowProducts(!showProducts)}}}>Menu</h1>
             {showProducts ?  <ManageProducts
         productsList={productsList}
         sectionsList={sectionsList}
         /> : null}
            </div>
          <div className={styles.item} style={{width: showSettings && width < 1024 ? "90%": null}}>
          <h1 className={styles.hdr}
          onClick={() => {if (window.innerWidth>=1024){null} else {setShowSettings(!showSettings)}}}>Settings</h1>
           {showSettings ? <Settings
           settingsList={settingsList}
           adminsList={adminsList}/>
            : null}
          </div>
      </div> 
        {/* <div className={styles.item} style={{width: showAdmins && width < 1024 ? "90%" : null}}>
        <h1 className={styles.hdr} 
        onClick={() => setShowAdmins(!showAdmins)}>Admins</h1>
          {showAdmins ? <Admins  
          admins={adminsList} 
          showAdmins={showAdmins}/>
       : null}      
        </div>  */}
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
    let admin = false
  
    if (myCookie.token !== process.env.TOKEN) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    } else{
      admin = true
    }
    
  const prodRes = await axios.get("http://localhost:3000/api/products");
    const listRes = await axios.get('http://localhost:3000/api/admin');
    const sectionsRes = await axios.get('http://localhost:3000/api/sections');
    const settingsRes = await axios.get('http://localhost:3000/api/settings');

    return {
      props:{
            productsList: prodRes.data,
            adminsList: listRes.data,
            sectionsList: sectionsRes.data,
            settingsList: settingsRes.data,
            admin
          }
      }
  } 
