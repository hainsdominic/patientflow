import prisma from '@/lib/db';
import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system,
    tools: {
      getQuestionnaireSession: tool({
        description: 'Get the questionnaire session from a linkToken',
        parameters: z.object({
          linkToken: z.string(),
        }),
        execute: async ({ linkToken }) => {
          const session = await prisma.questionnaireSession.findUnique({
            where: {
              linkToken,
            },
          });
          return session;
        },
      }),
      endQuestionnaireSession: tool({
        description: 'Close a questionnaire session',
        parameters: z.object({
          linkToken: z.string(),
          summary: z
            .string()
            .describe('Summary of the session created by the assistant'),
        }),
        execute: async ({ linkToken, summary }, { messages }) => {
          await prisma.questionnaireSession.update({
            where: {
              linkToken,
            },
            data: {
              status: 'closed',
              messages: JSON.stringify(messages),
              summary,
            },
          });
          console.log(
            `Questionnaire session with linkToken ${linkToken} closed`
          );
          return `Questionnaire session with linkToken ${linkToken} closed`;
        },
      }),
      stopChat: tool({
        description: 'Stop the chat',
        parameters: z.object({}),
        execute: async () => {
          return 'Chat stopped';
        },
      }),
    },
    maxSteps: 10,
    maxRetries: 3,
    onError: (error) => {
      console.error(error);
    },
  });

  return result.toDataStreamResponse();
}
