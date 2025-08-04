import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Settings } from './settings';

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Manage your account information, subscriptions, and notification
          settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Settings />
      </CardContent>
    </Card>
  );
}
