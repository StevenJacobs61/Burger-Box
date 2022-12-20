import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import styles from '../../styles/navbar.module.css'
import {AiOutlineInstagram} from 'react-icons/ai';
import {FiFacebook} from 'react-icons/fi';
import {HiChevronDoubleDown} from 'react-icons/hi';
import {BsBasket} from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const Navbar = () => {
  const cart = useSelector((state) => state.cart)
  const user = useSelector((state) => state.user)
  
  const [click, setClick] = useState(true);
  const[mobileScreen, setMobileScreen] = useState(true);
  const [quantity, setQuantity] = useState(0)
  const [login, setLogin] = useState(false);
  const router = useRouter();
  
  
useEffect(() => {
  if(localStorage.getItem("Orders") === null){
    localStorage.setItem("Orders", "[]");
   }
  const localQuantity = JSON.parse(localStorage.getItem("Orders"))
  setQuantity(localQuantity.length)
}, [cart]);


const sizeDetector = () => {
 if(window.innerWidth > 768){
  setMobileScreen(false)
 } else {
  setMobileScreen(true)
 }
}

// Hide navbar on scroll down 
useEffect(() => {
  sizeDetector()
  window.addEventListener('resize', sizeDetector)
}, [])

// Remove basket icon on login page

useEffect(() => {
  if(window.location.pathname.slice(-5,) == "login"){
    setLogin(true)
  }else{
    setLogin(false)
  }
 
}, [router.query])




const [showNav, setShowNav] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);


useEffect(() => {

  const controlNavbar = () => {
    if (typeof window !== 'undefined') { 
      if (window.scrollY > lastScrollY) { 
        setShowNav(false); 
      } else {
        setShowNav(true); 
      }
  
      setLastScrollY(window.scrollY); 
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }
}, [lastScrollY]);

  return (
  <>{!user.admin ? 
  <>
     <div className={styles.navbar} style={{top: showNav ? '0' : '-110%'}}>
       
        <div className={styles.container}>
            <div className={styles.chevron_container}>
              <HiChevronDoubleDown className={styles.chevron} onClick={() => setClick(!click)} style={{transform: click ?"rotate(0)":"rotate(180deg)"}}/>
            </div>
            { click && mobileScreen ? null :<div className={styles.pagelinks} style={{display: click && mobileScreen ?"none":"flex"}}>
              <div className={styles.pagelink} onClick={() => {setClick(!click), router.push("/")}}>Order</div>
              <div className={styles.pagelink} onClick={() => {setClick(!click), router.push("/cart")}}>Basket</div>
              <div className={styles.pagelink} onClick={() => {setClick(!click), router.push("/admin")}}>Admin</div>
          </div>}
              <div className={styles.logo_container} onClick={()=>router.push("/")}>
                <div className={styles.logo}>
                  <Image  className={styles.img} src={'/img/bb-logo.webp'} alt='logo' layout='fill'/>
                  </div>
              </div>
          { click && mobileScreen ? null :<div className={styles.contact}>
            <div className={styles.socials}>
                <a target="_blank">
                  <div className={styles.social} onClick={() => {setClick(!click), router.push('https://www.facebook.com/BurgerBoxSeaford')}}> <FiFacebook className={styles.facebook}/> </div>
                </a>
              <a target="_blank">
                  <div className={styles.social} onClick={() => {setClick(!click), router.push('https://www.instagram.com/burgerboxseaford/')}}> <AiOutlineInstagram className={styles.insta}/> </div>
              </a>
            </div>
            <div className={styles.texts}>
              <div className={styles.text}>Contact Us</div>
              <div className={styles.text}>01323 899221</div>
            </div>
          </div>}
       
        </div>
       </div>
    {!login && !user.offline && user.open ? <div className={styles.basket} style={{top: !showNav ? "5%" : "10%"}}>
          <p className={styles.quantity}>{quantity}</p>
          <BsBasket className={styles.basket_icon} onClick={() => router.push("/cart")}/>
              </div>:null}
     </> : null}
     </>
  )
}

export default Navbar