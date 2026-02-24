export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || "sododaido/easyspace-menu-data";
  const file = process.env.GITHUB_FILE || "menu.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${file}`;

  try {
    // Use GitHub Contents API (authenticated) — always returns fresh data,
    // unlike raw.githubusercontent.com which has up to 5-minute CDN cache.
    if (token) {
      const ghRes = await fetch(apiUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (ghRes.ok) {
        const data = await ghRes.json();
        const content = Buffer.from(data.content, "base64").toString("utf-8");
        const items = JSON.parse(content);

        // Cache at Vercel edge for 10s, serve stale while revalidating for 30s
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10, stale-while-revalidate=30"
        );
        return res.status(200).json(items);
      }
    }

    // Fallback: raw URL (may be cached up to 5 min by GitHub CDN)
    const rawUrl = `https://raw.githubusercontent.com/${repo}/main/${file}?t=${Date.now()}`;
    const rawRes = await fetch(rawUrl);

    if (!rawRes.ok) {
      return res.status(500).json({ error: "Failed to fetch menu from GitHub" });
    }

    const items = await rawRes.json();
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=30"
    );
    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
