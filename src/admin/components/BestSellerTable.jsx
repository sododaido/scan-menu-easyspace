/**
 * BestSellerTable — Top 5 products by revenue
 * Displays a clean, ranked list with visual revenue bars.
 */

import "./BestSellerTable.css";

function BestSellerTable({ top5Products }) {
  if (!top5Products || top5Products.length === 0) {
    return (
      <div className="bestseller-section">
        <h3 className="bs-title">🏆 สินค้าขายดี Top 5</h3>
        <p className="bs-empty">ยังไม่มีข้อมูลยอดขาย</p>
      </div>
    );
  }

  // Calculate max revenue for percentage bar scaling
  const maxRevenue = top5Products[0]?.revenue || 1;

  return (
    <div className="bestseller-section">
      <h3 className="bs-title"> สินค้าขายดี Top 5</h3>
      <div className="bs-list glass-card">
        {top5Products.map((product, index) => (
          <div key={product.id} className="bs-item">
            <span className="bs-rank">{index + 1}</span>
            <div className="bs-product-info">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="bs-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div className="bs-details">
                <span className="bs-name">{product.name}</span>
                <div className="bs-bar-wrap">
                  <div
                    className="bs-bar"
                    style={{
                      width: `${(product.revenue / maxRevenue) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="bs-stats">
              <span className="bs-revenue">
                {product.revenue.toLocaleString()} ฿
              </span>
              <span className="bs-qty">{product.qty} ชิ้น</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestSellerTable;
