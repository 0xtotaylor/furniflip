'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AccountSettings } from './account';
import { NotificationSettings } from './notification';
import { SubscriptionSettings } from './subscription';

const secondaryNavigation = [
  { name: 'Account', href: '#', id: 'account' },
  { name: 'Subscription', href: '#', id: 'subscription' }
  // { name: 'Notifications', href: '#', id: 'notifications' }
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('account');

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings />;
      case 'subscription':
        return <SubscriptionSettings />;
      case 'notifications':
        return null;
      default:
        return null;
    }
  };

  return (
    <main>
      <header className="border-b border-white/5">
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-muted-foreground sm:px-6 lg:px-8"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                  }}
                  className={activeSection === item.id ? 'text-orange-500' : ''}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <div className="divide-y divide-white/5">{renderSection()}</div>
    </main>
  );
}
