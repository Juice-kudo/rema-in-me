import { NextResponse } from 'next/server'
import openai from '@/lib/openai'
import { generateKakaoPrompt } from '@/lib/generateKakaoPrompt'
import { ChatCompletionMessageParam } from 'openai/resources'

export async function POST(req: Request) {
  const body = await req.json()

  const {
    messages,
    exampleMessages,
    userName,
    partnerName,
    userNickname,
    partnerNickname,
  } = body

  const systemPrompt = generateKakaoPrompt(
    exampleMessages,
    userName,
    partnerName,
    userNickname,
    partnerNickname
  )

  const chatMessages: ChatCompletionMessageParam[] = [
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
