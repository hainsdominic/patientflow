'use server';

import { auth } from '@/app/auth';
import prisma from './db';

export async function getSystemPrompt(
  key: 'clinician' | 'patient'
): Promise<string> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('User not authenticated');
  }
  const userId = session.user.id;

  const prompt = await prisma.systemPrompt.findFirst({
    where: {
      key,
      userId,
    },
  });

  if (!prompt) {
    return '';
  }

  return prompt?.content;
}

export async function setSystemPrompt(
  key: 'clinician' | 'patient',
  content: string
): Promise<void> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error('User not authenticated');
  }
  const userId = session.user.id;
  console.log('uesrId', userId);
  await prisma.systemPrompt.upsert({
    where: {
      user_prompt_unique: { userId, key },
    },
    create: {
      key,
      content,
      userId,
    },
    update: {
      content,
    },
  });
}
