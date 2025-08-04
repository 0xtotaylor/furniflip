'use client';

import React, { useEffect, useState } from 'react';
import {
  deleteUser,
  updatePassword,
  updatePersonalInformation
} from '@/lib/settings/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSupabase } from '@/context/SupabaseProvider';
import { SettingsSection } from '@/components/ui/settings-section';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  autoComplete,
  placeholder,
  value,
  onChange,
  disabled = false
}) => (
  <div className="sm:col-span-3">
    <label htmlFor={id} className="block text-sm font-medium leading-6">
      {label}
    </label>
    <div className="mt-2">
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg bg-background"
      />
    </div>
  </div>
);

interface PersonalInformationFormProps {
  profile: any;
  isLoading: boolean;
}

const PersonalInformationForm: React.FC<PersonalInformationFormProps> = ({
  profile,
  isLoading
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
    }
  }, [profile]);

  const handlePersonalInformationSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await updatePersonalInformation(formData);
  };

  return (
    <form className="md:col-span-2" onSubmit={handlePersonalInformationSubmit}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <FormInput
          id="firstName"
          label="First name"
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isLoading}
        />
        <FormInput
          id="lastName"
          label="Last name"
          autoComplete="family-name"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="mt-8 flex">
        <Button type="submit" disabled={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
};

interface ChangePasswordFormProps {
  isLoading: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  isLoading
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      // Handle password mismatch error
      return;
    }
    await updatePassword(newPassword);
  };

  return (
    <form className="md:col-span-2" onSubmit={handlePasswordSubmit}>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <FormInput
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <FormInput
          id="confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="mt-8 flex">
        <Button type="submit" disabled={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
};

interface DeleteAccountFormProps {
  isLoading: boolean;
}

const DeleteAccountForm: React.FC<DeleteAccountFormProps> = ({ isLoading }) => {
  const handleDeleteUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await deleteUser();
  };

  return (
    <form
      className="flex items-start md:col-span-2"
      onSubmit={handleDeleteUser}
    >
      <Button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
      >
        Yes, delete my account
      </Button>
    </form>
  );
};

export function AccountSettings() {
  const { profile, fetchProfile } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profile) {
        await fetchProfile();
      }
      setIsLoading(false);
    };
    loadProfile();
  }, [profile, fetchProfile]);

  return (
    <>
      <SettingsSection
        title="Personal Information"
        description="Use a permanent address where you can receive mail."
      >
        <PersonalInformationForm profile={profile} isLoading={isLoading} />
      </SettingsSection>

      <SettingsSection
        title="Change password"
        description="Update your password associated with your account."
      >
        <ChangePasswordForm isLoading={isLoading} />
      </SettingsSection>

      <SettingsSection
        title="Delete account"
        description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
      >
        <DeleteAccountForm isLoading={isLoading} />
      </SettingsSection>
    </>
  );
}
