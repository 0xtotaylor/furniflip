'use client';

import { useState } from 'react';
import { login } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/toast-utility';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await login(new FormData(event.currentTarget));
      router.push('/dashboard/inventory');
    } catch (error) {
      showToast({
        message: 'Oh snap! Failed to login.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          <p className="mt-6 text-sm text-gray-500">Email</p>
        </label>
        <div className="mt-2">
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg bg-background md:w-[200px] lg:w-[336px]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          <p className="mt-6 text-sm text-gray-500">Password</p>
        </label>
        <div className="mt-2">
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg bg-background md:w-[200px] lg:w-[336px]"
          />
        </div>
      </div>

      <div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
}
