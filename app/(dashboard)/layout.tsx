import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-sm z-50'>
          <div className='flex items-center gap-2 px-3'>
            <SidebarTrigger />
          </div>
        </header>
        {children}
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
