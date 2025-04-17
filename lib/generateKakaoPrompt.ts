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

// ✅ GPT를 이용한 말투 요약 생성 함수
export async function fetchStyleSummaryFromGPT(messages: ChatMessage[]): Promise<string> {
  const sample = messages
    .filter((m) => m.message.length > 4)
    .slice(-30)
    .map((m) => `${m.sender}: ${m.message}`)
    .join("\n");

  const prompt = `다음은 두 사람이 나눈 카카오톡 메시지 일부야. 이 중에서 상대방(${messages[0]?.sender})의 말투, 어조, 감정 스타일을 요약해줘. 자주 쓰는 단어, 문장 길이, 말끝 표현, 감정 표현 방식 등을 구체적으로 정리해줘.:
\n${sample}`;

  const res = await fetch("/api/style-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.summary || "";
}

// ✅ GPT 프롬프트 생성 함수
export async function generateKakaoPrompt(
  messages: ChatMessage[],
  userName: string,
  partnerName: string,
  userNickname?: string,
  partnerNickname?: string
): Promise<string> {
  const sortedMessages = [...messages]
    .filter((m) => m.message.length > 4 && !m.message.includes("사진") && !m.message.startsWith("["))
    .sort((a, b) => {
      const dateTimeA = new Date(`${a.date} ${a.time}`);
      const dateTimeB = new Date(`${b.date} ${b.time}`);
      return dateTimeA.getTime() - dateTimeB.getTime();
    });

  const recentMessages = sortedMessages.slice(-15).map((m) => `${m.sender}: ${m.message}`);
  const styleSummary = await fetchStyleSummaryFromGPT(sortedMessages);

  const systemPrompt = `
당신은 ${partnerName}입니다.
지금 ${userName}(사용자)와 다시 대화하고 있습니다.

당신은 GPT가 아닙니다. 오직 ${partnerName}으로 행동하고 말하세요.
절대로 자신을 ${userName}이라고 하지 마세요.

💡 대화 규칙:
- 당신은 ${partnerName}이고, 지금 ${userName}의 메시지에 감정적으로 반응하는 입장입니다.
- 새로운 이야기, 제삼자 이야기, 설명을 하지 마세요.
- 감정을 담되, 말은 짧고 자연스럽게. 끊긴 문장, '~', '...', 이모티콘도 허용됩니다.
- 이름을 반복하거나 존칭을 쓰지 않아도 됩니다.

🧠 말투 분석 요약:
${styleSummary}

📝 실제 카카오톡 대화 일부:
${recentMessages.join("\n")}

이 흐름을 이어서, 지금 ${userNickname || userName}(사용자)의 말에 반응하듯 자연스럽게 한마디 건네주세요.
`;

  return systemPrompt.trim();
}
