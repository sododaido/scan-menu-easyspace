export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(200).json({ ok: true });
  }

  try {
    const { callback_query } = req.body;

    if (!callback_query) {
      return res.status(200).json({ ok: true });
    }

    const callbackData = callback_query.data || "";
    const callbackId = callback_query.id;
    const messageObj = callback_query.message;

    if (!callbackData.startsWith("accept_")) {
      return res.status(200).json({ ok: true });
    }

    // Step 1: Answer the callback query (removes loading spinner on button)
    await fetch(
      `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text: "รับออเดอร์แล้ว!",
        }),
      }
    );

    // Step 2: Edit original message — append delivery status, remove keyboard
    if (messageObj) {
      const originalText = messageObj.text || "";
      const updatedText =
        originalText + "\n\n🚀 กำลังจัดส่งออเดอร์";

      await fetch(
        `https://api.telegram.org/bot${botToken}/editMessageText`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: messageObj.chat.id,
            message_id: messageObj.message_id,
            text: updatedText,
            reply_markup: { inline_keyboard: [] },
          }),
        }
      );
    }

    return res.status(200).json({ ok: true });
  } catch {
    // Always return 200 to Telegram to prevent retry loops
    return res.status(200).json({ ok: true });
  }
}
