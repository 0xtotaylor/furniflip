import { Camera, Zap, Store, Bot } from 'lucide-react';

const features = [
  {
    name: 'Snap a photo',
    description:
      'Simply use your smartphone to capture clear images of the furniture you want to sell. Our app guides you to take optimal photos for the best results.',
    icon: Camera
  },
  {
    name: 'AI magic',
    description:
      'Our advanced AI analyzes your photos, accurately identifying items, assessing condition, and determining competitive market prices based on current trends and demand.',
    icon: Zap
  },
  {
    name: 'Auto-listing',
    description:
      "With your approval, we automatically create attractive listings and post them across multiple popular marketplaces, maximizing your furniture's visibility to potential buyers.",
    icon: Store
  },
  {
    name: 'Sell on autopilot',
    description:
      'Our AI agents work tirelessly 24/7, handling inquiries, negotiations, and sales processes. They ensure you get the best possible price while you focus on other priorities.',
    icon: Bot
  }
];

export function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sell your furniture with just a photo
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform transforms your photos into professional
            catalogs and manages the entire sales process, so you can sell
            without the hassle.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
                    <feature.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
