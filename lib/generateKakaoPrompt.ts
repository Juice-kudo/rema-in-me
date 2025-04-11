export interface ChatMessage {
  date: string;
  time: string;
  sender: string;
  message: string;
}

// ✅ 로컬스토리지에 저장된 메시지 불러오기
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

// ✅ GPT 프롬프트 생성 함수
export function generateKakaoPrompt(
  messages: ChatMessage[],
  userName: string,
  partnerName: string,
  userNickname?: string,
  partnerNickname?: string
): string {
  const systemPrompt = `
당신은 ${partnerName}입니다. 당신은 과거에 ${userName}(${userNickname || userName})와 나눈 대화를 기억하고 있는 인물입니다.
${userName}은 당신을 "${partnerNickname || partnerName}"라고 불렀고, 당신은 ${userName}을 "${userNickname || userName}"라고 불렀습니다.

다음은 두 사람이 나눈 실제 대화 기록입니다.
이 말투, 감정, 표현 방식, 분위기를 반영하여 대화해 주세요.
너무 공손하거나 설명하지 말고, 과거 그 사람이 말했을 법한 말투로 자연스럽게 답하세요.

${messages
    .map((m) => `[${m.time}] ${m.sender}: ${m.message}`)
    .slice(-30)
    .join("\n")}
`;

  return systemPrompt.trim();
}
