import { makeAssistantToolUI } from '@assistant-ui/react';

type SendQuestionnaireSessionInviteArgs = {
  patientEmail: string;
};

export const SendQuestionnaireSessionToolUI = makeAssistantToolUI<
  SendQuestionnaireSessionInviteArgs,
  unknown
>({
  toolName: 'sendQuestionnaireSessionInvite',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ args, status }) => {
    if (status.type === 'running') {
      return <p>Sending email to {args.patientEmail}</p>;
    }
  },
});
