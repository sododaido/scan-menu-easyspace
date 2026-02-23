/**
 * SalesChart — Revenue trend line chart + Top 5 bar chart
 * Uses Recharts library. Supports time range filter.
 * Responsive with custom tooltip styling (white theme).
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./SalesChart.css";

/**
 * Custom tooltip — white professional style.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="sc-tooltip">
      <p className="sc-tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="sc-tooltip-value" style={{ color: entry.color }}>
          {entry.name}: {Number(entry.value).toLocaleString()}
          {entry.name === "รายได้" ? " ฿" : ""}
        </p>
      ))}
    </div>
  );
}

function SalesChart({
  dailyData,
  top5Products,
  range,
  setRange,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}) {
  return (
    <div className="sales-chart-section">
      {/* Time filter */}
      <div className="sc-header">
        <h3 className="sc-title">📈 กราฟยอดขาย</h3>
        <div className="sc-filters">
          {[
            { key: "today", label: "วันนี้" },
            { key: "7days", label: "7 วัน" },
            { key: "30days", label: "30 วัน" },
            { key: "custom", label: "กำหนดเอง" },
          ].map((f) => (
            <button
              key={f.key}
              className={`sc-filter-btn ${range === f.key ? "sc-filter-active" : ""}`}
              onClick={() => setRange(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom date range inputs */}
      {range === "custom" && (
        <div className="sc-custom-range">
          <label>
            จาก:
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="sc-date-input"
            />
          </label>
          <label>
            ถึง:
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="sc-date-input"
            />
          </label>
        </div>
      )}

      <div className="sc-charts-grid">
        {/* Line Chart — Revenue Over Time */}
        <div className="sc-chart-card glass-card">
          <h4 className="sc-chart-label">รายได้รายวัน</h4>
          {dailyData.length === 0 ? (
            <p className="sc-no-data">ไม่มีข้อมูลในช่วงเวลานี้</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: "0.78rem", color: "#9CA3AF" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="รายได้"
                  stroke="#C4A96A"
                  strokeWidth={2.5}
                  dot={{ fill: "#C4A96A", r: 3 }}
                  activeDot={{ r: 5, fill: "#B89B5A" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart — Top 5 Products */}
        <div className="sc-chart-card glass-card">
          <h4 className="sc-chart-label">สินค้าขายดี Top 5</h4>
          {top5Products.length === 0 ? (
            <p className="sc-no-data">ไม่มีข้อมูล</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={top5Products.map((p) => ({
                  name: p.name.length > 12 ? p.name.slice(0, 12) + "…" : p.name,
                  revenue: p.revenue,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  tickFormatter={(v) => `${v.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="รายได้"
                  fill="#C4A96A"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesChart;
