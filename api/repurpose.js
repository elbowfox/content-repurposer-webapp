export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { text } = req.body || {};
  if (!text || text.length > 20000) return res.status(400).json({ error: "Bad input" });
  const r = await fetch(process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.LLM_API_KEY}` },
    body: JSON.stringify({
      model: process.env.LLM_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Repurpose the user's content into: 1) an X thread (6-8 posts), 2) a LinkedIn post, 3) a short newsletter, 4) three 30-second video scripts. Use clear markdown headings." },
        { role: "user", content: text }
      ]
    })
  });
  const j = await r.json();
  res.status(200).json({ output: j.choices?.[0]?.message?.content || "Error generating." });
}