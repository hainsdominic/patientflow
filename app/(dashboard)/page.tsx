'use client';
import { Thread } from '@/components/assistant-ui/thread';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react';
import { SendQuestionnaireSessionToolUI } from '@/components/tools/SendQuestionnaireSessionInviteToolUI';

export default function Home() {
  const runtime = useChatRuntime({
    api: '/api/chat',
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SendQuestionnaireSessionToolUI />
      <main className='h-[calc(100dvh-4rem)] w-full px-4 py-4'>
        <Thread />
      </main>
    </AssistantRuntimeProvider>
  );
}
