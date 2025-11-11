import { useState, useEffect } from "react";
import "./App.css";
import { menuItems } from "./data/menuData";
import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import MenuItem from "./components/MenuItem";
import Cart from "./components/Cart";
import CartButton from "./components/CartButton";

function App() {
  const [language, setLanguage] = useState("th");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [room, setRoom] = useState("room1"); // ดึงจาก URL parameter ในภายหลัง

  // ดึงค่า room จาก URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (
      roomParam === "1" ||
      roomParam === "2" ||
      roomParam === "3" ||
      roomParam === "4"
    ) {
      setRoom(`room${roomParam}`);
    }
  }, []);

  const filteredItems =
    category === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);

    if (existingItem.quantity === 1) {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="app">
      <Navbar language={language} setLanguage={setLanguage} />

      <div className="container">
        <CategoryBar
          category={category}
          setCategory={setCategory}
          language={language}
        />

        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              language={language}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              quantity={
                cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0
              }
            />
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <CartButton
          itemCount={getTotalItems()}
          onClick={() => setShowCart(true)}
        />
      )}

      {showCart && (
        <Cart
          cart={cart}
          language={language}
          room={room}
          onClose={() => setShowCart(false)}
          removeFromCart={removeFromCart}
          addToCart={addToCart}
          getTotalPrice={getTotalPrice}
          getTotalItems={getTotalItems}
        />
      )}
    </div>
  );
}

export default App;
