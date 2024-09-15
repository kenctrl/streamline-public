import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "",
  dangerouslyAllowBrowser: true
});

function parse(response: string): {
  response: string;
  questions: string[];
  studentResponses: string[];
} {
  const questionRegex = /<question>(.*?)<\/question>/gs;
  const studentResponseRegex = /<response>(.*?)<\/response>/gs;

  const questionMatches = response.match(questionRegex) || [];
  const studentResponseMatches = response.match(studentResponseRegex) || [];

  const questions = questionMatches.map((match) =>
    match.replace(/<\/?question>/g, "").trim()
  );
  const studentResponses = studentResponseMatches.map((match) =>
    match.replace(/<\/?response>/g, "").trim()
  );

  return { response, questions, studentResponses };
}

export async function prompt(image: any) {
  const content: OpenAI.Chat.ChatCompletionContentPart[] = [
    {
      type: "text",
      text: `You are a teacher who is grading student assignments. For the provided image, your job is to determine the student's written answers for each assigned question number. The images may be typed, and they may be handwritten. Either way, provide the most accurate depiction of the text as you possibly can.\n

        You should provide your answers in the following format:\n

        <question>[THE NUMBER OR LABEL OF THE QUESTION GOES HERE]</question>\n
        <response>[THE ACTUAL RESPONSE GOES HERE]</response>\n
        
        There may be more than one questions on the image, and thus you may return more than one answer.\n

        Think step by step. You can do it!
        `,
    },
    {
      type: "image_url",
      image_url: {
        url: `data:image${image}`,
      },
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: content }],
    model: "gpt-4o",
  });

  return parse(completion.choices[0].message.content || "");
}
