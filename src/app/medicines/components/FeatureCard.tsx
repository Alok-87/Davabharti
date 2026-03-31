'use client';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import parse from 'html-react-parser';

interface FeatureCardProps {
  heading: string;
  content: string | string[]; // string for HTML/text, string[] for bullet points
  defaultOpen?: boolean;
}

export default function FeatureCard({ heading, content, defaultOpen = false }: FeatureCardProps) {
  return (
    <section className="mt-8 w-full max-w-3xl mx-auto border-t border-gray-200 pt-6">
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center text-lg font-semibold text-gray-900">
              {heading}
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="mt-4 text-gray-700 text-sm prose prose-sm max-w-none">
              {Array.isArray(content) ? (
                <ul className="list-disc pl-5 space-y-1 marker:text-gray-300">
                  {content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                // ✅ This is the correct way
                <>{parse(content)}</>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </section>
  );
}
