'use client'
import React from 'react';
import Link from 'next/link';
import { Pill, Stethoscope, ShieldCheck, PhoneCall, Icon } from 'lucide-react'; 
import { HomePageResponse } from '@/features/homepage/homepage';

type ConsultationCard = NonNullable<HomePageResponse['consultationCards']>[0];

const iconMap: { [key: string]: React.ElementType } = {
  Pill: Pill,
  Stethoscope: Stethoscope,
  ShieldCheck: ShieldCheck,
  PhoneCall: PhoneCall,
};

const ConsultationCards = ({ cards }: { cards: ConsultationCard[] }) => {
  if (!Array.isArray(cards) || cards.length === 0) {
    return null;
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-18 my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => {
          const IconComponent = iconMap[c.icon] || Pill;
          return (
            <Link
              key={c.id}
              href={c.href}
              className={`${c.bg} rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition`}
            >
              <div><IconComponent className="w-8 h-8 text-gray-700" /></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{c.description}</p>
                <span className="text-sm font-medium text-primary mt-2 block">{c.cta}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ConsultationCards;
