/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import prisma from '@/lib/db';

async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
        register: {},
      },
      authorize: async (credentials) => {
        const lowercaseUsername = (
          credentials.username as string
        ).toLowerCase();

        const user = await prisma.user.findFirst({
          where: { username: lowercaseUsername },
        });

        if (!user) {
          const hashedPassword = await saltAndHashPassword(
            credentials.password as string
          );

          if (credentials.register) {
            return await prisma.user.create({
              data: {
                username: lowercaseUsername,
                password: hashedPassword,
              },
            });
          } else {
            return null;
          }
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.user = user;
      }
      if (trigger === 'update') {
        const updatedUser = await prisma.user.findUnique({
          where: {
            id: (token?.user as { id: string; username: string })?.id,
          },
        });
        token.user = {
          id: updatedUser?.id,
          username: updatedUser?.username,
        };
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
});
