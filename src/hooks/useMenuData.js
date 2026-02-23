import { useState, useEffect, useCallback } from "react";
import { menuItems as fallbackItems } from "../data/menuData";

const RAW_URL = `https://raw.githubusercontent.com/${import.meta.env.VITE_GITHUB_REPO}/main/${import.meta.env.VITE_GITHUB_FILE}`;
const API_URL = `https://api.github.com/repos/${import.meta.env.VITE_GITHUB_REPO}/contents/${import.meta.env.VITE_GITHUB_FILE}`;
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

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
    if (!TOKEN) throw new Error("GitHub token not configured");

    const metaRes = await fetch(API_URL, {
      headers: {
        Authorization: `token ${TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!metaRes.ok) throw new Error("Cannot read file metadata from GitHub");
    const meta = await metaRes.json();

    const content = btoa(
      unescape(encodeURIComponent(JSON.stringify(newItems, null, 2)))
    );

    const updateRes = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `token ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update menu from EasySpace Admin",
        content,
        sha: meta.sha,
      }),
    });

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      throw new Error(errData.message || "Failed to save menu to GitHub");
    }

    setItems(newItems);
    return true;
  };

  return { items, loading, error, refetch: fetchMenu, saveMenu };
}
