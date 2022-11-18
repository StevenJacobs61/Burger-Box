import styles from '../../styles/product.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { addQuantity } from '../../redux/cartSlice';
import { setOffline, nowOpen } from '../../redux/userSlice';
import { useSelector } from 'react-redux';
import {MdOutlineFastfood} from "react-icons/md"
import {MdChildCare} from "react-icons/md"
import {GiKetchup} from "react-icons/gi"
import {GiCakeSlice} from "react-icons/gi"
import {GiHotMeal} from "react-icons/gi"
import SelectBtn from '../../components/buttons/selectBtn';

const Product = ({products, product, settingsList, sectionsList}) => {
const settings = settingsList[0]
const [open, setOpen] = useState(true)

useEffect(() => {
  const sectionClosed = sectionsList.filter((section) => !section.available);
    const isOpen = sectionClosed.length < sectionsList.length;
    dispatch(nowOpen(isOpen));
    setOpen(isOpen)


}, [sectionsList]);

  // initial data sorting
const friesArray = products.filter((product) => product.title === "Fries")
const extras = products.filter((product) => product.extraSection !== null)
const toppingsArray = extras.filter((extra) => extra.extraSection.some((es =[]) => es === product.section))
const upgradesArray = products.filter((product) => product.upgrade === true)
   
const [price, setPrice] = useState(product.price)
const [fries, setFries] = useState(false)
const [friesOption, setOption] = useState(friesArray[0])
const [extraToppings, setExtraToppings] = useState(toppingsArray)
const [extraOptions, setExtraOptions] = useState([])
const [upgrades, setUpgrades] = useState(upgradesArray)
const [extraUpgrades, setExtraUpgrades] =useState ([])
const [quantity, setQuantity] = useState(1)
const[note, setNote] = useState();

// redux and router
const router = useRouter();
const dispatch = useDispatch();
const cart = useSelector((state) => state.cart)

// Resize detenction to show element on 1024px+ display
const [width, setWidth] = useState();
useEffect(() => {
  setWidth(window.innerWidth)
  dispatch(setOffline(settings.offline))
}, [])

useEffect(() => {
  window.addEventListener("resize", () =>setWidth(window.innerWidth));
})


const changePrice = (number) => {
  setPrice(price + number);
};

const handleFries = () =>{
  if (fries !== true){
    changePrice(friesOption.price)
  } else {
    changePrice(-friesOption.price)
  }
  setFries(!fries);
}


const handleUpgrades = (upgrade) => {
const incl = extraUpgrades.some((up)=> up._id === upgrade._id)
  if(!incl){
    changePrice(upgrade.price),
    setExtraUpgrades((prev) => [...prev, upgrade])
  } else{
    changePrice(-upgrade.price)
    setExtraUpgrades(extraUpgrades.filter((up) => up._id !== upgrade._id));
  }
}

const handleToppings = (extra) => {
  const incl = extraOptions.some((ex)=> ex._id === extra._id)
  if(!incl){
    changePrice(extra.price)
    setExtraOptions((prev) => [...prev, extra])
  } else{
    changePrice(-extra.price),
    setExtraOptions(extraOptions.filter((ex) => ex._id !== extra._id));
  }
}

const handleOrder = () => {
   if(localStorage.getItem("Orders") === null){
    localStorage.setItem("Orders", "[]");
   }
  const oldData = JSON.parse(localStorage.getItem("Orders"))
  oldData.push({product, fries, extraOptions, extraUpgrades, totalPrice, quantity, id, note})
  dispatch(addQuantity());
  window.localStorage.setItem('Orders', JSON.stringify(oldData));  
  router.push("/")
}

const priceQuantity =  quantity >= 1 ?  price * quantity : price;
const id = Math.floor(Math.random() * 1000000);
const totalPrice = Math.round(priceQuantity * 100)/100;

return (
  <div className={styles.container}>
    <div className={styles.left}>
      {product.section.toLowerCase() === "burgers" ?
              <div className={styles.img_container}><MdOutlineFastfood className={styles.icon} className={styles.icon} />
              </div> :
              section.title.toLowerCase() === "kids box meals" ?
              <div className={styles.img_container}><MdChildCare className={styles.icon} />
              </div> :
                section.title.toLowerCase() === "dips" ?
              <div className={styles.img_container}><GiKetchup className={styles.icon} />
              </div> :
              section.title.toLowerCase() === "dessert" ?
              <div className={styles.img_container}><GiCakeSlice className={styles.icon} />
              </div> :
              section.title.toLowerCase() === "drinks" ?
              <div className={styles.img_container}><MdOutlineLocalDrink className={styles.icon} />
              </div> :
              <div className={styles.img_container}><GiHotMeal className={styles.icon} />
              </div> 
              }

       <h1 className={styles.title}>{product.title}</h1>
       {settings.offline || !open ? <h2 className={styles.offline} onClick={()=> router.push("/")}>{open ? "Offline" : "closed"}</h2> :<span className={styles.price}>Total £{totalPrice < 0 ? 0 : totalPrice}</span>}
       <p className={styles.desc}>"{product.desc}"</p>
    </div>
    
       <div className={styles.right}>
        {width >= 1024 ?<h1 className={styles.hdr}>Sections options</h1> : null}
        <div className={styles.options_wrapper}>
          { product.section === "Burgers" ? <div className={styles.topping_container}>
                <h3 className={styles.topping} >Add Fries</h3>
              <div className={styles.price_wrapper}>
                  <input className={styles.toppingCheckbox} type="checkbox" onClick={handleFries}/>
                  <p key={friesOption._id}className={styles.toppingPrice}>£{friesOption.price}</p>
              </div>
          </div> : null}
            
            { extraToppings.length >= 1 ?
            <div className={styles.extraToppings}>
              <h3 className={styles.extaToppingsHeader}>Extra Toppings</h3>
              {extraToppings.map((extra) => extra.available === true ?
                <div key={extra._id}className={styles.topping_container}>
          <h3 className={styles.topping}>{extra.title}</h3>
            <div className={styles.price_wrapper}> 
          <input className={styles.toppingCheckbox} type="checkbox"  onClick={()=>handleToppings(extra)}/>
              {extra.price > 0 ? <p className={styles.toppingPrice}>£{extra.price}</p> 
              : <p className={styles.toppingPrice}>Free!</p> }
            </div>
          </div>
          : null
          )}
            </div> : null}
            { upgrades.length >= 1 ?
            <div className={styles.extraToppings}>
              <h3 className={styles.extaToppingsHeader}>Upgrades</h3>
              {upgrades.map((upgrade) => upgrade.available ? <div key={upgrade._id}className={styles.topping_container}>
          <h3 className={styles.topping}>{upgrade.title}</h3>
            <div className={styles.price_wrapper}> 
          <input className={styles.toppingCheckbox} type="checkbox"  onClick={()=> handleUpgrades(upgrade)}/>
              {product.price > 0 ? <p className={styles.toppingPrice}>£{upgrade.price}</p> 
              : <p className={styles.toppingPrice}>Free!</p> }
            </div>
          </div>: null)}
            </div>: null}
            <div className={styles.quantity_container}>
              <h3 className={styles.extaToppingsHeader}>Quantity</h3>
            <input className={styles.quantity} type="number" placeholder='1' id='amount' name='amount' 
            onChange={(e) => setQuantity(e.target.value)}
            defaultValue='1' min='1' step='1'/>
            </div>
            <div className={styles.note_container}>
           <h3 className={styles.info_hdr} >Special Instructions:</h3>
           <p className={styles.info_text}>* Detail any special diet requirements and order notes here</p>
           <p className={styles.info_text}>Max 75 characters</p>
          <textarea className={styles.info_input} placeholder="Write information here..."
          maxLength="75" 
          onChange={(e) => setNote(e.target.value)}/>
            </div>
            </div>
            <div className={styles.container_order}>
             
            {settings.offline || !open ? <p onClick={()=> router.push("/")} className={styles.offline}>{open ? "Offline" : "closed"}</p> :
            <div className={styles.add_container}><h3 className={styles.finalPrice}>Total £{totalPrice}</h3>
            <SelectBtn innerTxt={"select"} btnFucntion={handleOrder} btnStyle={"L"}/>
              </div>}
            </div>
        </div>
  </div>
  )
}

export const getServerSideProps = async ({params}) => {
    const productsRes = await axios.get('http://localhost:3000/api/products');
    const productRes = await axios.get(`http://localhost:3000/api/products/${params.id}`);
    const settingsRes = await axios.get(`http://localhost:3000/api/settings`);
    const sectionsRes = await axios.get(`http://localhost:3000/api/sections`);
    
    
    return {
      props:{
        products: productsRes.data,
        product: productRes.data,
        settingsList: settingsRes.data,
        sectionsList: sectionsRes.data
      }
    }
  }
export default Product




