 import Image from 'next/image'
import styles from '../../styles/product.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { addQuantity } from '../../redux/cartSlice';
import { useSelector } from 'react-redux';
import { normalizeRepeatedSlashes } from 'next/dist/shared/lib/utils';

const Product = ({products, product}) => {

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


const handleUpgrades = (e, upgrade) => {
  const checked = e.target.checked;
  if(checked){
    changePrice(upgrade.price),
    setExtraUpgrades((prev) => [...prev, upgrade])
  } else{
    changePrice(-upgrade.price)
    setExtraUpgrades(extraUpgrades.filter((up) => up._id !== upgrade._id));
  }
}

const handleToppings = (e, extra) => {
  const checked = e.target.checked;
  if(checked){
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
}

const priceQuantity =  quantity >= 1 ?  price * quantity : price;
const id = Math.floor(Math.random() * 1000000);
const totalPrice = Math.round(priceQuantity * 100)/100;

return (
  <div className={styles.container}>
    <div className={styles.left}>
       <div className={styles.img_container}>
           <Image src={'/img/burger.webp'} layout='fill'/>
       </div>

    </div>
    <div className={styles.right}>
       <h1 className={styles.title}>{product.title}</h1>
       <span className={styles.price}>£ {totalPrice < 0 ? 0 : totalPrice}</span>
       <p className={styles.desc}>{product.desc}</p>
    </div>
        { product.section === "Burgers" ? <div className={styles.topping_container}>
            <h3 className={styles.topping} >Add Fries</h3>
              <input className={styles.toppingCheckbox} type="checkbox" onClick={handleFries}/>
              <p key={friesOption._id}className={styles.toppingPrice}>£ {friesOption.price}</p>
        </div> : null}
  
  { extraToppings.length >= 1 ?
  <div className={styles.extraToppings}>
    
    <h3 className={styles.extaToppingsHeader}>Extra Toppings?</h3>
    {extraToppings.map((extra) => extra.available === true ?
<div key={extra._id}className={styles.topping_container}>
<h3 className={styles.topping}>{extra.title}</h3>
  <input className={styles.toppingCheckbox} type="checkbox" onChange={(e) => handleToppings(e, extra)}/>
{ extra.price > 0 ? <p className={styles.toppingPrice}>£ {extra.price}</p> 
: <p className={styles.toppingPrice}>Free!</p> }
</div>
: null
)}
  </div> : null}
  { upgrades.length >= 1 ?
  <div className={styles.extraToppings}>
    <h3 className={styles.extaToppingsHeader}>Upgrades?</h3>
    {upgrades.map((upgrade) => 
<div key={upgrade._id}className={styles.topping_container}>
<h3 className={styles.topping}>{upgrade.title}</h3>
  <input className={styles.toppingCheckbox} type="checkbox" onChange={(e) => handleUpgrades(e, upgrade)}/>
<p className={styles.toppingPrice}>£ {upgrade.price}</p>
</div>)}
  </div>: null}
  <div className={styles.extraToppings}>
    <h3 className={styles.extaToppingsHeader}>Quantity</h3>
    <div className={styles.topping_container}>
<h3 className={styles.topping}>How many?</h3>
  <input className={styles.quantity} type="number" placeholder='1' id='amount' name='amount' 
  onChange={(e) => setQuantity(e.target.value)}
  defaultValue='1' min='1' step='1'/>

  </div>
  </div>
  <div className={styles.note_container}>
 <h3 className={styles.info_hdr} >Special Instructions:</h3>
 <p className={styles.info_text}>* Detail any special diet requirements and order notes here</p>
 <p className={styles.info_text}>Max 75 characters</p>
<textarea className={styles.info_input} placeholder="Write information here..."
maxLength="75" 
onChange={(e) => setNote(e.target.value)}/>
  </div>
  <div className={styles.orderNow}>
    <h3 className={styles.finalPrice}>Total: <br/>£ {totalPrice}</h3>
   <Link href={'/'}><button className={styles.orderBtn} onClick={handleOrder}>Order Now</button></Link>
  </div>
    </div>
  )
}

export const getServerSideProps = async ({params}) => {
    const productsRes = await axios.get('http://localhost:3000/api/products');
    const productRes = await axios.get(`http://localhost:3000/api/products/${params.id}`);
    
    
    return {
      props:{
        products: productsRes.data,
        product: productRes.data
      }
    }
  }
export default Product




