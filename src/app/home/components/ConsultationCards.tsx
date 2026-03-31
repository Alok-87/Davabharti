import React from 'react';
import Link from 'next/link';
import { Pill, Stethoscope, ShieldCheck, PhoneCall } from 'lucide-react'; // temp icons, replace with images

const ConsultationCards = () => {
  const cards = [
    {
      title: 'Get upto 20%* off on Medicines',
      desc: 'Upload your prescription and save instantly on medicines.',
      cta: 'UPLOAD NOW',
      href: '/select-prescription',
      icon: <Pill className="w-8 h-8 text-gray-700" />,
      bg: 'bg-green-50',
    },
    {
      title: 'Doctor Appointment',
      desc: 'Book your doctor appointments hassle-free with Davabharti.',
      cta: 'BOOK NOW',
      href: '/comming-soon',
      icon: <Stethoscope className="w-8 h-8 text-gray-700" />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Health Insurance',
      desc: 'Explore affordable health insurance plans for your family.',
      cta: 'EXPLORE PLANS',
      href: '/comming-soon',
      icon: <ShieldCheck className="w-8 h-8 text-gray-700" />,
      bg: 'bg-amber-50',
    },
    {
      title: '24x7 Support',
      desc: 'Call our support team for medicine orders or consultations.',
      cta: 'CALL NOW',
      href: '/Inquiry',
      icon: <PhoneCall className="w-8 h-8 text-gray-700" />,
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-20 my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, index) => (
          <Link
            key={index}
            href={c.href}
            className={`${c.bg} rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition`}
          >
            <div>{c.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
              <span className="text-sm font-medium text-indigo-600 mt-2 block">{c.cta}</span>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
};

export default ConsultationCards;
