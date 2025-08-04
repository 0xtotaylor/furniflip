'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/toast-utility';

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await register(new FormData(event.currentTarget));
      showToast({
        type: 'success',
        message: 'Success! Now please confirm your email.'
      });
      router.push('/');
    } catch (error) {
      showToast({
        message: 'Oh snap! Failed to register.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            <p className="mt-6 text-sm text-gray-500">First Name</p>
          </label>
          <div className="mt-2">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full rounded-lg bg-background"
            />
          </div>
        </div>
        <div className="w-1/2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            <p className="mt-6 text-sm text-gray-500">Last Name</p>
          </label>
          <div className="mt-2">
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full rounded-lg bg-background"
            />
          </div>
        </div>
      </div>
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
