// types
export interface ChatMessage {
  date: string;
  time: string;
  sender: string;
  message: string;
}

// 카카오톡 대화 텍스트를 파싱하는 함수
export function parseKakaoChat(text: string): ChatMessage[] {
  const lines = text.split("\n");
  const messages: ChatMessage[] = [];

  const regex =
    /^(\d{4}\. \d{1,2}\. \d{1,2}\.) (오전|오후) (\d{1,2}:\d{2}), (.+?) : (.+)$/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const [_, date, ampm, time, sender, message] = match;
      const formattedTime = ampm === "오후" ? convertTo24Hour(time) : time;

      messages.push({
        date: date.trim(),
        time: formattedTime,
        sender: sender.trim(),
        message: message.trim(),
      });
    }
  }

  return messages;
}

// 로컬스토리지에서 파싱된 메시지 가져오기
export function getParsedMessages(): ChatMessage[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("parsedMessages");
    if (stored) {
      try {
        return JSON.parse(stored) as ChatMessage[];
      } catch (e) {
        console.error("❌ 파싱된 메시지를 불러오는 중 오류:", e);
      }
    }
  }
  return [];
}

// 오후 시간 ➝ 24시간 형식으로 변환
function convertTo24Hour(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  if (hour === 12) return `${hour}:${minute.toString().padStart(2, "0")}`;
  return `${hour + 12}:${minute.toString().padStart(2, "0")}`;
}
