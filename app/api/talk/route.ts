import { NextResponse } from 'next/server'
import openai from '@/lib/openai';
import { generateKakaoPrompt } from '@/lib/generateKakaoPrompt'


export async function POST(req: Request) {
  const {
    messages, // 현재 대화 내용 [{ role: 'user' | 'assistant', content: string }]
    exampleMessages, // 카톡 예시 대화 [{ sender, message, ... }]
    userName,
    partnerName,
    userNickname,
    partnerNickname,
  } = await req.json()

  const systemPrompt = generateKakaoPrompt(
    exampleMessages,
    userName,
    partnerName,
    userNickname,
    partnerNickname
  )

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatMessages,
    })

    const reply = response.choices[0].message.content
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('❌ GPT 요청 실패:', error)
    return NextResponse.json({ error: 'GPT 요청 실패' }, { status: 500 })
  }
}
