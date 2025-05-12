import prisma from '@/lib/db';
import { streamText, tool } from 'ai';
import { auth } from '@/app/auth';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { LoopsClient } from 'loops';
import { getSystemPrompt } from '@/lib/system';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { messages } = await req.json();

  const system = await getSystemPrompt('clinician');

  const result = streamText({
    model: google('gemini-2.5-flash-preview-04-17'),
    messages,
    system,
    tools: {
      createQuestionnaireSession: tool({
        description:
          'Create a new session for the questionnaire, use clinicalAsset to get the right questionnaire',
        parameters: z.object({
          patientName: z.string(),
          patientEmail: z.string().describe('Email address of the patient'),
          questionnaireTitle: z
            .string()
            .describe(
              'Title of the questionnaire, found in the title of the clinicalAsset'
            ),
          questionnaireContent: z
            .string()
            .describe(
              'The content of the questionnaire, found in the content of the clinicalAsset'
            ),
        }),
        execute: async ({
          patientName,
          patientEmail,
          questionnaireTitle,
          questionnaireContent,
        }) => {
          console.log(
            'Creating questionnaire session for',
            patientName,
            patientEmail
          );
          await prisma.questionnaireSession.create({
            data: {
              patientName,
              patientEmail,
              questionnaireTitle,
              questionnaireContent,
              linkToken: uuidv4(),
              userId,
            },
          });
          return `Questionnaire session created for ${patientName} (${patientEmail})`;
        },
      }),
      sendQuestionnaireSessionInvite: tool({
        description: 'Send an invite to the questionnaire session',
        parameters: z.object({
          questionnaireSessionUrl: z
            .string()
            .describe('URL to the questionnaire session'),
          patientEmail: z.string().describe('Email address of the patient'),
        }),
        execute: async ({ questionnaireSessionUrl, patientEmail }) => {
          const res = await loops.sendTransactionalEmail({
            transactionalId: 'cm7xlfnj505v1jq2mup2ngxmt',
            email: patientEmail,
            dataVariables: {
              url: questionnaireSessionUrl,
            },
          });

          if (res.success) {
            console.log(`Questionnaire session invite sent to ${patientEmail}`);
            return `Questionnaire session invite sent to ${patientEmail}`;
          } else {
            return `Failed to send questionnaire session invite to ${patientEmail}: ${JSON.stringify(
              res
            )}}`;
          }
        },
      }),
      getQuestionnaireSessionUrl: tool({
        description: 'Get the URL to the questionnaire session',
        parameters: z.object({
          linkToken: z.string(),
        }),
        execute: async ({ linkToken }) => {
          console.log('Getting questionnaire session URL for', linkToken);
          return `${process.env.NEXT_PUBLIC_BASE_URL}/q/${linkToken}`;
        },
      }),
      getQuestionnaireSessions: tool({
        description: 'Get all questionnaire sessions',
        parameters: z.object({}),
        execute: async () => {
          console.log('Getting all questionnaire sessions');
          const sessions = await prisma.questionnaireSession.findMany({
            where: {
              userId,
            },
          });
          return sessions;
        },
      }),
      deleteQuestionnaireSession: tool({
        description: 'Delete a questionnaire session',
        parameters: z.object({
          linkToken: z.string(),
        }),
        execute: async ({ linkToken }) => {
          console.log('Deleting questionnaire session for', linkToken);
          await prisma.questionnaireSession.delete({
            where: {
              linkToken,
            },
          });
          return `Questionnaire session deleted for ${linkToken}`;
        },
      }),
      getAllClinicalAssetsHeaders: tool({
        description:
          'Get all available clinical assets headers, use this to get the list of available assets, and then use the getClinicalAsset tool to get the content of a specific asset',
        parameters: z.object({}),
        execute: async () => {
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
      saveClinicalAsset: tool({
        description: 'Save a clinical asset',
        parameters: z.object({
          type: z.enum(['questionnaire-template', 'clinical-report-template']),
          title: z
            .string()
            .describe('Title of the asset, like the title of a questionnaire'),
          content: z.string().describe('The content of the asset'),
        }),
        execute: async ({ type, title, content }) => {
          console.log('Saving clinical asset');
          const asset = await prisma.memoryItem.create({
            data: {
              hint: JSON.stringify({
                type,
                title,
              }),
              content,
              userId,
            },
          });
          return asset;
        },
      }),
      getClinicalAsset: tool({
        description:
          'Get a clinical asset by ID, use the getAllClinicalAssetsHeaders tool to get the list of available assets',
        parameters: z.object({
          id: z.string(),
        }),
        execute: async ({ id }) => {
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
      deleteClinicalAsset: tool({
        description: 'Delete a clinical asset',
        parameters: z.object({
          id: z.string(),
        }),
        execute: async ({ id }) => {
          console.log('Deleting clinical asset for', id);
          await prisma.memoryItem.delete({
            where: {
              id,
              userId,
            },
          });
          return `Clinical asset deleted for ${id}`;
        },
      }),
      updateClinicalAsset: tool({
        description:
          'Update a clinical asset, use the ID to update the asset (find it using the getAllClinicalAssetsHeaders tool)',
        parameters: z.object({
          id: z.string(),
          type: z
            .enum(['questionnaire-template', 'clinical-report-template'])
            .optional(),
          title: z
            .string()
            .describe('Title of the asset, like the title of a questionnaire')
            .optional(),
          content: z.string().describe('The content of the asset').optional(),
        }),
        execute: async ({ id, type, title, content }) => {
          console.log('Updating clinical asset for', id);
          const currentAsset = await prisma.memoryItem.findUnique({
            where: {
              id,
            },
          });

          const currentHint = JSON.parse(currentAsset?.hint || '{}');

          const asset = await prisma.memoryItem.update({
            where: {
              id,
            },
            data: {
              hint: JSON.stringify({
                type: type || currentHint.type,
                title: title || currentHint.title,
              }),
              content: content || currentAsset?.content,
            },
          });
          return asset;
        },
      }),
      saveCompletedClinicalReport: tool({
        description: 'Save a completed clinical report',
        parameters: z.object({
          patientName: z.string(),
          patientEmail: z.string().describe('Email address of the patient'),
          reportTitle: z
            .string()
            .describe(
              'Title of the report, obtained from the clinical report template (clinicalAsset)'
            ),
          reportContent: z
            .string()
            .describe('The content of the report, filled by the clinician'),
        }),
        execute: async ({
          patientName,
          patientEmail,
          reportTitle,
          reportContent,
        }) => {
          console.log(
            'Saving completed clinical report for',
            patientName,
            patientEmail
          );
          console.log(
            'Saving completed clinical report for',
            patientName,
            patientEmail
          );
          const report = await prisma.completedClinicalReport.create({
            data: {
              patientName,
              patientEmail,
              reportTitle,
              reportContent,
              userId,
            },
          });
          return report;
        },
      }),
      getCompletedClinicalReportsHeaders: tool({
        description:
          'Get all completed clinical reports headers, use this to get the list of completed reports, and then use the getCompletedClinicalReport tool to get the content of a specific report',
        parameters: z.object({}),
        execute: async () => {
          console.log('Getting all completed clinical reports headers');
          const reports = await prisma.completedClinicalReport.findMany({
            where: {
              userId,
            },
            select: {
              id: true,
              reportTitle: true,
              patientName: true,
              patientEmail: true,
            },
          });
          return reports;
        },
      }),
      getCompletedClinicalReport: tool({
        description:
          'Get a completed clinical report by ID, use the getCompletedClinicalReportsHeaders tool to get the list of available reports IDs and details, then use this tool to get the content of a specific report',
        parameters: z.object({
          id: z.string(),
        }),
        execute: async ({ id }) => {
          console.log('Getting completed clinical report for', id);
          const report = await prisma.completedClinicalReport.findUnique({
            where: {
              id,
              userId,
            },
          });
          return report;
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
