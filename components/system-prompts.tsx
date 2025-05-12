'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { getSystemPrompt, setSystemPrompt } from '@/lib/system';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';

export default function SystemPrompts() {
  const [clinicianPrompt, setClinicianPrompt] = useState('');
  const [patientPrompt, setPatientPrompt] = useState('');
  const [, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPrompts() {
      const [clinician, patient] = await Promise.all([
        getSystemPrompt('clinician'),
        getSystemPrompt('patient'),
      ]);

      setClinicianPrompt(clinician);
      setPatientPrompt(patient);
      setLoading(false);
    }

    fetchPrompts();
  }, []);

  async function handleSubmit() {
    setLoading(true);
    await Promise.all([
      setSystemPrompt('clinician', clinicianPrompt),
      setSystemPrompt('patient', patientPrompt),
    ]);
    setLoading(false);
    toast({
      title: 'Success',
      description: 'System prompts updated successfully.',
      variant: 'default',
    });
  }

  return (
    <div>
      <Tabs defaultValue='clinician' className='max-w-[600px]'>
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
      <Button className='w-[300px] mt-4 mx-auto' onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
