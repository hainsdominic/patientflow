'use server';

import prisma from './db';
import MemoryClient from 'mem0ai';

export async function getSystemPrompt(
  key: 'clinician' | 'patient'
): Promise<string> {
  const prompt = await prisma.systemPrompt.findFirst({
    where: {
      key,
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
  await prisma.systemPrompt.upsert({
    where: {
      key,
    },
    create: {
      key,
      content,
    },
    update: {
      content,
    },
  });
}

export async function getMemoryInstructions(): Promise<string> {
  const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });
  const response = await client.getProject({ fields: ['custom_instructions'] });
  const instructions = response.custom_instructions;

  return instructions || '';
}

export async function setMemoryInstructions(
  instructions: string
): Promise<void> {
  const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });
  await client.updateProject({
    custom_instructions: instructions,
  });
  console.log('Updated memory instructions:', instructions);
}
