import "./CartButton.css";

function CartButton({ itemCount, onClick }) {
  return (
    <button className="cart-button" onClick={onClick}>
      <span className="cart-icon">🛒</span>
      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
    </button>
  );
}

export default CartButton;
