'use client';

import Typewriter from 'typewriter-effect';

export function Typewriting() {
  return (
    <h1 className="text-6xl font-bold tracking-tight">
      <span className="flex flex-col">
        <span className="text-orange-500">
          <Typewriter
            options={{
              strings: [
                'desk',
                'chair',
                'TV',
                'table',
                'dresser',
                'lamp',
                'mattress',
                'bookshelf',
                'futon',
                'nightstand',
                'mirror',
                'rug'
              ],
              autoStart: true,
              loop: true
            }}
          />
        </span>
        <span className="mt-2">sales</span>
      </span>
    </h1>
  );
}
