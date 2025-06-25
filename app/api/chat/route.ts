import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const emergencySystemPrompt = `You are an Emergency Assistance AI for an emergency portal application. Your role is to provide helpful, accurate, and calming information about emergency situations, shelters, and safety procedures.

Key responsibilities:
1. Provide information about emergency shelters and evacuation procedures
2. Offer safety tips for various emergency scenarios (earthquakes, floods, fires, etc.)
3. Guide users on emergency preparedness
4. Help users understand emergency alerts and warnings
5. Provide first aid information when appropriate
6. Direct users to relevant emergency services when needed

Important guidelines:
- Always prioritize safety and accuracy
- Be calm and reassuring in your responses
- If someone is in immediate danger, encourage them to call emergency services (911 in the US)
- Provide practical, actionable advice
- Acknowledge the seriousness of emergency situations while remaining helpful
- If you don't know something specific about local emergency procedures, suggest contacting local authorities
- Keep responses concise, informative, and helpful
- Don't be too verbose and stick to the point
- Use clear, simple language that's easy to understand in stressful situations
- Never provide medical advice beyond basic first aid
- Always recommend professional help for serious medical situations
- When asked about the nearest emergency numbers, you should always provide at least 3 and at most 5 nearest emergency numbers. Find the nearest hospital, police station, fire station, and other emergency services.

Context about this emergency portal:
- This is a web application that helps people find emergency shelters
- Users can report damage and view emergency information
- The system tracks earthquakes and other natural disasters
- Users can register for emergency notifications
- The portal supports multiple languages and locations

Remember: Your primary goal is to help people stay safe and informed during emergencies.`;

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 10) {
    // 10 requests per minute
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { message, history, stream = false } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long. Please keep it under 1000 characters." },
        { status: 400 }
      );
    }

    // Prepare conversation history
    const messages = [
      { role: "system" as const, content: emergencySystemPrompt },
      ...(history || []).slice(-10).map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    if (stream) {
      // Streaming response
      const stream = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        model: "llama-3.1-8b-instant",
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      });

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        }),
        {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }
      );
    } else {
      // Non-streaming response
      const completion = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        model: "llama3-8b-8192",
        messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        return NextResponse.json(
          { error: "No response from AI" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: response,
        usage: completion.usage,
      });
    }
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Handle specific OpenAI errors
    if (error.status === 429) {
      return NextResponse.json(
        { error: "OpenAI rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: "OpenAI API key is invalid or missing." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
