import { useState, useEffect, useCallback } from "react";
import { menuItems as fallbackItems } from "../data/menuData";

const RAW_URL = `https://raw.githubusercontent.com/${import.meta.env.VITE_GITHUB_REPO}/main/${import.meta.env.VITE_GITHUB_FILE}`;

export function useMenuData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
      if (!res.ok) throw new Error("Failed to fetch menu");
      const data = await res.json();
      const normalized = data.map((item) => ({ available: true, ...item }));
      setItems(normalized);
    } catch (err) {
      console.warn("GitHub fetch failed, using local fallback:", err.message);
      setError(err.message);
      setItems(fallbackItems.map((item) => ({ ...item, available: true })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const saveMenu = async (newItems) => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: newItems }),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save menu");
    }

    setItems(newItems);
    return true;
  };

  return { items, loading, error, refetch: fetchMenu, saveMenu };
}
