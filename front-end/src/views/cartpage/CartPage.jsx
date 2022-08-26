import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import './cartPage.scss';

const CartPage = () => {
  const { cart, setCart, user, setOrders, orders, meals } =
    useContext(MyContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [placedOrder, setPlacedOrder] = useState(false);
  const [total, setTotal] = useState(0);
  const [userData, SetUserData] = useState(null);
  const [sameAddress, setSameAddress] = useState(true);

  useEffect(() => {
    const sum = cart.reduce((acc, item) => {
      acc += item.price * item.quantity;
      return acc;
    }, 0);
    setTotal(sum);
  }, [cart]);

  const changeQuantity = (e, meal) => {
    const item = cart.find((elem) => elem._id === meal._id);
    item.quantity = Number(e.target.value);
    setCart([...cart]);
    console.log(item);
  };
  const addToCart = (meal) => {
    let item = cart.find((elem) => elem._id === meal._id);
    if (item) {
      item.quantity += 1;
      setCart([...cart]);
    } else {
      if (cart.length + 1 > 3) {
        alert('Reached Maximum Quantity of Meals');
        return;
      }
      setCart([...cart, { ...meal, quantity: 1 }]);
    }
  };
  /*   const reduceToCart = (meal) => {
    let item = cart.find((elem) => elem._id === meal._id);
    if (item) {
      item.quantity -= 1;
      setCart([...cart]);
    }
      setCart([...cart, { ...meal, quantity: 1 }]);
    }
  }; */

  const getAddress = (e) => {
    e.preventDefault();
    let userAddress = {
      houseNo: e.target.hn.value,
      street: e.target.stn.value,
      zipCode: e.target.pc.value,
      city: e.target.city.value,
      phone: e.target.phone.value,
    };
    console.log(userAddress);
    e.target.reset();
  };

  /*  user enters card number, date, 3dig - click confirm order
  last 4 dig card is stored in database order
  stripe sandbox to process  payment*/
  /*  const payment = ((e) => {
    e.preventDefault()
    ??setCardNum =cardNumber.slice(-4)
  })
 */
  // * Yohannes and Sameer modify the placeOrder function

  // ===========================================================================
  // The customer placing an order in the front end and post it in the back end
  //============================================================================
  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/register');
    } else if (cart.length < 3) {
      alert('Minimum order is three meals');
    } else {
      const newOrder = {
        meals: cart.map((item) => item._id),
        total: total,
        userId: user.id,
        deliveryAddress: {
          houseNo: sameAddress ? user.info.houseNo : e.target.hn.value,
          street: sameAddress ? user.info.street : e.target.stn.value,
          zipCode: sameAddress ? user.info.zipCode : e.target.pc.value,
          city: sameAddress ? user.info.city : e.target.city.value,
          phone: sameAddress ? user.info.phone : e.target.phone.value,
        },
      };

      console.log(user);

      const settings = {
        method: 'POST',
        body: JSON.stringify(newOrder),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`http://localhost:3001/orders`, settings);
      const result = await response.json();
      try {
        if (response.ok) {
          setOrders([...orders, result.data._id]);
          setCart([]);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const changeAddress = (e) => {
    if (!e.target.checked) {
      setSameAddress(false);
    } else {
      setSameAddress(true);
    }
  };
  // * Yohannes and Sameer modify the placeOrder function

  // ===========================================================================
  // Deleting a single ordered meal by the customer
  //============================================================================

  const deleteSingleOrderedMeal = (meal) => {
    let updatedCart = cart.filter((item) => item._id !== meal._id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    /* const selectedMealId = event.target.parentElement.id;
    const cartItem = cart.filter((cartItem) => cartItem._id != selectedMealId)
    setCart(cartItem)
    const settings = {
        method: "DELETE"
      };

      console.log(selectedMealId)

      const response = await fetch(`http://localhost:3001/orders/${selectedMealId}`, settings);
      const result = await response.json();

      try{
        if(response.ok){
          setOrders(result.meals)
        } else{
          throw new Error(result.message)
        }
      }catch(err){
        alert(err.message)
      } */
  };
  console.log(cart);

  return (
    <div>
      {placedOrder ? (
        <h2>Thanks for placing order: </h2>
      ) : (
        // <h3>This is your choice of meals:</h3>
        // <h3>order address:</h3>
        // <h3>last 3 dogits of card used for order:</h3>
        // <button>click here to return to meals</button>
        <div className="ordered-meals-container">
          <h3>Your choice this week: </h3>
          {cart.map((meal) => {
            return (
              <div key={meal._id} className="ordered-meals">
                <div>
                  {' '}
                  <img src={meal.img} width="100" alt="" />{' '}
                </div>
                <h4>{meal.mealName}</h4>
                <p>{meal.price}€</p>
                <div>
                  <input
                    type="text"
                    defaultValue={meal.quantity}
                    onChange={(e) => changeQuantity(e, meal)}
                  />
                </div>
                <div
                  id={meal._id}
                  onClick={() => deleteSingleOrderedMeal(meal)}
                  className="deleteOrderedMeal"
                >
                  {' '}
                  <span>X</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="total">
        {' '}
        {cart.length > 0 && <h2> Total : {total}€ </h2>}{' '}
      </div>

      <h3>{message}</h3>
      <h3>Address: </h3>
      {/*     <div>
        {
          userData &&
          (
            <div key={userData._id}>
              <p>{userData.firstName} {userData.lastName}</p>
              <p>{userData.street} {userData.houseNo}</p>
              <p>{userData.city}</p>
              <p>{userData.zipCode}</p>
              <p>{userData.phone}</p>
               </h3> <button  onClick={ addAddress}>Add Address</button> 
            </div>
          )
             }
      </div> */}
      <label>
        Same as Registered Address:{' '}
        <input
          type={'checkbox'}
          defaultChecked
          onChange={changeAddress} /* name="check" */
        />
      </label>
      <br></br>
      {!sameAddress && (
        <form onSubmit={placeOrder}>
          <label>
            House No.
            <input
              defaultValue={user.info.houseNo}
              type="number"
              name="hn"
              min={1}
            />
          </label>
          <br />
          <label>
            Street No.
            <input defaultValue={user.info.street} type="text" name="stn" />
          </label>
          <br />
          <label>
            City.
            <input defaultValue={user.info.city} type="text" name="city" />
          </label>
          <br />
          <label>
            Zip Code.
            <input defaultValue={user.info.zipCode} type="number" name="pc" />
          </label>
          <br />
          <label>
            Phone
            <input defaultValue={user.info.phone} type="number" name="phone" />
          </label>
          <br />
          <button disabled={cart.length < 3}>checkout</button>
        </form>
      )}
      {sameAddress && (
        <>
         <button onClick={placeOrder} disabled={cart.length < 3}>
            checkout
          </button> 
        </>
      )}

      {/*  <h3>Payment: </h3> */}
      {/* <form onSubmit={payment}> */}
      {/*       <form >
        <label>
          card No.
          <input type="number" name="hn" min={12} />
        </label>
        <label>
          Month / year
          <input type="number" name="stn" />
        </label>
        <label>
          3 dig
          <input type="number" name="stn" min={3} />
        </label>
      </form> */}
    </div>
  );
};

export default CartPage;
