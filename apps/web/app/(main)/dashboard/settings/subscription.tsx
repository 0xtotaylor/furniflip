'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseProvider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const frequencies = [
  { value: 'monthly', label: 'Monthly', priceSuffix: '/month' },
  { value: 'annually', label: 'Annually', priceSuffix: '/year' }
];

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: {
      monthly: '/register',
      annually: '/register'
    },
    price: { monthly: '$0', annually: '$0' },
    description: 'The essentials to start your furniture flipping journey.',
    features: [
      '5 inventory items',
      'Basic photo analysis',
      'Standard catalog template'
    ],
    mostPopular: false
  },
  {
    name: 'Basic',
    id: 'tier-basic',
    href: {
      monthly: 'https://buy.stripe.com/00g3eAfp8dNV6QMcMM',
      annually: 'https://buy.stripe.com/aEU8yUdh0119grm147'
    },
    price: { monthly: '$9.99', annually: '$99.90' },
    description: 'A plan that scales with your furniture flipping journey.',
    features: [
      '50 inventory items',
      'Advanced photo analysis',
      'Up to 10 autopilot listings',
      'Enhanced catalog template'
    ],
    mostPopular: true
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: {
      monthly: 'https://buy.stripe.com/bIY16s5OycJRb72eUV',
      annually: 'https://buy.stripe.com/14k5mI3Gq119a2YcMQ'
    },
    price: { monthly: '$19.99', annually: '$199.90' },
    description: 'Dedicated support and advanced features for power flippers.',
    features: [
      'Unlimited inventory items',
      'Advanced photo analysis',
      'Unlimited autopilot listings',
      'Customizable catalog templates',
      'Dynamic pricing and negotiations'
    ],
    mostPopular: false
  }
];

export function SubscriptionSettings() {
  const { profile } = useSupabase();
  const [frequency, setFrequency] = useState(frequencies[0]);

  const getButtonConfig = (
    tierName: string,
    tierHref: { monthly: string; annually: string }
  ) => {
    if (profile?.tier === 'Premium') {
      if (tierName === 'Premium') {
        return { text: 'Current', href: '#', disabled: true };
      } else {
        return {
          text: 'Downgrade',
          href: 'https://billing.stripe.com/p/login/eVa4jhgAgcOb17W6oo',
          disabled: false
        };
      }
    } else if (profile?.tier === 'Basic') {
      if (tierName === 'Free') {
        return {
          text: 'Downgrade',
          href: 'https://billing.stripe.com/p/login/eVa4jhgAgcOb17W6oo',
          disabled: false
        };
      } else if (tierName === 'Basic') {
        return { text: 'Current', href: '#', disabled: true };
      } else if (tierName === 'Premium') {
        return {
          text: 'Upgrade',
          href: 'https://billing.stripe.com/p/login/eVa4jhgAgcOb17W6oo',
          disabled: false
        };
      }
    } else if (profile?.tier === 'Free' && tierName === 'Free') {
      return { text: 'Current', href: '#', disabled: true };
    }

    return {
      text:
        profile?.tier === 'Free' && tierName !== 'Free'
          ? 'Upgrade'
          : 'Get started',
      href: tierHref[frequency.value as 'monthly' | 'annually'],
      disabled: false
    };
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency.value}
            onValueChange={(value) => {
              const selectedFrequency = frequencies.find(
                (f) => f.value === value
              );
              if (selectedFrequency) {
                setFrequency(selectedFrequency);
              }
            }}
            className="flex rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            {frequencies.map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="peer sr-only"
                />
                <label
                  htmlFor={option.value}
                  className="cursor-pointer rounded-full px-2.5 py-1 block transition-colors peer-data-[state=checked]:bg-orange-600 peer-data-[state=checked]:text-white"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => {
            const buttonConfig = getButtonConfig(tier.name, tier.href);
            return (
              <div
                key={tier.id}
                className={clsx(
                  tier.mostPopular
                    ? 'ring-2 ring-orange-600'
                    : 'ring-1 ring-gray-200',
                  'rounded-3xl p-8 xl:p-10'
                )}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={clsx(
                      tier.mostPopular ? 'text-orange-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-orange-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-orange-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price[frequency.value as 'monthly' | 'annually']}
                  </span>
                  {tier.name !== 'Free' && (
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      {frequency.priceSuffix}
                    </span>
                  )}
                </p>
                {buttonConfig.disabled ? (
                  <button
                    disabled
                    className="mt-6 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 text-gray-400 bg-gray-100 cursor-not-allowed"
                  >
                    {buttonConfig.text}
                  </button>
                ) : (
                  <Link
                    href={buttonConfig.href}
                    aria-describedby={tier.id}
                    className={clsx(
                      tier.mostPopular
                        ? 'bg-orange-600 text-white shadow-sm hover:bg-orange-500'
                        : 'text-orange-600 ring-1 ring-inset ring-orange-200 hover:ring-orange-300',
                      'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600'
                    )}
                  >
                    {buttonConfig.text}
                  </Link>
                )}
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check
                        className="h-5 w-5 flex-none text-orange-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
