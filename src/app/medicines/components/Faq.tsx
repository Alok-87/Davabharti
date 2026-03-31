'use client';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQ[];
}

export default function Faq({ title = 'Frequently Asked Questions', faqs }: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-manrope  font-bold text-gray-900 leading-tight">
            {title}
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="accordion-group space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-gray-300 rounded-xl p-4 md:p-5 transition duration-300 `}
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="flex items-center justify-between w-full text-left text-lg font-medium text-gray-900 transition cursor-pointer duration-300 "
              >
                <h5>{faq.question}</h5>

                {/* Icons */}
                {activeIndex === index ? (
                  <svg
                    className="w-6 h-6 text-primary transition duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.6}
                      d="M6 12h12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-900 transition duration-300 group-hover:text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.6}
                      d="M6 12h12M12 18V6"
                    />
                  </svg>
                )}
              </button>

              {/* Accordion Content */}
              <div
                className={`overflow-hidden transition-all duration-100 ease-in-out ${
                  activeIndex === index ? 'max-h-60 mt-2' : 'max-h-0'
                }`}
              >
                <p className="text-base text-gray-700 font-normal leading-6 pr-2">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
