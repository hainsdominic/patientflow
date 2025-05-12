'use server';

import { signOut } from '@/app/auth';

export default async function signout() {
  await signOut();
}
