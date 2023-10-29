export async function fetchStoryStream(prompt: string): Promise<ReadableStream> {
  const payload = {
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
    stream: true,
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  })

  return res.body!
}
