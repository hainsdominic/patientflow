import { makeAssistantToolUI } from '@assistant-ui/react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Printer } from 'lucide-react';

type PrintContentArgs = {
  html: string;
};

export const PrintContentToolUI = makeAssistantToolUI<
  PrintContentArgs,
  unknown
>({
  toolName: 'printContent',

  render: ({ args, status }) => {
    const handlePrint = () => {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) return;

      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Preview</title>
            <style>
              @media print {
                body { margin: 1in; font-family: sans-serif; }
                .html-content { max-width: 100%; }
              }
              body { margin: 0; padding: 1rem; font-family: sans-serif; }
              .html-content { max-width: 800px; }
            </style>
          </head>
          <body>
            <div class="html-content">${args.html}</div>
            <script>
              window.onload = () => { window.print(); };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    if (status.type === 'running') {
      return <p>Rendering…</p>;
    }

    return (
      <div className='space-y-4'>
        <Button
          onClick={handlePrint}
          className='bg-slate-600 hover:bg-slate-700 text-white'
        >
          <Printer /> Print / Download
        </Button>
      </div>
    );
  },
});
