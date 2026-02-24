import { useState, useEffect, useCallback, useRef } from "react";
import { menuItems as fallbackItems } from "../data/menuData";

const RAW_URL = `https://raw.githubusercontent.com/${import.meta.env.VITE_GITHUB_REPO}/main/${import.meta.env.VITE_GITHUB_FILE}`;
const POLL_INTERVAL = 60000; // Auto-refresh every 60 seconds

export function useMenuData() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const lastSaveRef = useRef(0);

  const fetchMenu = useCallback(async (isBackground = false) => {
    // Skip background refresh if we saved within the last 5 seconds,
    // so stale CDN data doesn't overwrite the fresh local state.
    if (isBackground && Date.now() - lastSaveRef.current < 5000) {
      return;
    }

    if (!isBackground) {
      setLoading(true);
    }
    setError(null);

    try {
      // Primary: /api/menu — reads via GitHub API, bypasses CDN cache entirely
      let res = await fetch(`/api/menu?t=${Date.now()}`, {
        cache: "no-store",
      });

      // Fallback: raw URL (may be cached up to 5 min by GitHub CDN)
      if (!res.ok) {
        res = await fetch(`${RAW_URL}?t=${Date.now()}`, {
          cache: "no-store",
        });
      }

      if (!res.ok) throw new Error("Failed to fetch menu");

      const data = await res.json();
      const normalized = data.map((item) => ({ available: true, ...item }));
      setItems(normalized);
    } catch (err) {
      console.warn("Menu fetch failed, using local fallback:", err.message);
      if (!isBackground) {
        setError(err.message);
        setItems(fallbackItems.map((item) => ({ ...item, available: true })));
      }
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMenu(false);
  }, [fetchMenu]);

  // Auto-refresh polling every 60 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchMenu(true);
    }, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMenu]);

  // Refetch when tab becomes visible again (user switches back)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchMenu(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
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

    // Update local state immediately so admin sees the change instantly
    setItems(newItems);
    lastSaveRef.current = Date.now();
    return true;
  };

  return { items, loading, error, refetch: fetchMenu, saveMenu };
}
