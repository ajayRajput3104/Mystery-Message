import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { success } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // const result= streamText({
    //   model: openai("gpt-4o"),
    //   prompt,
    // });

    const result = streamText({
      model: google("gemini-2.0-flash"),
      prompt,
    });
    const output = await result.text;

    return NextResponse.json(
      {
        success: true,
        message: "message straming successufully",
        result: output,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("suggest-message generation error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
