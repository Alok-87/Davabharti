import React from 'react';
import { FaTruck, FaRupeeSign, FaGift, FaShieldAlt, FaUndo, FaMobileAlt } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaTruck className="text-2xl text-gray-900" />,
      color: 'bg-blue-200',
      title: 'Free and Fast Delivery',
      desc: 'Enjoy doorstep delivery across Delhi NCR. With our trusted logistics partners, your medicines and healthcare essentials arrive quickly and safely.',
    },
    {
      icon: <FaRupeeSign className="text-2xl text-gray-900" />,
      color: 'bg-green-200',
      title: 'Big Savings',
      desc: 'Save up to 25% on every order. We offer affordable medicines and exclusive deals to make healthcare lighter on your pocket.',
    },
    {
      icon: <FaGift className="text-2xl text-gray-900" />,
      color: 'bg-pink-200',
      title: 'Attractive Offers',
      desc: 'Get cashbacks, special discounts, and festival promotions. Dava Bharti brings you exciting deals to keep your health and happiness balanced.',
    },
    {
      icon: <FaShieldAlt className="text-2xl text-gray-900" />,
      color: 'bg-yellow-200',
      title: '100% Genuine Products',
      desc: 'We source medicines and products only from trusted manufacturers and distributors, ensuring complete authenticity and reliability.',
    },
    {
      icon: <FaUndo className="text-2xl text-gray-900" />,
      color: 'bg-red-200',
      title: 'Easy Returns & Refunds',
      desc: 'Not satisfied with your order? Our simple return and refund policy ensures a worry-free shopping experience for you.',
    },
    {
      icon: <FaMobileAlt className="text-2xl text-gray-900" />,
      color: 'bg-purple-200',
      title: 'Dava Bharti Mobile App',
      desc: 'Order medicines, book lab tests, and consult doctors directly from your phone. Download our app for healthcare on-the-go.',
    },
  ];

  return (
    <section id="why-choose-us" className="py-12 bg-white sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl">
            Why Choose <span className="text-blue-600">Dava Bharti?</span>
          </h2>
          <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
            From medicines to doctor consultations and lab tests — Dava Bharti is your one-stop
            trusted healthcare partner.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 mt-12 text-center sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-8 flex flex-col justify-center items-center border-gray-200 
              ${index % 3 !== 2 ? 'md:border-r' : ''} 
              ${index < features.length - 3 ? 'md:border-b' : ''}`}
            >
              <div
                className={`w-14 h-14 rounded-full ${feature.color} flex justify-center items-center`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-base text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
