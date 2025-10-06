// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Payload = {
  messages: { role: string; content: string }[];
  system?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body: Payload = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not configured." });
    }

    // Build messages for OpenAI: include system prompt at beginning
    const messages = [
      ...(body.system ? [{ role: "system", content: body.system }] : []),
      ...(body.messages ?? []),
    ];

    // Call OpenAI Chat Completions (replace with your provider if needed)
    // This example uses the OpenAI v1 chat completions endpoint that accepts model and messages.
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // choose model you have access to (change as needed)
        messages,
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error:", text);
      return res.status(502).json({ error: "OpenAI API error", details: text });
    }

    const data = await response.json();

    // Extract the assistant reply
    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Server error in /api/chat", err);
    return res.status(500).json({ error: err.message ?? "Server error" });
  }
}
