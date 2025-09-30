import { Video, Home, Phone } from 'lucide-react';

const consultations = [
  {
    id: 1,
    icon: Video,
    title: 'Video Consultation',
    description:
      'No need to step outside for medical consultation. Visit this tab and meet the doctor online instead.',
  },
  {
    id: 2,
    icon: Home,
    title: 'Clinic Visit',
    description:
      'Book your prior appointment online. Click this tab to reserve your slot for the clinic appointment.',
  },
  {
    id: 3,
    icon: Phone,
    title: 'Phone Consultation',
    description:
      'Connect with healthcare professionals through phone calls. Schedule your consultation at your convenient time.',
  },
];

export default function ConsultationCards() {
  return (
    <div className="max-w-8xl mx-auto p-6 px-4 sm:px-6 lg:px-20 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 rounded-md p-4">
        {consultations.map(({ id, icon: Icon, title, description }) => (
          <div
            key={id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:bg-[#1f539f] transition-all duration-200 cursor-pointer group h-full"
          >
            <div className="flex items-start gap-4">
              <Icon className="w-8 h-8 text-gray-600 group-hover:text-white mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-white">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white">
                  {description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
