import { useState } from "react";
import "./MenuTable.css";

function MenuTable({ items, onEdit, onDelete, onToggle }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = items.filter((item) => {
    const matchCat = catFilter === "all" || item.category === catFilter;
    const matchSearch =
      search === "" ||
      item.name.th.toLowerCase().includes(search.toLowerCase()) ||
      item.name.en.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="menu-table-wrap">
      <div className="mt-toolbar">
        <input
          className="mt-search"
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="mt-filters">
          {[
            { key: "all", label: "ทั้งหมด" },
            { key: "drink", label: "เครื่องดื่ม" },
            { key: "snack", label: "ของว่าง" },
          ].map((f) => (
            <button
              key={f.key}
              className={`mt-filter-btn ${catFilter === f.key ? "active" : ""}`}
              onClick={() => setCatFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="mt-count">
          แสดง {filtered.length} / {items.length} รายการ
        </span>
      </div>

      <div className="mt-table-scroll">
        <table className="mt-table">
          <thead>
            <tr>
              <th>รูป</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>หมวดหมู่</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="mt-empty">
                  ไม่พบสินค้า
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="mt-row">
                  <td>
                    <img
                      src={item.image}
                      alt={item.name.th}
                      className="mt-img"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </td>
                  <td>
                    <div className="mt-name-th">{item.name.th}</div>
                    <div className="mt-name-en">{item.name.en}</div>
                  </td>
                  <td className="mt-price">{item.price} ฿</td>
                  <td>
                    <span
                      className={`mt-badge ${
                        item.category === "drink" ? "mt-badge-drink" : "mt-badge-snack"
                      }`}
                    >
                      {item.category === "drink" ? "เครื่องดื่ม" : "ของว่าง"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`mt-toggle ${
                        item.available !== false ? "mt-toggle-on" : "mt-toggle-off"
                      }`}
                      onClick={() => onToggle(item.id)}
                    >
                      <span className="mt-toggle-knob" />
                      <span className="mt-toggle-label">
                        {item.available !== false ? "พร้อมขาย" : "ซ่อนอยู่"}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="mt-actions">
                      <button className="mt-btn-edit" onClick={() => onEdit(item)}>
                        ✏️ แก้ไข
                      </button>
                      <button
                        className="mt-btn-delete"
                        onClick={() => {
                          if (window.confirm("ยืนยันการลบ?")) {
                            onDelete(item.id);
                          }
                        }}
                      >
                        🗑 ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MenuTable;
