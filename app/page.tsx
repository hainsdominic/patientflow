'use client';
import { Thread } from '@/components/assistant-ui/thread';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import {
  AssistantRuntimeProvider,
  ThreadListPrimitive,
} from '@assistant-ui/react';
import {
  ThreadListItems,
  ThreadListNew,
} from '@/components/assistant-ui/thread-list';
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from '@assistant-ui/react';
import { SendQuestionnaireSessionToolUI } from '@/components/tools/SendQuestionnaireSessionInviteToolUI';
import { Button } from '@/components/ui/button';
import { PenIcon } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import {
  getMemoryInstructions,
  getSystemPrompt,
  setMemoryInstructions,
  setSystemPrompt,
} from '@/lib/system';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [clinicianPrompt, setClinicianPrompt] = useState('');
  const [patientPrompt, setPatientPrompt] = useState('');
  const [memoryCustomInstructions, setMemoryCustomInstructions] = useState('');
  const [, setLoading] = useState(true);
  const { toast } = useToast();

  const runtime = useChatRuntime({
    api: '/api/chat',
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
    },
  });

  useEffect(() => {
    async function fetchPrompts() {
      const [clinician, patient, memoryInstructions] = await Promise.all([
        getSystemPrompt('clinician'),
        getSystemPrompt('patient'),
        getMemoryInstructions(),
      ]);

      setClinicianPrompt(clinician);
      setPatientPrompt(patient);
      setMemoryCustomInstructions(memoryInstructions);
      setLoading(false);
    }

    fetchPrompts();
  }, []);

  async function handleSubmit() {
    setLoading(true);
    await Promise.all([
      setSystemPrompt('clinician', clinicianPrompt),
      setSystemPrompt('patient', patientPrompt),
      setMemoryInstructions(memoryCustomInstructions),
    ]);
    setLoading(false);
    toast({
      title: 'Success',
      description: 'System prompts updated successfully.',
      variant: 'default',
    });
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SendQuestionnaireSessionToolUI />
      <Drawer>
        <main className='h-dvh grid grid-cols-[200px_1fr] gap-x-2 px-4 py-4'>
          <ThreadListPrimitive.Root className='flex flex-col items-stretch gap-1.5'>
            <DrawerTrigger asChild>
              <Button
                className='data-[active]:bg-muted hover:bg-muted flex items-center justify-start gap-1 rounded-lg px-2.5 py-2 text-start'
                variant='outline'
              >
                <PenIcon />
                Edit System Prompts
              </Button>
            </DrawerTrigger>
            <ThreadListNew />
            <ThreadListItems />
          </ThreadListPrimitive.Root>
          <Thread />
        </main>
        <DrawerContent>
          <div className='flex flex-col items-center justify-center w-full h-full'>
            <DrawerHeader className='w-[600px] mb-2'>
              <DrawerTitle className='text-center'>
                Change the system prompts
              </DrawerTitle>
              <DrawerDescription className='text-center'>
                System prompts are used to guide the system in its responses.
                They can&apos;t be changed during the conversation, but you can
                change them here.
              </DrawerDescription>
            </DrawerHeader>
            <Tabs defaultValue='clinician' className='w-[600px]'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='clinician'>Clinician</TabsTrigger>
                <TabsTrigger value='patient'>Patient</TabsTrigger>
              </TabsList>
              <TabsContent value='clinician'>
                <Card>
                  <CardHeader>
                    <CardTitle>Clinician</CardTitle>
                    <CardDescription>
                      This will guide the system that you&apos;re using.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <Textarea
                      value={clinicianPrompt}
                      onChange={(e) => setClinicianPrompt(e.target.value)}
                      rows={20}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value='patient'>
                <Card>
                  <CardHeader>
                    <CardTitle>Patient</CardTitle>
                    <CardDescription>
                      This will guide the system that the patient is using.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <Textarea
                      value={patientPrompt}
                      onChange={(e) => setPatientPrompt(e.target.value)}
                      rows={20}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <DrawerFooter className='grid grid-cols-2 gap-2'>
              <Button className='w-[300px]' onClick={handleSubmit}>
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant='outline' className='w-[300px]'>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <Toaster />
    </AssistantRuntimeProvider>
  );
}
