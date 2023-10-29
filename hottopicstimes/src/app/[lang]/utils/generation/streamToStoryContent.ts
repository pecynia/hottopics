import { ParsedEvent, ReconnectInterval, createParser } from "eventsource-parser";

export async function streamToStoryContent(stream: ReadableStream): Promise<any> {
  let data = '';
  const decoder = new TextDecoder();
  const reader = stream.getReader();

  function onParse(event: ParsedEvent | ReconnectInterval) {
    if (event.type === "event") {
      data += event.data;
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

  // Assuming that the stream's data is a JSON string, we parse it
  return JSON.parse(data);
}
