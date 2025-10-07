import { useState } from "react";
import axios from "axios";
import "./Cart.css";

function Cart({
  cart,
  language,
  room,
  onClose,
  removeFromCart,
  addToCart,
  getTotalPrice,
  getTotalItems,
}) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const roomNames = {
    room1: { th: "ห้องประชุมใหญ่", en: "Large Meeting Room" },
    room2: { th: "ห้องประชุมเล็ก", en: "Small Meeting Room" },
  };

  const sendToTelegram = async () => {
    if (cart.length === 0) return;

    setSending(true);

    const now = new Date();
    const time = now.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = now.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const roomEmoji = room === "room1" ? "🔵" : "🟡";
    const roomTitle = room === "room1" ? "Order Room 1" : "Order Room 2";

    let message = `${roomEmoji}${roomTitle}${roomEmoji}\n`;
    message += `_______________\n`;
    message += `ห้อง: ${roomNames[room].th}\n`;
    message += `เวลาสั่ง: ${time}\n`;
    message += `วันที่: ${date}\n`;
    message += `_______________\n`;
    message += `รายการสินค้า\n\n`;

    cart.forEach((item, index) => {
      message += `${index + 1}.${item.name.th}\n`;
      message += `  จำนวน : ${item.quantity}\n`;
      message += `  ราคา : ${item.price}฿ x ${item.quantity} = ${
        item.price * item.quantity
      } ฿\n\n`;
    });

    message += `_______________\n`;
    message += `จำนวน : ${getTotalItems()} รายการ\n`;
    message += `รวมทั้งสิ้น : ${getTotalPrice()} บาท\n`;
    message += `_______________\n\n`;

    if (note) {
      message += `หมายเหตุ: ${note}\n\n`;
    }

    message += `⚠️กรุณาจัดเตรียมและส่งไปที่${roomNames[room].th}`;

    try {
      await axios.post(
        `https://api.telegram.org/bot8371673378:AAHB03X_SXOiNM_kkaoN7ZIlDU2rnCeqTFo/sendMessage`,
        {
          chat_id: "-1003103669661",
          text: message,
        }
      );

      // แสดง popup สำเร็จ
      setShowSuccess(true);

      // ปิด popup อัตโนมัติหลัง 3 วินาที
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        window.location.reload(); // รีเฟรชหน้าเพื่อล้างตะกร้า
      }, 3000);
    } catch (error) {
      console.error("Error sending to Telegram:", error);
      alert(
        language === "th"
          ? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
          : "Error occurred. Please try again."
      );
      setSending(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={(e) => e.stopPropagation()}>
        {/* Success Popup */}
        {showSuccess && (
          <div className="success-popup">
            <div className="success-icon">✓</div>
            <h3>{language === "th" ? "สั่งซื้อสำเร็จ" : "Order Success"}</h3>
            <p>
              {language === "th"
                ? "พนักงานกำลังจัดเตรียม"
                : "Staff is preparing"}
            </p>
          </div>
        )}

        <div className="cart-header">
          <h2>{language === "th" ? "ตะกร้าสินค้า" : "Shopping Cart"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">
              {language === "th" ? "ไม่มีสินค้าในตะกร้า" : "No items in cart"}
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name[language]}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.name[language]}</h4>
                  <p className="cart-item-price">{item.price} ฿</p>
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>
                <p className="cart-item-total">
                  {item.price * item.quantity} ฿
                </p>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-note">
              <label>{language === "th" ? "หมายเหตุ:" : "Note:"}</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  language === "th"
                    ? "เพิ่มหมายเหตุ (ถ้ามี)"
                    : "Add note (optional)"
                }
                rows="3"
              />
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>
                  {language === "th" ? "จำนวนรายการ:" : "Total Items:"}
                </span>
                <span>
                  {getTotalItems()} {language === "th" ? "รายการ" : "items"}
                </span>
              </div>
              <div className="summary-row total">
                <span>{language === "th" ? "รวมทั้งสิ้น:" : "Total:"}</span>
                <span>{getTotalPrice()} ฿</span>
              </div>
            </div>

            <button
              className="order-btn"
              onClick={sendToTelegram}
              disabled={sending}
            >
              {sending
                ? language === "th"
                  ? "กำลังส่ง..."
                  : "Sending..."
                : language === "th"
                ? "สั่งเลย"
                : "Place Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
