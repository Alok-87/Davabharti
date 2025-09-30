// src/components/shared/ConsultationCards.tsx

import { Video, Home, Phone } from 'lucide-react';

export default function ConsultationCards() {
  const cards = [
    {
      icon: <Video className="w-8 h-8 text-gray-600" />,
      title: 'Video Consultation',
      desc: 'No need to step outside for medical consultation. Meet the doctor online.',
      href: '/consult/video',
    },
    {
      icon: <Home className="w-8 h-8 text-gray-600" />,
      title: 'Clinic Visit',
      desc: 'Book prior appointments online and reserve your slot.',
      href: '/consult/clinic',
    },
    {
      icon: <Phone className="w-8 h-8 text-gray-600" />,
      title: 'Phone Consultation',
      desc: 'Connect with healthcare professionals by phone at your convenience.',
      href: '/consult/phone',
    },
  ];

  return (
    <div className="max-w-8xl mx-auto p-6 px-4 sm:px-6 lg:px-20 mt-5">
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 rounded-md p-4"
        role="list"
      >
        {cards.map((c) => (
          <article
            key={c.title}
            role="listitem"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:bg-[#1f539f] transition-all duration-200 cursor-pointer group h-full"
          >
            <a
              href={c.href}
              className="flex items-start gap-4 focus:outline-none focus-visible:ring-2"
              aria-label={c.title}
            >
              <div>{c.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-white">
                  {c.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white">
                  {c.desc}
                </p>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
