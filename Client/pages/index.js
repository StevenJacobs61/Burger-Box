import Head from 'next/head'
import Hero from '../components/hero'
import Menu from '../components/menu'
import axios from 'axios'
import styles from '../styles/Home.module.css'
import AdminNav from '../components/admin/admin-nav'
import CurrentOrders from '../components/admin/current-orders'
import { useDispatch } from 'react-redux'
import { setAdmin, setOffline} from '../redux/userSlice'
import { useEffect } from 'react'
import dbConnect from '../utils/mongodb'
import sections from '../models/sections'


export default function Home({ sections, itemsList, admin, orders, settings }) {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(setAdmin(admin))
    dispatch(setOffline(settings[0].offline))
  }, [dispatch, admin, settings])

  const sectionsList = sections.filter((section) => section.title !== "Extra Toppings")

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
      <CurrentOrders orders={orders}/>
      </> :
      <>
    <Hero settings={settings[0]}/> 
   <Menu sectionsList={sectionsList} settings={settings[0]} itemsList={itemsList} admin={admin}/>
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
  // const sectionsRes = await axios.get(`${dev ? process.env.DEV_URL : process.env.PROD_URL}/api/sections`);
  const itemsRes = await axios.get(`${dev ? process.env.DEV_URL : process.env.PROD_URL}/api/products`);
  const res = await axios.get(`${dev ? process.env.DEV_URL : process.env.PROD_URL}/api/orders`);
  const settingsRes = await axios.get(`${dev ? process.env.DEV_URL : process.env.PROD_URL}/api/settings`);
  return {
    props:{
      sections:sectionsRes.data,
      itemsList: itemsRes.data,
      orders: res.data,
      settings: settingsRes.data,
      admin
    }
  }
}