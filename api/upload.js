export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "GitHub token not configured" });
  }

  const repo = process.env.GITHUB_REPO || "sododaido/easyspace-menu-data";
  const file = process.env.GITHUB_FILE || "menu.json";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${file}`;

  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid data: items array required" });
    }

    // Step 1: Get current file SHA (required by GitHub API for updates)
    const metaRes = await fetch(apiUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!metaRes.ok) {
      const errData = await metaRes.json();
      return res.status(500).json({
        error: `Failed to get file metadata: ${errData.message}`,
      });
    }

    const meta = await metaRes.json();

    // Step 2: Encode content to base64
    const content = Buffer.from(
      JSON.stringify(items, null, 2),
      "utf-8"
    ).toString("base64");

    // Step 3: Update file on GitHub
    const updateRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
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
      return res.status(500).json({
        error: `Failed to update file: ${errData.message}`,
      });
    }

    const result = await updateRes.json();
    return res.status(200).json({
      success: true,
      sha: result.content.sha,
      message: "Menu updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
