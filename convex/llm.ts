import OpenAI from "openai";

const openai = new OpenAI(
  { apiKey: '', dangerouslyAllowBrowser: true },
);

function parse(
  response: string,
): {
  isCorrect: boolean,
  quotation: string,
  feedback: string,
  confidence: number,
  citation: string,
} {
  const isCorrect = response.includes("<isCorrect>YES</isCorrect>");
  const quotation = response.match(/<quotation>(.*?)<\/quotation>/)?.[1] || "";
  const feedback = response.match(/<feedback>(.*?)<\/feedback>/)?.[1] || "";
  const confidence = Number(
    response.match(/<confidence>(.*?)<\/confidence>/)?.[1] || "0"
  );
  const citation = response.match(/<keywords>(.*?)<\/keywords>/)?.[1] || "";

  return { isCorrect, quotation, feedback, confidence, citation };
}

export async function prompt(
  question: string,
  rubricAnswer: string,
  studentAnswer: string
) {
  const content =
    `You are a teacher who is an expert at grading assignments solely according to a rubric. Your task is to grade student assignments. You are given a question, rubric answer, and a student answer in the following format:\n
    <question>${question}</question>\n
    <rubricAnswer>${rubricAnswer}</rubricAnswer>\n
    <studentAnswer${studentAnswer}></studentAnswer>\n

    You should determine whether the student's answer is correct according to the question and rubric answer, outputing YES or NO. Then, quote the students' response exactly and enclose every key phrase that led you to your decision in <keywords></keywords>. Do not use any external knowledge. Finally, output a concise feedback for the student's answer. Provide your explanation in the following format:\n

    <isCorrect></isCorrect>\n
    <quotation></quotation>\n
    <feedback></feedback>\n

    Finally, output a float between 0 and 1 indicating your confidence in your evaluation, where 0 is the lowest possible confidence and 1 is the highest possible confidence. Be lenient, and output a lower confidence score when in doubt. Provide your confidence score in the following format:\n

    <confidence></confidence>\n

    Think step by step. You can do it!
    `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "gpt-4o",
  });

  return parse(completion.choices[0].message.content || "");
}
