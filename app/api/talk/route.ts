import { NextResponse } from 'next/server';
import openai from '../../../lib/openai';
import { generateKakaoPrompt } from '../../../lib/generateKakaoPrompt';

export async function POST(req: Request) {
  const {
    messages,
    exampleMessages,
    userName,
    partnerName,
    userNickname,
    partnerNickname
  } = await req.json();

  const prompt = await generateKakaoPrompt(
    exampleMessages,
    userName,
    partnerName,
    userNickname,
    partnerNickname
  );

  const chatMessages = [
    { role: 'system', content: prompt },
    ...messages
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatMessages,
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('❌ GPT 응답 실패:', error);
    return NextResponse.json({ error: 'GPT 응답 실패' }, { status: 500 });
  }
}
