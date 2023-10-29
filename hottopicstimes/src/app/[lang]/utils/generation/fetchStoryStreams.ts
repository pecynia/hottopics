export async function fetchStoryStream(prompt: string): Promise<ReadableStream> {
  const encoder = new TextEncoder();
  const payload = {
    model: "gpt-4",
    prompt,
    stream: true,
    // ... other parameters
  };

  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.body!;
}
