export async function streamToStoryContent(stream: ReadableStream): Promise<any> {
    let data = '';
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      data += decoder.decode(value);
    }
    return JSON.parse(data);
  }
  