/**
 * useSalesData Hook
 * -----------------
 * Provides mock sales analytics data for the admin dashboard.
 * Generates realistic data based on actual menu items.
 * Supports date range filtering, auto-refresh, and CSV export.
 *
 * In production, this would fetch from a sales.json via GitHub API
 * (same pattern as useMenuData). For now, uses deterministic mock data.
 */

import { useState, useEffect, useCallback, useRef } from "react";

// --- Constants ---
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

/**
 * Seeded random number generator for deterministic mock data.
 * Same seed = same data on every render.
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Generate daily sales entries for a given date range.
 * Uses menu items to create realistic per-product sales.
 */
function generateMockSales(menuItems, days = 30) {
  const sales = [];
  const today = new Date();

  for (let d = 0; d < days; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split("T")[0];
    const rand = seededRandom(date.getTime());

    // Random scan count per day (40-120)
    const scanCount = Math.floor(rand() * 80) + 40;

    // Generate sales per item
    const items = [];
    let dayRevenue = 0;

    menuItems.forEach((item) => {
      // Not every item sells every day
      if (rand() > 0.35) {
        // Higher-priced items sell less, cheaper items sell more
        const baseDemand = item.price <= 20 ? 12 : item.price <= 100 ? 6 : 3;
        const qty = Math.max(1, Math.floor(rand() * baseDemand) + 1);
        const revenue = qty * item.price;
        items.push({ id: item.id, qty, revenue });
        dayRevenue += revenue;
      }
    });

    sales.push({
      date: dateStr,
      items,
      totalRevenue: dayRevenue,
      scanCount,
    });
  }

  return sales;
}

/**
 * Compute aggregated analytics from raw daily sales data.
 */
function computeAnalytics(salesData, menuItems) {
  const totalRevenue = salesData.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalScans = salesData.reduce((sum, d) => sum + d.scanCount, 0);

  // Aggregate per-product stats
  const productMap = {};
  salesData.forEach((day) => {
    day.items.forEach((item) => {
      if (!productMap[item.id]) {
        productMap[item.id] = { id: item.id, qty: 0, revenue: 0 };
      }
      productMap[item.id].qty += item.qty;
      productMap[item.id].revenue += item.revenue;
    });
  });

  const totalItemsSold = Object.values(productMap).reduce(
    (s, p) => s + p.qty,
    0,
  );
  const totalOrders = salesData.reduce((s, d) => s + d.items.length, 0);

  // Enrich product data with menu info
  const productSales = Object.values(productMap)
    .map((p) => {
      const menuItem = menuItems.find((m) => m.id === p.id);
      return {
        ...p,
        name: menuItem ? menuItem.name.th : `สินค้า #${p.id}`,
        nameEn: menuItem ? menuItem.name.en : `Item #${p.id}`,
        category: menuItem ? menuItem.category : "unknown",
        image: menuItem ? menuItem.image : "",
        percentOfTotal:
          totalRevenue > 0 ? ((p.revenue / totalRevenue) * 100).toFixed(1) : 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Best seller
  const bestSeller = productSales.length > 0 ? productSales[0] : null;

  // Daily chart data (chronological order)
  const dailyData = [...salesData].reverse().map((d) => ({
    date: d.date,
    // Short label: "23 ก.พ."
    label: formatThaiDate(d.date),
    revenue: d.totalRevenue,
    orders: d.items.length,
    scans: d.scanCount,
  }));

  // Top 5 for bar chart
  const top5Products = productSales.slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    totalItemsSold,
    totalScans,
    bestSeller,
    productSales,
    dailyData,
    top5Products,
  };
}

/**
 * Format date string to Thai short format: "23 ก.พ."
 */
function formatThaiDate(dateStr) {
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

/**
 * Filter sales data by date range.
 */
function filterByRange(salesData, range, customFrom, customTo) {
  const now = new Date();
  let fromDate;

  switch (range) {
    case "today":
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "7days":
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 7);
      break;
    case "30days":
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 30);
      break;
    case "custom":
      if (customFrom) {
        fromDate = new Date(customFrom);
      } else {
        fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - 30);
      }
      break;
    default:
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 30);
  }

  const toDate = range === "custom" && customTo ? new Date(customTo) : now;

  return salesData.filter((d) => {
    const date = new Date(d.date);
    return date >= fromDate && date <= toDate;
  });
}

/**
 * Generate CSV string from product sales data.
 */
export function exportSalesCSV(productSales, dailyData) {
  // Product summary CSV
  let csv = "Product Name,Category,Quantity Sold,Revenue (THB),% of Total\n";
  productSales.forEach((p) => {
    csv += `"${p.name}",${p.category},${p.qty},${p.revenue},${p.percentOfTotal}%\n`;
  });

  csv += "\n\nDaily Summary\nDate,Revenue (THB),Orders,Scans\n";
  dailyData.forEach((d) => {
    csv += `${d.date},${d.revenue},${d.orders},${d.scans}\n`;
  });

  return csv;
}

/**
 * Trigger CSV file download in browser.
 */
export function downloadCSV(
  csvContent,
  filename = "easyspace-sales-report.csv",
) {
  // Add BOM for Excel UTF-8 compatibility
  const bom = "\uFEFF";
  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// --- Main Hook ---
export function useSalesData(menuItems) {
  const [range, setRange] = useState("30days");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Generate full 30-day mock data whenever menu items change
  const [allSales, setAllSales] = useState([]);

  const refresh = useCallback(() => {
    if (!menuItems || menuItems.length === 0) return;
    setLoading(true);

    // Simulate brief network delay
    setTimeout(() => {
      const data = generateMockSales(menuItems, 30);
      setAllSales(data);
      setLastUpdated(new Date());
      setLoading(false);
    }, 200);
  }, [menuItems]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      refresh();
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  // Compute filtered + aggregated analytics
  // (kept for reference but overridden below with zeroed values)
  const filteredSales = filterByRange(allSales, range, customFrom, customTo);
  computeAnalytics(filteredSales, menuItems);

  // --- Override: force all analytics to zero/empty ---
  const zeroAnalytics = {
    totalRevenue: 0,
    totalOrders: 0,
    totalItemsSold: 0,
    totalScans: 0,
    bestSeller: null,
    productSales: [],
    dailyData: [],
    top5Products: [],
  };

  // CSV export handler (exports zeroed data)
  const handleExportCSV = useCallback(() => {
    const csv = exportSalesCSV(
      zeroAnalytics.productSales,
      zeroAnalytics.dailyData,
    );
    const dateStr = new Date().toISOString().split("T")[0];
    downloadCSV(csv, `easyspace-sales-${dateStr}.csv`);
  }, []);

  return {
    ...zeroAnalytics,
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
  };
}
