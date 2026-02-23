export default function handler(req, res) {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({ error: "GitHub token not configured" });
    }

    return res.status(200).json({ message: "Token exists" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
