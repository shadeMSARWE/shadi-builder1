/**
 * FERDOUS AI OS - AI Core
 */
import OpenAI from "openai";

function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder" });
}

export async function chatJson<T>(system: string, user: string): Promise<T> {
  const completion = await getClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const raw = completion.choices?.[0]?.message?.content || "{}";
  return JSON.parse(raw) as T;
}
