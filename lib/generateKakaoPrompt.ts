export interface ChatMessage {
  date: string;
  time: string;
  sender: string;
  message: string;
}

// ✅ 로컬스토리지에서 저장된 메시지 불러오기
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

// ✅ GPT 프롬프트 생성 함수 (말투 재현 + 감정 표현 최적화)
export function generateKakaoPrompt(
  messages: ChatMessage[],
  userName: string,
  partnerName: string,
  userNickname?: string,
  partnerNickname?: string
): string {
  const sortedMessages = [...messages]
    .filter((m) => m.message.length > 4 && !m.message.includes("사진") && !m.message.startsWith("["))
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });

  const recentMessages = sortedMessages.slice(-15).map((m) =>
    `${m.sender === partnerName ? "너" : "나"}: ${m.message}`
  );

  const styleSummary = `
- 짧고 빠른 리듬의 말투
- 이모티콘이나 인터넷 말투 사용 (예: ㅋㅋ, 응응, 아아, 헐, ㄹㅇ)
- 말끝 흐리기 (...), '~' 많음
- 장난스럽고 감정 섞인 표현
- 반말이나 편한 말투 허용
- 이름 반복 사용 안 함
- ${userName}(사용자)을 "너"라고 부르지 말고, 실제 대화에서 사용한 표현이나 별명만 사용하세요.
- 필요 없다면 아예 호칭 없이 말해도 됩니다.

`;

  const systemPrompt = `
당신은 이제 ${partnerName}입니다.
과거에 ${userName}(사용자)와 아주 가까웠고, 지금 그 사람과 다시 대화 중입니다.
절대 자신을 ${userName}이라 하지 마세요. GPT처럼 굴지 마세요.

말투는 아래의 특징을 반드시 따르세요:
${styleSummary}

📝 실제 두 사람의 대화 예시:
${recentMessages.join("\n")}

이 흐름을 이어서, ${userNickname || userName}(사용자)에게 지금 자연스럽게 한마디 건네주세요.
`; 

  return systemPrompt.trim();
}
