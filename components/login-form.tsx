'use client';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const searchParams = useSearchParams();
  const register = searchParams.get('register') === 'true';
  const [mode, setMode] = useState<'login' | 'register'>(
    register ? 'register' : 'login'
  );
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (
        mode === 'register' &&
        formData.password !== formData.confirmPassword
      ) {
        setError('Passwords do not match');
        return;
      }

      const res = await signIn('credentials', {
        redirect: false,
        username: formData.username,
        password: formData.password,
        ...(mode === 'register' ? { register: true } : {}),
      });

      if (res?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        setError(null);
        router.push('/');
        router.refresh();
      }
    },
    [mode, formData, router]
  );

  useEffect(() => {
    if (session?.user) {
      router.push('/');
    }
  }, [router, session]);

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>
            Welcome {mode === 'login' ? 'back' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as 'login' | 'register')}
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='register'>Register</TabsTrigger>
              <TabsTrigger value='login'>Login</TabsTrigger>
            </TabsList>
            {error && (
              <div className='text-sm text-red-500 text-center pt-4'>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <TabsContent value='register'>
                <CardContent className='space-y-2 pt-6'>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='username'>Username</Label>
                      <Input
                        id='username'
                        name='username'
                        type='text'
                        placeholder='john_doe'
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='password'>Password</Label>
                      <Input
                        id='password'
                        name='password'
                        type='password'
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='confirmPassword'>Confirm Password</Label>
                      <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type='submit' className='w-full'>
                    Register
                  </Button>
                </CardFooter>
              </TabsContent>
              <TabsContent value='login'>
                <CardContent className='space-y-2 pt-6'>
                  <div className='grid gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='username'>Username</Label>
                      <Input
                        id='username'
                        name='username'
                        type='text'
                        placeholder='john_doe'
                        required
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                        <a
                          href='#'
                          className='ml-auto text-sm underline-offset-4 hover:underline'
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id='password'
                        name='password'
                        type='password'
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type='submit' className='w-full'>
                    Login
                  </Button>
                </CardFooter>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
      <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{' '}
        and <a href='#'>Privacy Policy</a>.
      </div>
    </div>
  );
}
