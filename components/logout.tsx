'use client';
import signout from '@/lib/signout';
import { DropdownMenuItem } from './ui/dropdown-menu';

export default function Logout() {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signout();
      }}
    >
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
