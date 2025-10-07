import "./MenuItem.css";

function MenuItem({ item, language, addToCart, removeFromCart, quantity }) {
  return (
    <div className="menu-item">
      <div className="menu-item-image">
        <img src={item.image} alt={item.name[language]} />
      </div>

      <div className="menu-item-details">
        <h3 className="menu-item-name">{item.name[language]}</h3>
        <p className="menu-item-price">{item.price} ฿</p>

        <div className="menu-item-actions">
          {quantity === 0 ? (
            <button className="add-btn" onClick={() => addToCart(item)}>
              {language === "th" ? "เพิ่มลงตะกร้า" : "Add to Cart"}
            </button>
          ) : (
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => removeFromCart(item.id)}
              >
                -
              </button>
              <span className="quantity">{quantity}</span>
              <button className="qty-btn" onClick={() => addToCart(item)}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
