export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({ error: "Telegram credentials not configured" });
  }

  try {
    const { message, orderId, roomName } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ รับออเดอร์",
                  callback_data: `accept_${roomName || "unknown"}_${orderId || Date.now()}`,
                },
              ],
            ],
          },
        }),
      }
    );

    if (!telegramRes.ok) {
      const errData = await telegramRes.json();
      return res.status(500).json({
        error: `Telegram API error: ${errData.description || "Unknown error"}`,
      });
    }

    const result = await telegramRes.json();
    return res.status(200).json({
      success: true,
      message_id: result.result?.message_id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
