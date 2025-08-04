'use client';

import { Button } from '@/components/ui/button';
import { SettingsSection } from '@/components/ui/settings-section';

export function NotificationSettings() {
  return (
    <SettingsSection
      title="Notification Preferences"
      description="Choose how you want to be notified about account activity."
    >
      <div className="md:col-span-2">
        <p>Email notifications: Enabled</p>
        <Button className="mt-4">Update Preferences</Button>
      </div>
    </SettingsSection>
  );
}
