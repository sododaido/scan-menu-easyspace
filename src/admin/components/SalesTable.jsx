/**
 * SalesTable — Detailed per-product sales breakdown
 * Features: search, sortable columns, pagination-ready structure.
 */

import { useState, useMemo } from "react";
import "./SalesTable.css";

const PAGE_SIZE = 10;

function SalesTable({ productSales }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);

  // Handle column header click for sorting
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  // Filter + sort
  const processed = useMemo(() => {
    let data = [...productSales];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)),
      );
    }

    // Sort
    data.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [productSales, search, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(processed.length / PAGE_SIZE);
  const paginated = processed.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Sort indicator
  const sortIcon = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="sales-table-section">
      <div className="st-header">
        <h3 className="st-title"> รายละเอียดยอดขายตามสินค้า</h3>
        <input
          className="st-search"
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <div className="st-scroll glass-card">
        <table className="st-table">
          <thead>
            <tr>
              <th>สินค้า</th>
              <th
                className="st-sortable"
                onClick={() => handleSort("category")}
              >
                หมวดหมู่{sortIcon("category")}
              </th>
              <th className="st-sortable" onClick={() => handleSort("qty")}>
                จำนวนขาย{sortIcon("qty")}
              </th>
              <th className="st-sortable" onClick={() => handleSort("revenue")}>
                รายได้{sortIcon("revenue")}
              </th>
              <th
                className="st-sortable"
                onClick={() => handleSort("percentOfTotal")}
              >
                % ของยอดรวม{sortIcon("percentOfTotal")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className="st-empty">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="st-row">
                  <td>
                    <div className="st-product">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="st-product-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <span className="st-product-name">{p.name}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`st-badge ${
                        p.category === "drink"
                          ? "st-badge-drink"
                          : "st-badge-snack"
                      }`}
                    >
                      {p.category === "drink" ? "เครื่องดื่ม" : "ของว่าง"}
                    </span>
                  </td>
                  <td className="st-num">{p.qty.toLocaleString()}</td>
                  <td className="st-num st-revenue">
                    {p.revenue.toLocaleString()} ฿
                  </td>
                  <td className="st-num">
                    <div className="st-percent-bar">
                      <div
                        className="st-percent-fill"
                        style={{
                          width: `${Math.min(Number(p.percentOfTotal), 100)}%`,
                        }}
                      />
                      <span>{p.percentOfTotal}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="st-pagination">
          <button
            className="st-page-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← ก่อนหน้า
          </button>
          <span className="st-page-info">
            หน้า {page + 1} / {totalPages}
          </span>
          <button
            className="st-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            ถัดไป →
          </button>
        </div>
      )}
    </div>
  );
}

export default SalesTable;
