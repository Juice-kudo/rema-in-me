import { NextResponse } from "next/server";
import openai from "../../../lib/openai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "너는 텍스트 스타일 분석가야. 구어체, 말투, 감정 등을 분석해줘." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("❌ 스타일 분석 실패:", error);
    return NextResponse.json({ error: "요약 실패" }, { status: 500 });
  }
}
