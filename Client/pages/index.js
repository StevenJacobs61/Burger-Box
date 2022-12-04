import Head from 'next/head'
import Menu from '../components/menu'
import styles from '../styles/Home.module.css'
import AdminNav from '../components/admin/admin-nav'
import CurrentOrders from '../components/admin/current-orders'
import { useDispatch } from 'react-redux'
import { setAdmin, setOffline} from '../redux/userSlice'
import { useEffect } from 'react'
import dbConnect from '../utils/mongodb'
import sections from '../models/sections'
import products from '../models/products'
import settings from '../models/settings'
import orders from '../models/orders'
import LandingPage from '../components/LandingPage/landing_page'




export default function Home({ sectionsProp, itemsList, admin, ordersList, settingsList }) {
  
  // Neccessary for hosting on Vercel
  const secs = JSON.parse(sectionsProp)
  const items = JSON.parse(itemsList)
  const ords = JSON.parse(ordersList)
  const sets = JSON.parse(settingsList)
  const sectionsList = secs.filter((section) => section.title !== "Extra Toppings")

  const dispatch = useDispatch()
  
  useEffect(()=>{
    dispatch(setAdmin(admin))
    dispatch(setOffline(sets[0].offline))
  }, [dispatch, admin, sets])

  return (
    <div className={styles.container}>

      <Head>
        <title>Burger Box Seaford</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/img/order-box.webp" />
      </Head>

      {admin ? 
      <>
      <AdminNav />
      <CurrentOrders orders={ords}/>
      </> :

      <>
      <LandingPage settings={sets[0]} sections={sectionsList}/>
    <Menu sectionsList={sectionsList} settings={sets[0]} itemsList={items} admin={admin}/>
    </>
    }

  </div> 
  )
}
export const getServerSideProps = async (ctx) => {

  const dev = process.env.MODE === "DEV" ? true : false;
  const myCookie = ctx.req?.cookies || "";
  let admin = false;
   if (myCookie.token === process.env.TOKEN){
    admin = true
   }

   await dbConnect()

   const sectionsRes = await sections.find(); 
   const sects = JSON.stringify(sectionsRes)

  const itemsRes = await products.find(); 
  const items = JSON.stringify(itemsRes)
  
  const orderRes = await orders.find();
  const ords = JSON.stringify(orderRes)
  
  const settingsRes = await settings.find()
  const setts = JSON.stringify(settingsRes)
  
  return {
    props:{
      sectionsProp:sects,
      itemsList: items,
      ordersList: ords,
      settingsList: setts,
      admin
    }
  }
}