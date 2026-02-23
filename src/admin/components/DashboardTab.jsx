/**
 * DashboardTab — Full analytics dashboard
 * -----------------------------------------
 * KPI summary cards, sales charts, best sellers,
 * detailed sales table, and recently added items.
 * All data connected to useSalesData hook.
 */

import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import BestSellerTable from "./BestSellerTable";
import SalesTable from "./SalesTable";
import { useSalesData } from "../../hooks/useSalesData";
import "./DashboardTab.css";

function DashboardTab({ items }) {
  const {
    totalRevenue,
    totalOrders,
    totalItemsSold,
    totalScans,
    bestSeller,
    productSales,
    dailyData,
    top5Products,
    loading,
    lastUpdated,
    range,
    setRange,
    customFrom,
    setCustomFrom,
    customTo,
    setCustomTo,
    refresh,
    handleExportCSV,
  } = useSalesData(items);

  // Count unavailable items
  const unavailableCount = items.filter((i) => i.available === false).length;

  // Recent items (highest ID = newest)
  const recentItems = [...items].sort((a, b) => b.id - a.id).slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard-tab">
        <div className="dt-loading">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-tab">
      {/* ── HEADER with refresh + export ── */}
      <div className="dt-toolbar">
        <h2 className="dt-page-title">ภาพรวมธุรกิจ</h2>
        <div className="dt-toolbar-actions">
          {lastUpdated && (
            <span className="dt-last-updated">
              อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString("th-TH")}
            </span>
          )}
          <button className="dt-btn dt-btn-outline" onClick={refresh}>
            🔄 รีเฟรช
          </button>
          <button className="dt-btn dt-btn-accent" onClick={handleExportCSV}>
            📥 ส่งออก CSV
          </button>
        </div>
      </div>

      {/* ── TOP KPI SUMMARY ROW ── */}
      <div className="dt-kpi-grid">
        <StatCard
          emoji="💰"
          label="รายได้รวม"
          value={totalRevenue.toLocaleString()}
          suffix="฿"
        />
        <StatCard
          emoji="🛒"
          label="ออเดอร์ทั้งหมด"
          value={totalOrders.toLocaleString()}
        />
        <StatCard
          emoji="📦"
          label="สินค้าขายแล้ว"
          value={totalItemsSold.toLocaleString()}
          suffix="ชิ้น"
        />
        <StatCard
          emoji="📱"
          label="การสแกน QR"
          value={totalScans.toLocaleString()}
        />
        <StatCard
          emoji="🏆"
          label="สินค้าขายดี #1"
          value={bestSeller ? bestSeller.name : "-"}
          subtext={bestSeller ? `${bestSeller.revenue.toLocaleString()} ฿` : ""}
        />
      </div>

      {/* ── INVENTORY SUMMARY ── */}
      <div className="dt-inventory-row">
        <div className="dt-inv-chip">
          🛒 สินค้าทั้งหมด <strong>{items.length}</strong>
        </div>
        <div className="dt-inv-chip">
          🍺 เครื่องดื่ม{" "}
          <strong>
            {items.filter((i) => i.category === "drink").length}
          </strong>
        </div>
        <div className="dt-inv-chip">
          🍿 ของว่าง{" "}
          <strong>
            {items.filter((i) => i.category === "snack").length}
          </strong>
        </div>
        <div className="dt-inv-chip">
          ✅ พร้อมขาย{" "}
          <strong>
            {items.filter((i) => i.available !== false).length}
          </strong>
        </div>
        {unavailableCount > 0 && (
          <div className="dt-inv-chip dt-inv-chip-warn">
            🚫 ซ่อนอยู่ <strong>{unavailableCount}</strong>
          </div>
        )}
      </div>

      {/* ── SALES CHARTS ── */}
      <SalesChart
        dailyData={dailyData}
        top5Products={top5Products}
        range={range}
        setRange={setRange}
        customFrom={customFrom}
        setCustomFrom={setCustomFrom}
        customTo={customTo}
        setCustomTo={setCustomTo}
      />

      {/* ── BEST SELLER TABLE ── */}
      <BestSellerTable top5Products={top5Products} />

      {/* ── DETAILED SALES TABLE ── */}
      <SalesTable productSales={productSales} />

      {/* ── RECENT ITEMS ── */}
      <div className="dt-recent-section">
        <h3 className="dt-section-title">🆕 สินค้าล่าสุด</h3>
        <div className="dt-recent-list">
          {recentItems.map((item) => (
            <div key={item.id} className="dt-recent-item glass-card">
              <img
                src={item.image}
                alt={item.name.th}
                className="dt-recent-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="dt-recent-info">
                <span className="dt-recent-name">{item.name.th}</span>
                <span className="dt-recent-price">{item.price} ฿</span>
              </div>
            </div>
          ))}
          {recentItems.length === 0 && (
            <p className="dt-empty">ยังไม่มีสินค้า</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardTab;
