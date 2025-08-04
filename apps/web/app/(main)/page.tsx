import Link from 'next/link';
import { Pricing } from './pricing';
import { Features } from './features';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Typewriting } from '@/components/ui/typewriting';
import { DeviceFrame } from '@/components/ui/device-frame';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Header />
      <div className="relative isolate pt-10 min-h-screen flex flex-col justify-start items-center md:justify-center">
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
            width="100%"
            height="100%"
            strokeWidth={0}
          />
        </svg>
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto lg:max-w-xl">
            <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI-enabled
            </h1>
            <Typewriting />
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Tired of spending hours creating catalogs, posting, and managing
              furniture sales on marketplaces? We transform your photos into
              professional catalogs and handle the entire sales cycle for you.
            </p>
            <div className="mt-10 flex items-center justify-between sm:justify-start gap-x-4">
              <Link
                href="/register"
                className="flex-grow sm:flex-grow-0 rounded-md bg-orange-500 px-4 py-3 sm:px-5 sm:py-3 text-base sm:text-lg font-semibold text-white text-center shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Get started
              </Link>
              <Link
                href="#features"
                className="flex-grow sm:flex-grow-0 px-4 py-3 sm:px-5 sm:py-3 text-base sm:text-lg font-semibold leading-6 text-gray-900 text-center"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <DeviceFrame />
        </div>
      </div>
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
