import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser"

export async function streamToStoryContent(stream: ReadableStream): Promise<any> {
    const chunks: string[] = [];
    const decoder = new TextDecoder();
    const reader = stream.getReader();
  
    function onParse(event: ParsedEvent | ReconnectInterval) {
      if (event.type === "event" && event.data !== "[DONE]") {
        chunks.push(event.data);
      }
    }
  
    const parser = createParser(onParse);
  
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      parser.feed(decoder.decode(value));
    }
  
    // Parse valid JSON chunks and combine content
    let combinedContent = '';
    chunks
      .filter(chunk => chunk.trim().startsWith("{"))
      .forEach(chunk => {
        try {
          const parsedChunk = JSON.parse(chunk);
          if (parsedChunk.choices && parsedChunk.choices[0] && parsedChunk.choices[0].delta && parsedChunk.choices[0].delta.content) {
            combinedContent += parsedChunk.choices[0].delta.content;
          }
        } catch (e) {
          console.warn("Skipped invalid JSON chunk:", chunk);
        }
      });

    try {
        return JSON.parse(combinedContent);
    } catch (err) {
        console.error("Error parsing combined content:", err);
        // Return a default value or handle error as required
        return null;
    }
}
