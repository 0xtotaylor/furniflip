'use server';

import { createClient } from '@/lib/supabase/server';

export async function updatePassword(password: string) {
  const supabase = createClient();

  if (typeof password !== 'string' || password.trim() === '') {
    throw new Error('Password must be a non-empty string');
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw Error(error.message);
}

export async function updatePersonalInformation(formData: FormData) {
  const supabase = createClient();

  const updates: {
    first_name?: FormDataEntryValue | null;
    last_name?: FormDataEntryValue | null;
  } = {};

  const firstName = formData.get('firstName');
  if (firstName !== null) {
    updates.first_name = firstName;
  }

  const lastName = formData.get('lastName');
  if (lastName !== null) {
    updates.last_name = lastName;
  }

  if (Object.keys(updates).length > 0) {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw Error(error.message);
  }
}

export async function deleteUser() {
  const supabase = createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/core/profiles/delete`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`
      }
    }
  );
  return await supabase.auth.signOut();
}
