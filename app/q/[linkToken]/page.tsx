import PatientChat from '@/components/pages/PatientChat';
import { getSystemPrompt } from '@/lib/system';

export default async function Home({
  params,
}: {
  params: Promise<{ linkToken: string }>;
}) {
  const linkToken = (await params).linkToken;

  const system = await getSystemPrompt('patient');

  return <PatientChat linkToken={linkToken} system={system} />;
}
