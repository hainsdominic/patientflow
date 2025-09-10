import prisma from '@/lib/db';
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-pro'),
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
      getAllClinicalAssetsHeaders: tool({
        description:
          'Use this to find relevant questionnaires to follow-up with: Get all available clinical assets headers, use this to get the list of available assets, and then use the getClinicalAsset tool to get the content of a specific asset',
        parameters: z.object({
          userId: z
            .string()
            .describe(
              'User ID for authentication, you can get it from the questionnaire session'
            ),
        }),
        execute: async ({ userId }) => {
          console.log('Getting all available assets header');
          const assets = await prisma.memoryItem.findMany({
            where: {
              userId,
            },
            select: {
              id: true,
              hint: true,
            },
          });
          return assets;
        },
      }),
      getClinicalAsset: tool({
        description:
          'Get a clinical asset by ID, use the getAllClinicalAssetsHeaders tool to get the list of available assets',
        parameters: z.object({
          id: z.string(),
          userId: z
            .string()
            .describe(
              'User ID for authentication, you can get it from the questionnaire session'
            ),
        }),
        execute: async ({ id, userId }) => {
          console.log('Getting clinical asset for', id);
          const asset = await prisma.memoryItem.findUnique({
            where: {
              id,
              userId,
            },
          });
          return asset;
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
