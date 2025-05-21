'use client';
import { Thread } from '@/components/assistant-ui/thread';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react';
import { useState } from 'react';

export default function PatientChat({
  linkToken,
  system,
  greetingMessage,
}: {
  linkToken: string;
  system: string;
  greetingMessage: string;
}) {
  const [chatEnded, setChatEnded] = useState(false);

  const runtime = useChatRuntime({
    api: '/api/p/chat',
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
    initialMessages: [
      {
        role: 'system',
        content: `${system} This session's linkToken is ${linkToken}.`,
      },
      {
        role: 'assistant',
        content: greetingMessage,
      },
    ],
    onFinish(message) {
      if (
        message.content.find(
          (c) => c.type === 'tool-call' && c.toolName.includes('stopChat')
        )
      ) {
        setChatEnded(true);
      }
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <main className='h-dvh px-4 py-4'>
        <Thread disabled={chatEnded} />
      </main>
    </AssistantRuntimeProvider>
  );
}
