import PatientChat from '@/components/pages/PatientChat';
import prisma from '@/lib/db';
import { getSystemPrompt } from '@/lib/system';

export default async function Home({
  params,
}: {
  params: Promise<{ linkToken: string }>;
}) {
  const linkToken = (await params).linkToken;

  const system = await getSystemPrompt('patient');

  const greetingMessage = (
    await prisma.questionnaireSession.findFirst({
      where: {
        linkToken,
      },
      select: {
        greetingMessage: true,
      },
    })
  )?.greetingMessage;

  return (
    <PatientChat
      linkToken={linkToken}
      system={system}
      greetingMessage={greetingMessage || 'Hi'}
    />
  );
}
